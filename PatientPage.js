// ✅ Ensure only authenticated users can access the page
document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html"; // Redirect if user is not logged in
        return;
    }

    fetchDoctors(token);  // Load available doctors
    fetchPatientInfo(token); // Load patient profile
});

// ✅ Logout function
function logout() {
    localStorage.removeItem("token"); // Remove authentication token
    sessionStorage.removeItem("token"); 
    window.location.href = "login.html"; // Redirect to login page
}

// ✅ Fetch doctors list for patients
async function fetchDoctors(token) {
    try {
        // 🔧 Fixed incorrect endpoint (Patients should get doctors from `/api/patient/doctors`)
        const response = await fetch("http://localhost:3000/api/patient/doctors", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error("Failed to fetch doctors: " + errorMsg);
        }

        const doctors = await response.json();
        const doctorsTableBody = document.getElementById("doctorsTableBody");
        doctorsTableBody.innerHTML = ""; // Clear previous data

        if (doctors.length === 0) {
            doctorsTableBody.innerHTML = `<tr><td colspan="2" class="text-center">No doctors available</td></tr>`;
            return;
        }

        doctors.forEach((doctor) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${doctor.firstName} ${doctor.lastName}</td><td>${doctor.phoneNumber}</td>`;
            doctorsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        alert("Error fetching doctors: " + error.message);
    }
}

// ✅ Fetch and display patient info
async function fetchPatientInfo(token) {
    try {
        const response = await fetch("http://localhost:3000/api/patient/me", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error("Failed to fetch patient info: " + errorMsg);
        }

        const patient = await response.json();
        document.getElementById("patient-name").value = `${patient.firstName} ${patient.lastName}`;
        document.getElementById("patient-email").value = patient.email;
        document.getElementById("patient-phone").value = patient.phoneNumber;
        document.getElementById("patient-gender").value = patient.gender; // Read-only

        // 🔧 Handle case where `address` is missing
        document.getElementById("patient-address").value = patient.address || "Not Provided";

    } catch (error) {
        console.error("Error fetching patient info:", error);
        alert("Error fetching patient info: " + error.message);
    }
}

// ✅ Update patient info when form is submitted
document.getElementById("patient-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const token = localStorage.getItem("token");

    const fullName = document.getElementById("patient-name").value.trim().split(" ");
    const firstName = fullName[0] || "";
    const lastName = fullName.slice(1).join(" ") || "";

    const updatedPatient = {
        firstName,
        lastName,
        email: document.getElementById("patient-email").value,
        phoneNumber: document.getElementById("patient-phone").value,
        address: document.getElementById("patient-address")?.value || "", // Handle cases where address is missing
    };

    try {
        const response = await fetch("http://localhost:3000/api/patient/edit-profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(updatedPatient),
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error("Failed to update patient info: " + errorMsg);
        }

        alert("Profile updated successfully!");
        fetchPatientInfo(token); // Refresh patient info
    } catch (error) {
        console.error("Error updating patient info:", error);
        alert("Error updating profile: " + error.message);
    }
});
