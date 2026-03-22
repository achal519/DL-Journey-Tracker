#include <iostream>
#include <ctime>
using namespace std;

class DeadlineCalculator {
private:
    int daysPassed;
    int daysRemaining;
    int waitRemaining;

public:
    // Constructor
    DeadlineCalculator() {
        daysPassed = 0;
        daysRemaining = 0;
        waitRemaining = 0;
    }

    // Main calculation — takes LL issue day, month, year
    void calculate(int day, int month, int year) {
        // Get today's date using system time
        time_t t = time(0);
        tm* today = localtime(&t);

        int todayDay   = today->tm_mday;
        int todayMonth = today->tm_mon + 1;
        int todayYear  = today->tm_year + 1900;

        // Convert both dates to total days for easy subtraction
        long issueTotalDays = year * 365 + month * 30 + day;
        long todayTotalDays = todayYear * 365 + todayMonth * 30 + todayDay;

        daysPassed    = todayTotalDays - issueTotalDays;
        daysRemaining = 180 - daysPassed;
        waitRemaining = 30 - daysPassed;

        if (waitRemaining < 0) waitRemaining = 0;
        if (daysRemaining < 0) daysRemaining = 0;
    }

    // Check current status
    bool isInWaitPeriod() { return daysPassed < 30; }
    bool canApply()       { return daysPassed >= 30 && daysPassed <= 179; }
    bool isExpired()      { return daysPassed >= 180; }

    // Getters
    int getDaysPassed()    { return daysPassed; }
    int getDaysRemaining() { return daysRemaining; }
    int getWaitRemaining() { return waitRemaining; }

    // Display status
    void displayStatus() {
        cout << "\n===== DEADLINE STATUS =====\n";
        cout << "Days Passed         : " << daysPassed << " days\n";
        if (isInWaitPeriod()) {
            cout << "Status              : Waiting Period\n";
            cout << "Days left to wait   : " << waitRemaining << " days\n";
        } else if (canApply()) {
            cout << "Status              : You CAN apply for DL now!\n";
            cout << "Days left in window : " << daysRemaining << " days\n";
        } else {
            cout << "Status              : LL EXPIRED!\n";
            cout << "You must reapply for LL from scratch.\n";
        }
    }
};