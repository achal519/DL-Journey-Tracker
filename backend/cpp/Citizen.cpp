#include <iostream>
#include <string>
using namespace std;

class Citizen {
private:
    string name;
    int age;
    string city;
    string vehicleType;

public:
    // Constructor
    Citizen() {
        name = "";
        age = 0;
        city = "";
        vehicleType = "";
    }

    // Take input from user
    void setDetails() {
        cout << "\n===== CITIZEN REGISTRATION =====\n";
        cout << "Enter Full Name: ";
        cin.ignore();
        getline(cin, name);
        cout << "Enter Age: ";
        cin >> age;
        cout << "Enter City/District: ";
        cin.ignore();
        getline(cin, city);
        cout << "\nSelect Vehicle Type:\n";
        cout << "1. Two Wheeler\n";
        cout << "2. Four Wheeler\n";
        cout << "3. Both\n";
        cout << "4. Commercial\n";
        cout << "Enter choice (1-4): ";
        int choice;
        cin >> choice;
        if (choice == 1) vehicleType = "2W";
        else if (choice == 2) vehicleType = "4W";
        else if (choice == 3) vehicleType = "Both";
        else vehicleType = "Commercial";
    }

    // Display profile
    void displayProfile() {
        cout << "\n===== YOUR PROFILE =====\n";
        cout << "Name        : " << name << endl;
        cout << "Age         : " << age << endl;
        cout << "City        : " << city << endl;
        cout << "Vehicle Type: " << vehicleType << endl;
    }

    // Getters
    string getName()        { return name; }
    int getAge()            { return age; }
    string getCity()        { return city; }
    string getVehicleType() { return vehicleType; }
};