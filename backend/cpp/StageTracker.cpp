#include <iostream>
#include <string>
using namespace std;

class StageTracker {
private:
    int currentStage;
    bool llObtained;
    bool dlObtained;

public:
    // Constructor
    StageTracker() {
        currentStage = 1;
        llObtained   = true;
        dlObtained   = false;
    }

    // Calculate current stage based on days passed
    void calculateStage(int daysPassed, bool dlReceived) {
        dlObtained = dlReceived;

        if (dlReceived) {
            currentStage = 5;
        } else if (daysPassed >= 30 && daysPassed <= 179) {
            currentStage = 3;
        } else if (daysPassed < 30) {
            currentStage = 2;
        } else {
            currentStage = 1; // expired — restart
        }
    }

    // Display all 5 stages with status icons
    void displayStages() {
        cout << "\n===== YOUR DL JOURNEY STAGES =====\n";

        // Stage 1
        cout << "Stage 1 : [DONE]    LL Obtained\n";

        // Stage 2
        if (currentStage >= 2)
            cout << "Stage 2 : [DONE]    Waiting Period (30 days minimum)\n";
        else
            cout << "Stage 2 : [PENDING] Waiting Period (30 days minimum)\n";

        // Stage 3
        if (currentStage >= 3)
            cout << "Stage 3 : [CURRENT] Apply for DL Test at RTO\n";
        else
            cout << "Stage 3 : [PENDING] Apply for DL Test at RTO\n";

        // Stage 4
        if (currentStage >= 4)
            cout << "Stage 4 : [DONE]    Driving Test Cleared\n";
        else
            cout << "Stage 4 : [PENDING] Driving Test Cleared\n";

        // Stage 5
        if (currentStage == 5)
            cout << "Stage 5 : [DONE]    Permanent DL Issued!\n";
        else
            cout << "Stage 5 : [PENDING] Permanent DL Issued\n";
    }

    // Get stage message
    string getStageMessage() {
        if (currentStage == 1) return "You just got your LL. Wait for 30 days.";
        if (currentStage == 2) return "Still in waiting period. Cannot apply yet.";
        if (currentStage == 3) return "You can now apply for DL test at RTO!";
        if (currentStage == 4) return "Test cleared! DL will be issued soon.";
        if (currentStage == 5) return "Congratulations! You have your Permanent DL!";
        return "";
    }

    // Getter
    int getCurrentStage() { return currentStage; }
};