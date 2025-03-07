const API_BASE_URL = "http://localhost:3000/api"; // Ensure this matches your backend URL

// Ensure only authenticated doctors can access the page
document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html"; // Redirect if user is not logged in
        return;
    }

    await fetchDoctorInfo(token);  // Load doctor profile
    await fetchPatients(token); // Load patient list
});

// Logout function
function logout() {
    localStorage.removeItem("token"); // Remove authentication token
    sessionStorage.removeItem("token");
    window.location.href = "login.html"; // Redirect to login page
}

// Function to calculate age from birthDate
function calculateAge(birthDate) {
    if (!birthDate) return "N/A"; // Return N/A if birthDate is missing

    const birth = new Date(birthDate); // Convert string to Date object
    if (isNaN(birth.getTime())) return "N/A"; // Handle invalid date formats

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // If birth month and day haven't occurred yet this year, subtract one year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}

// Fetch and display doctor profile info
async function fetchDoctorInfo(token) {
    try {
        console.log("Fetching doctor profile...");
        const response = await fetch(`${API_BASE_URL}/doctor/me`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error("Failed to fetch doctor info: " + errorMsg);
        }

        const doctor = await response.json();
        console.log("Doctor profile:", doctor);

        // Fix date format for input field
        if (doctor.birthDate) {
            const formattedDate = doctor.birthDate.split("T")[0]; // Extract YYYY-MM-DD
            document.getElementById("birthdate").value = formattedDate;
        } else {
            document.getElementById("birthdate").value = "";
        }

        document.getElementById("email").value = doctor.email || "";
        document.getElementById("phone").value = doctor.phoneNumber || "";

    } catch (error) {
        console.error("Error fetching doctor info:", error);
        alert("Error fetching doctor info: " + error.message);
    }
}

// Fetch and display list of patients
async function fetchPatients(token) {
    try {
        console.log("Fetching patients list...");
        const response = await fetch(`${API_BASE_URL}/doctor/patients`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error("Failed to fetch patients: " + errorMsg);
        }

        const patients = await response.json();
        console.log("Patients list:", patients);

        const patientsTableBody = document.getElementById("patientTable");
        patientsTableBody.innerHTML = ""; // Clear previous data

        if (patients.length === 0) {
            patientsTableBody.innerHTML = `<tr><td colspan="3" class="text-center">No patients available</td></tr>`;
            return;
        }

        patients.forEach((patient) => {
            const birthDate = patient.birthDate ? patient.birthDate.split("T")[0] : null; // Extract YYYY-MM-DD format
            const age = calculateAge(birthDate); // Calculate age properly

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${patient.firstName} ${patient.lastName}</td>
                <td>${age}</td>
                <td>${patient.phoneNumber}</td>
            `;
            patientsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching patients:", error);
        alert("Error fetching patients: " + error.message);
    }
}

// Update doctor profile when clicking the Save button
document.getElementById("submit").addEventListener("click", async function () {
    const token = localStorage.getItem("token");

    const updatedDoctor = {
        email: document.getElementById("email").value,
        phoneNumber: document.getElementById("phone").value,
        birthDate: document.getElementById("birthdate").value,
    };

    try {
        console.log("Updating doctor profile...");
        const response = await fetch(`${API_BASE_URL}/doctor/edit-profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(updatedDoctor),
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error("Failed to update doctor info: " + errorMsg);
        }

        alert("Profile updated successfully!");
        await fetchDoctorInfo(token); // Refresh doctor info
    } catch (error) {
        console.error("Error updating doctor info:", error);
        alert("Error updating profile: " + error.message);
    }
});
