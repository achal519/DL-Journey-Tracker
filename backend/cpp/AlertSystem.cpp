#include <iostream>
#include <string>
using namespace std;

class AlertSystem {
private:
    string alertLevel;
    string alertMessage;

public:
    // Constructor
    AlertSystem() {
        alertLevel   = "";
        alertMessage = "";
    }

    // Generate alert based on days remaining
    void generateAlert(int daysRemaining, bool isExpired, bool isInWait) {
        if (isExpired) {
            alertLevel   = "EXPIRED";
            alertMessage = "Your LL has expired! You must reapply for LL from scratch.\nVisit your nearest RTO office immediately.";
        } else if (isInWait) {
            alertLevel   = "WAITING";
            alertMessage = "You are in the mandatory 30 day waiting period.\nYou cannot apply for DL yet. Please wait.";
        } else if (daysRemaining > 60) {
            alertLevel   = "GREEN";
            alertMessage = "You are in the SAFE zone. Plenty of time remaining.\nApply for DL at your convenience.";
        } else if (daysRemaining > 10 && daysRemaining <= 60) {
            alertLevel   = "YELLOW";
            alertMessage = "WARNING! Less than 60 days remaining.\nPlease apply for DL soon. Do not delay.";
        } else if (daysRemaining > 0 && daysRemaining <= 10) {
            alertLevel   = "RED";
            alertMessage = "CRITICAL! Less than 10 days remaining!\nApply for DL test IMMEDIATELY or LL will expire!";
        }
    }

    // Display alert
    void displayAlert() {
        cout << "\n===== ALERT STATUS =====\n";
        cout << "Alert Level : " << alertLevel << "\n";
        cout << "Message     : " << alertMessage << "\n";
    }

    // Getters
    string getAlertLevel()   { return alertLevel; }
    string getAlertMessage() { return alertMessage; }
};