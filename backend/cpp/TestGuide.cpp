#include <iostream>
#include <string>
#include <vector>
using namespace std;

class TestGuide {
private:
    string vehicleType;
    vector<string> tips;
    vector<string> commonFailReasons;
    vector<string> trafficSigns;

public:
    // Constructor
    TestGuide() {
        vehicleType = "";
    }

    // Load tips based on vehicle type
    void loadTips(string vType) {
        vehicleType = vType;
        tips.clear();
        commonFailReasons.clear();
        trafficSigns.clear();

        // Common tips for all
        tips.push_back("Carry all required documents in a folder");
        tips.push_back("Reach RTO at least 30 minutes before your slot");
        tips.push_back("Wear helmet if coming on two wheeler");
        tips.push_back("Stay calm during the test — examiner is watching");
        tips.push_back("Follow all traffic signals during the test route");

        // Vehicle specific tips
        if (vType == "2W" || vType == "Both") {
            tips.push_back("Practice figure-8 and straight line balance before test");
            tips.push_back("Know how to do smooth braking without skidding");
            tips.push_back("Keep both hands on handlebar during test");
        }
        if (vType == "4W" || vType == "Both") {
            tips.push_back("Practice parallel parking before going to RTO");
            tips.push_back("Know how to do hill start if your RTO has a ramp");
            tips.push_back("Check mirrors every time before turning");
            tips.push_back("Use indicators before every turn — examiner checks this");
        }
        if (vType == "Commercial") {
            tips.push_back("Know your vehicle dimensions — turning radius matters");
            tips.push_back("Practice reversing in straight line");
            tips.push_back("Know weight limits and loading rules");
        }

        // Common fail reasons
        commonFailReasons.push_back("Not using indicators before turning");
        commonFailReasons.push_back("Crossing stop line at signals");
        commonFailReasons.push_back("Not checking mirrors before reversing");
        commonFailReasons.push_back("Improper lane driving");
        commonFailReasons.push_back("Stalling the vehicle (for 4W manual)");
        commonFailReasons.push_back("Missing documents at the time of test");

        // Traffic signs questions
        trafficSigns.push_back("Q1. Red circle with number 40 means? → Speed limit 40 kmph");
        trafficSigns.push_back("Q2. Red octagon sign means? → STOP completely");
        trafficSigns.push_back("Q3. Yellow triangle with exclamation means? → Caution ahead");
        trafficSigns.push_back("Q4. Blue circle with white arrow means? → Mandatory direction");
        trafficSigns.push_back("Q5. White horizontal lines on road means? → Zebra crossing");
    }

    // Display all tips
    void displayTips() {
        cout << "\n===== RTO TEST PREPARATION GUIDE =====\n";
        cout << "Vehicle Type: " << vehicleType << "\n\n";
        cout << "--- PREPARATION TIPS ---\n";
        for (int i = 0; i < tips.size(); i++) {
            cout << i + 1 << ". " << tips[i] << "\n";
        }
        cout << "\n--- COMMON REASONS PEOPLE FAIL ---\n";
        for (int i = 0; i < commonFailReasons.size(); i++) {
            cout << i + 1 << ". " << commonFailReasons[i] << "\n";
        }
    }

    // Display traffic signs
    void displaySigns() {
        cout << "\n--- TRAFFIC SIGN QUESTIONS (asked at RTO) ---\n";
        for (int i = 0; i < trafficSigns.size(); i++) {
            cout << trafficSigns[i] << "\n";
        }
    }
};