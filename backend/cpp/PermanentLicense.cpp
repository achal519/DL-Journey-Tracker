#include <iostream>
#include <string>
#include "License.cpp"
using namespace std;

// CHILD CLASS — Inherits from License
class PermanentLicense : public License {
private:
    string expiryDate;
    int validityYears;
    bool isRenewed;

public:
    // Constructor
    PermanentLicense() {
        expiryDate    = "";
        validityYears = 20;
        isRenewed     = false;
    }

    // Set DL details after user receives DL
    void setDLDetails() {
        cout << "\n===== PERMANENT DL DETAILS =====\n";
        cout << "Enter DL Number: ";
        cin >> licenseNumber;
        cout << "Enter Holder Name: ";
        cin.ignore();
        getline(cin, holderName);
        cout << "Enter DL Issue Date (DD MM YYYY): ";
        int day, month, year;
        cin >> day >> month >> year;
        issueDate  = to_string(day) + "/" + to_string(month) + "/" + to_string(year);
        expiryDate = to_string(day) + "/" + to_string(month) + "/" + to_string(year + 20);
        cout << "Enter Vehicle Type (2W/4W/Both/Commercial): ";
        cin >> vehicleType;
    }

    // Override parent displayDetails
    void displayDetails() override {
        cout << "\n===== PERMANENT DL DETAILS =====\n";
        displayBasicDetails();
        cout << "Expiry Date   : " << expiryDate << "\n";
        cout << "Valid For     : " << validityYears << " years\n";
        cout << "Renewed       : " << (isRenewed ? "Yes" : "No") << "\n";
    }

    // Renewal
    void renewLicense() {
        isRenewed = true;
        cout << "\nDL Renewed successfully!\n";
        cout << "New Expiry Date will be updated at RTO.\n";
    }

    // Getters
    string getExpiryDate()  { return expiryDate; }
    bool getIsRenewed()     { return isRenewed; }
    int getValidityYears()  { return validityYears; }
};