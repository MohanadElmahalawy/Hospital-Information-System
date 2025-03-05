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
            document.getElementById("birthDate").value = doctor.birthDate;
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
        birthDate: document.getElementById("birthDate").value
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
    try {
        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/doctor/patients`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const patients = await response.json();
            const patientTable = document.getElementById("patientTableBody");
            patientTable.innerHTML = ""; // Clear existing data

            patients.forEach((patient) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${patient.name}</td>
                    <td>${patient.age}</td>
                    <td>${patient.phone}</td>
                `;
                patientTable.appendChild(row);
            });
        } else {
            console.log("Failed to fetch patients:", response.status);
        }
    } catch (error) {
        console.error("Error fetching patients:", error);
    }
}

// Event listeners
document.getElementById("updateProfileForm").addEventListener("submit", updateDoctorProfile);
document.addEventListener("DOMContentLoaded", () => {
    getDoctorProfile();
    getPatientList();
});
