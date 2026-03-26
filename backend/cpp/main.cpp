#include <iostream>
#include <string>
using namespace std;

int main(int argc, char* argv[]) {

    // ✅ HANDLE NODE REQUEST
    if (argc > 1) {
        string command = argv[1];

        if (command == "--stage") {
            int daysPassed = stoi(argv[2]);
            bool dlReceived = stoi(argv[3]);

            string stage;
            if (dlReceived)
                stage = "DL Received";
            else if (daysPassed < 30)
                stage = "Waiting Period";
            else
                stage = "Ready for DL Test";

            cout << "{";
            cout << "\"stage\":\"" << stage << "\",";
            cout << "\"days_passed\":" << daysPassed;
            cout << "}";

            return 0;
        }

        if (command == "--alert") {
            cout << "{\"message\":\"Alert working\"}";
            return 0;
        }

        if (command == "--checklist") {
            cout << "{\"documents\":[\"Aadhar\",\"PAN\",\"Photo\"]}";
            return 0;
        }

        if (command == "--deadline") {
            cout << "{\"days_remaining\":10}";
            return 0;
        }
    }

    // ✅ YOUR OLD MENU CODE STARTS HERE

    int choice;
    cout << "Menu running...\n";

    // (keep your existing menu logic here safely)

    return 0;
}