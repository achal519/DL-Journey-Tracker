#include <iostream>
#include <string>
#include "License.cpp"
using namespace std;

// CHILD CLASS — Inherits from License
class LearnerLicense : public License {
private:
    int validityDays;
    bool isActive;

public:
    // Constructor
    LearnerLicense() {
        validityDays = 180;
        isActive     = true;
    }

    // Take LL input from user
    void setLLDetails() {
        cout << "\n===== LEARNER LICENSE DETAILS =====\n";
        cout << "Enter LL Number: ";
        cin >> licenseNumber;
        cout << "Enter Holder Name: ";
        cin.ignore();
        getline(cin, holderName);
        cout << "Enter LL Issue Date (DD MM YYYY): ";
        int day, month, year;
        cin >> day >> month >> year;
        issueDate = to_string(day) + "/" + to_string(month) + "/" + to_string(year);
        cout << "Enter Vehicle Type (2W/4W/Both/Commercial): ";
        cin >> vehicleType;
    }

    // Override parent displayDetails
    void displayDetails() override {
        cout << "\n===== LEARNER LICENSE DETAILS =====\n";
        displayBasicDetails();
        cout << "Validity      : " << validityDays << " days\n";
        cout << "Status        : " << (isActive ? "ACTIVE" : "EXPIRED") << "\n";
    }

    // Set active status
    void setActive(bool status) { isActive = status; }

    // Get day month year separately for DeadlineCalculator
    int getDay() {
        return stoi(issueDate.substr(0, issueDate.find("/")));
    }
    int getMonth() {
        int first  = issueDate.find("/");
        int second = issueDate.find("/", first + 1);
        return stoi(issueDate.substr(first + 1, second - first - 1));
    }
    int getYear() {
        int second = issueDate.find("/", issueDate.find("/") + 1);
        return stoi(issueDate.substr(second + 1));
    }

    // Getters
    bool getIsActive()    { return isActive; }
    int getValidityDays() { return validityDays; }
};