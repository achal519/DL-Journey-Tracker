#include <iostream>
#include "Citizen.cpp"
#include "LearnerLicense.cpp"
#include "DeadlineCalculator.cpp"
#include "StageTracker.cpp"
#include "AlertSystem.cpp"
#include "DocumentChecklist.cpp"
#include "TestGuide.cpp"
using namespace std;

int main() {
    // Create objects of all classes
    Citizen citizen;
    LearnerLicense ll;
    DeadlineCalculator deadline;
    StageTracker tracker;
    AlertSystem alert;
    DocumentChecklist checklist;
    TestGuide guide;

    bool dlReceived = false;

    cout << "==========================================\n";
    cout << "   DL JOURNEY TRACKER — OOP Mini Project  \n";
    cout << "   LL to Permanent License System         \n";
    cout << "==========================================\n";

    // Step 1 — Register citizen
    citizen.setDetails();

    // Step 2 — Enter LL details
    ll.setLLDetails();

    // Step 3 — Calculate deadline
    deadline.calculate(ll.getDay(), ll.getMonth(), ll.getYear());

    // Step 4 — Calculate stage
    tracker.calculateStage(deadline.getDaysPassed(), dlReceived);

    // Step 5 — Generate alert
    alert.generateAlert(
        deadline.getDaysRemaining(),
        deadline.isExpired(),
        deadline.isInWaitPeriod()
    );

    // Step 6 — Generate checklist
    checklist.generateChecklist(citizen.getVehicleType());

    // Step 7 — Load test guide
    guide.loadTips(citizen.getVehicleType());

    // ── MAIN MENU LOOP
    int choice = 0;
    while (choice != 7) {
        cout << "\n==========================================\n";
        cout << "              MAIN MENU                   \n";
        cout << "==========================================\n";
        cout << "1. View My Profile\n";
        cout << "2. View LL Details\n";
        cout << "3. View Stage Tracker\n";
        cout << "4. View Deadline Status\n";
        cout << "5. View Alert\n";
        cout << "6. View Document Checklist\n";
        cout << "7. View RTO Test Guide\n";
        cout << "8. Mark DL as Received\n";
        cout << "9. Exit\n";
        cout << "Enter choice: ";
        cin >> choice;

        if (choice == 1) {
            citizen.displayProfile();
        } else if (choice == 2) {
            ll.displayLLDetails();
        } else if (choice == 3) {
            tracker.displayStages();
            cout << "\nCurrent Status: " << tracker.getStageMessage() << "\n";
        } else if (choice == 4) {
            deadline.displayStatus();
        } else if (choice == 5) {
            alert.displayAlert();
        } else if (choice == 6) {
            checklist.displayChecklist();
        } else if (choice == 7) {
            guide.displayTips();
            guide.displaySigns();
        } else if (choice == 8) {
            dlReceived = true;
            tracker.calculateStage(deadline.getDaysPassed(), dlReceived);
            cout << "\nCongratulations! DL marked as received!\n";
            cout << tracker.getStageMessage() << "\n";
        } else if (choice == 9) {
            cout << "\nThank you for using DL Journey Tracker!\n";
            cout << "Good luck with your Permanent License!\n";
            break;
        } else {
            cout << "Invalid choice. Please enter 1-9.\n";
        }
    }

    return 0;
}