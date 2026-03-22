#include <iostream>
#include <string>
#include <vector>
using namespace std;

class DocumentChecklist {
private:
    string vehicleType;
    vector<string> checklist;

public:
    // Constructor
    DocumentChecklist() {
        vehicleType = "";
    }

    // Generate checklist based on vehicle type
    void generateChecklist(string vType) {
        vehicleType = vType;
        checklist.clear();

        // Common documents for all types
        checklist.push_back("Original Learner License (LL)");
        checklist.push_back("Photocopy of Learner License");
        checklist.push_back("Age Proof (Aadhar Card / Birth Certificate)");
        checklist.push_back("Address Proof (Aadhar Card / Electricity Bill)");
        checklist.push_back("4 Passport Size Photographs");
        checklist.push_back("Form 9 (Application for Driving License) - filled");

        // Vehicle specific
        if (vType == "4W" || vType == "Both") {
            checklist.push_back("Medical Certificate (Form 1A) if age above 40");
        }
        if (vType == "Commercial") {
            checklist.push_back("Medical Fitness Certificate (mandatory)");
            checklist.push_back("Driving School Certificate");
            checklist.push_back("Form 5 (Application for Commercial License)");
        }

        // Fee info
        if (vType == "2W")
            checklist.push_back("Test Fee: Rs. 300 (approx) for Two Wheeler");
        else if (vType == "4W")
            checklist.push_back("Test Fee: Rs. 500 (approx) for Four Wheeler");
        else if (vType == "Both")
            checklist.push_back("Test Fee: Rs. 700 (approx) for Both 2W and 4W");
        else if (vType == "Commercial")
            checklist.push_back("Test Fee: Rs. 800 (approx) for Commercial Vehicle");
    }

    // Display checklist
    void displayChecklist() {
        cout << "\n===== DOCUMENT CHECKLIST FOR " << vehicleType << " =====\n";
        cout << "Carry ALL these documents to RTO:\n\n";
        for (int i = 0; i < checklist.size(); i++) {
            cout << i + 1 << ". [ ] " << checklist[i] << "\n";
        }
        cout << "\nTIP: Carry originals AND photocopies of everything!\n";
    }

    // Getter
    vector<string> getChecklist() { return checklist; }
};