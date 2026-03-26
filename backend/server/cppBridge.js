// backend/server/cppBridge.js

const { execFile } = require('child_process');
const path = require('path');

// Correct path to output.exe
const EXE_PATH = path.join(__dirname, '../cpp/output.exe');

/**
 * Run the C++ executable with given arguments and return parsed JSON
 */
function runCpp(args) {
    return new Promise((resolve, reject) => {
        execFile(EXE_PATH, args, { timeout: 5000 }, (error, stdout, stderr) => {
            if (error) {
                console.error('C++ Bridge Error:', error.message);
                return reject({ error: 'C++ execution failed: ' + error.message });
            }

            try {
                const result = JSON.parse(stdout.trim());
                resolve(result);
            } catch (parseErr) {
                console.error('C++ JSON parse error. Output was:', stdout);
                reject({ error: 'Invalid JSON from C++: ' + stdout });
            }
        });
    });
}

// ── PUBLIC FUNCTIONS ─────────────────────────────

function getStage(daysPassed, dlReceived) {
    return runCpp(['--stage', String(daysPassed), dlReceived ? '1' : '0']);
}

function getAlert(daysRemaining, isExpired, inWaitPeriod) {
    return runCpp([
        '--alert',
        String(daysRemaining),
        isExpired ? '1' : '0',
        inWaitPeriod ? '1' : '0'
    ]);
}

function getChecklist(vehicleType) {
    return runCpp(['--checklist', vehicleType]);
}

function getDeadline(day, month, year) {
    return runCpp([
        '--deadline',
        String(day),
        String(month),
        String(year)
    ]);
}

module.exports = {
    getStage,
    getAlert,
    getChecklist,
    getDeadline
};