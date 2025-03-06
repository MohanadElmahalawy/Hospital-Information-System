// scriptdr.js

// API base URL
const API_BASE_URL = "http://localhost:3000/api";

// Function to get token from local storage
function getToken() {
    return localStorage.getItem("token");
}

// Function to get doctor profile
async function getDoctorProfile() {
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/doctor/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const doctor = await response.json();
            document.getElementById("email").value = doctor.email;
            document.getElementById("phone").value = doctor.phone;
            document.getElementById("birthdate").value = doctor.birthDate;
        } else {
            console.log("Failed to fetch doctor profile:", response.status);
        }
    } catch (error) {
        console.error("Error fetching doctor profile:", error);
    }
}

// Function to update doctor profile
async function updateDoctorProfile(event) {
    event.preventDefault();

    const token = getToken();
    const updatedProfile = {
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        birthDate: document.getElementById("birthdate").value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/doctor/profile`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedProfile)
        });

        if (response.ok) {
            alert("Profile updated successfully!");
        } else {
            console.log("Failed to update profile:", response.status);
        }
    } catch (error) {
        console.error("Error updating profile:", error);
    }
}

// Function to get patient list
async function getPatientList() {
    const token = getToken();
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/doctor/patients`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include token
            }
        });

        const users = await response.json();
        if (!response.ok) throw new Error(users.msg || "Failed to fetch patients");
        const patientTable = document.getElementById("patientTable");

        patientTable.innerHTML = patients.map(patient => `
            <tr>
                <td>${patient.firstName} ${patient.lastName}</td>
                <td>${patient.email}</td>
                <td>${patient.phoneNumber}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removePatient('${patient._id}')">
                        Remove
                    </button>
                </td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Error fetching patients:", error);
        alert("Error fetching patients: " + error.message);
    }
}

// Event listeners
document.getElementById("updateProfileForm").addEventListener("submit", updateDoctorProfile);
document.addEventListener("DOMContentLoaded", () => {
    getDoctorProfile();
    getPatientList();
});
