#include <iostream>
#include <string>
using namespace std;

class LearnerLicense {
private:
    string llNumber;
    string issueDate;
    string vehicleType;

public:
    // Constructor
    LearnerLicense() {
        llNumber = "";
        issueDate = "";
        vehicleType = "";
    }

    // Take LL input from user
    void setLLDetails() {
        cout << "\n===== LEARNER LICENSE DETAILS =====\n";
        cout << "Enter LL Number: ";
        cin >> llNumber;
        cout << "Enter LL Issue Date (DD MM YYYY): ";
        int day, month, year;
        cin >> day >> month >> year;
        issueDate = to_string(day) + "/" + to_string(month) + "/" + to_string(year);
        cout << "Enter Vehicle Type (2W/4W/Both/Commercial): ";
        cin >> vehicleType;
    }

    // Display LL details
    void displayLLDetails() {
        cout << "\n===== YOUR LL DETAILS =====\n";
        cout << "LL Number   : " << llNumber << endl;
        cout << "Issue Date  : " << issueDate << endl;
        cout << "Vehicle Type: " << vehicleType << endl;
    }

    // Getters
    string getLLNumber()    { return llNumber; }
    string getIssueDate()   { return issueDate; }
    string getVehicleType() { return vehicleType; }

    // Get day, month, year separately
    int getDay() {
        return stoi(issueDate.substr(0, issueDate.find("/")));
    }
    int getMonth() {
        int first = issueDate.find("/");
        int second = issueDate.find("/", first + 1);
        return stoi(issueDate.substr(first + 1, second - first - 1));
    }
    int getYear() {
        int second = issueDate.find("/", issueDate.find("/") + 1);
        return stoi(issueDate.substr(second + 1));
    }
};