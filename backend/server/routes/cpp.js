// backend/server/routes/cpp.js
// API routes that call the C++ bridge

const express = require('express');
const router  = express.Router();
const db      = require('../db/db');
const bridge  = require('../cppBridge');

// Helper: calculate days passed from a date string (YYYY-MM-DD)
function getDaysPassed(dateStr) {
    const issued = new Date(dateStr);
    const today  = new Date();
    const diff   = today - issued;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Helper: parse date string into {day, month, year}
function parseDate(dateStr) {
    const d = new Date(dateStr);
    return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
}

// ── GET /api/cpp/stage/:citizen_id ─────────────────────────────
// Returns stage info for a citizen, calculated by C++
router.get('/stage/:citizen_id', async (req, res) => {
    try {
        // Fetch LL date and DL status from DB
        const [rows] = await db.promise().query(
            `SELECT ll_issue_date, dl_issued_date, current_stage 
             FROM license_stages WHERE citizen_id = ?`,
            [req.params.citizen_id]
        );

        if (!rows.length) return res.status(404).json({ error: 'Citizen not found' });

        const record      = rows[0];
        const llDate      = record.ll_issue_date;
        const dlReceived  = !!record.dl_issued_date;

        if (!llDate) {
            return res.json({ stage_number: 1, stage_name: 'll_obtained', message: 'LL not yet recorded.' });
        }

        const daysPassed = getDaysPassed(llDate);

        // Call C++ for stage calculation
        const stageResult = await bridge.getStage(daysPassed, dlReceived);
        res.json({ ...stageResult, days_passed: daysPassed });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.error || err.message });
    }
});

// ── GET /api/cpp/alert/:citizen_id ────────────────────────────
// Returns alert info calculated by C++
router.get('/alert/:citizen_id', async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            `SELECT ll_issue_date, ll_expiry_date FROM license_stages WHERE citizen_id = ?`,
            [req.params.citizen_id]
        );

        if (!rows.length) return res.status(404).json({ error: 'Citizen not found' });

        const llDate = rows[0].ll_issue_date;
        if (!llDate) return res.json({ alert_type: 'none', message: 'No LL date set.' });

        const daysPassed    = getDaysPassed(llDate);
        const totalDays     = 180; // LL valid for 6 months
        const daysRemaining = Math.max(0, totalDays - daysPassed);
        const isExpired     = daysPassed > totalDays;
        const inWaitPeriod  = daysPassed < 30;

        // Call C++ for alert
        const alertResult = await bridge.getAlert(daysRemaining, isExpired, inWaitPeriod);
        res.json(alertResult);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.error || err.message });
    }
});

// ── GET /api/cpp/checklist/:citizen_id ────────────────────────
// Returns document checklist based on vehicle type, from C++
router.get('/checklist/:citizen_id', async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            `SELECT vehicle_type FROM citizens WHERE id = ?`,
            [req.params.citizen_id]
        );

        if (!rows.length) return res.status(404).json({ error: 'Citizen not found' });

        // Map DB vehicle_type to C++ format
        const vtMap = {
            'two_wheeler':   '2W',
            'four_wheeler':  '4W',
            'both':          'Both',
            'commercial':    'Commercial'
        };
        const vehicleType = vtMap[rows[0].vehicle_type] || '2W';

        // Call C++ for checklist
        const checklistResult = await bridge.getChecklist(vehicleType);

        // Also save documents to DB (document_checklist table)
        if (checklistResult.documents && checklistResult.documents.length) {
            // Check if already inserted
            const [existing] = await db.promise().query(
                `SELECT COUNT(*) as cnt FROM document_checklist WHERE citizen_id = ?`,
                [req.params.citizen_id]
            );

            if (existing[0].cnt === 0) {
                const inserts = checklistResult.documents.map(doc => [
                    req.params.citizen_id, doc, false
                ]);
                await db.promise().query(
                    `INSERT INTO document_checklist (citizen_id, document_name, is_submitted) VALUES ?`,
                    [inserts]
                );
            }
        }

        res.json(checklistResult);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.error || err.message });
    }
});

// ── GET /api/cpp/deadline/:citizen_id ────────────────────────
// Returns deadline info calculated by C++
router.get('/deadline/:citizen_id', async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            `SELECT ll_issue_date FROM license_stages WHERE citizen_id = ?`,
            [req.params.citizen_id]
        );

        if (!rows.length || !rows[0].ll_issue_date) {
            return res.status(404).json({ error: 'LL date not found' });
        }

        const { day, month, year } = parseDate(rows[0].ll_issue_date);

        // Call C++ for deadline
        const deadlineResult = await bridge.getDeadline(day, month, year);
        res.json(deadlineResult);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.error || err.message });
    }
});

module.exports = router;