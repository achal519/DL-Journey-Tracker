#ifndef LICENSE_CPP
#define LICENSE_CPP

#include <iostream>
#include <string>
using namespace std;

// BASE CLASS — Parent of LearnerLicense and PermanentLicense
class License {
protected:
    string licenseNumber;
    string issueDate;
    string vehicleType;
    string holderName;

public:
    // Constructor
    License() {
        licenseNumber = "";
        issueDate     = "";
        vehicleType   = "";
        holderName    = "";
    }

    // Common method for all licenses
    void setBasicDetails(string lNum, string iDate, string vType, string hName) {
        licenseNumber = lNum;
        issueDate     = iDate;
        vehicleType   = vType;
        holderName    = hName;
    }

    // Display basic details
    void displayBasicDetails() {
        cout << "License Number: " << licenseNumber << endl;
        cout << "Issue Date    : " << issueDate << endl;
        cout << "Vehicle Type  : " << vehicleType << endl;
        cout << "Holder Name   : " << holderName << endl;
    }

    // Getters
    string getLicenseNumber() { return licenseNumber; }
    string getIssueDate()     { return issueDate; }
    string getVehicleType()   { return vehicleType; }
    string getHolderName()    { return holderName; }

    // Virtual function
    virtual void displayDetails() {
        cout << "\n===== LICENSE DETAILS =====\n";
        displayBasicDetails();
    }
};

#endif