const BASE_URL = "http://localhost:3000"; // Match your backend port

document.addEventListener("DOMContentLoaded", () => {
    fetchDoctors();
    fetchPatients();
});

// Function to get token from localStorage
function getToken() {
    return localStorage.getItem("token");
}

// Fetch and display doctors
async function fetchDoctors() {
    const token = getToken();
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/admin/all-users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include token
            }
        });

        const users = await response.json();
        if (!response.ok) throw new Error(users.msg || "Failed to fetch doctors");

        const doctors = users.filter(user => user.role === "Doctor");
        const doctorTable = document.getElementById("doctorTable");

        doctorTable.innerHTML = doctors.map(doctor => `
            <tr>
                <td>${doctor.firstName} ${doctor.lastName}</td>
                <td>${doctor.email}</td>
                <td>${doctor.phoneNumber}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeDoctor('${doctor._id}')">
                        Remove
                    </button>
                </td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Error fetching doctors:", error);
        alert("Error fetching doctors: " + error.message);
    }
}

// Fetch and display patients
async function fetchPatients() {
    const token = getToken();
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/admin/all-users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include token
            }
        });

        const users = await response.json();
        if (!response.ok) throw new Error(users.msg || "Failed to fetch patients");

        const patients = users.filter(user => user.role === "Patient");
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

// Add a new doctor
async function addDoctor() {
    const firstName = prompt("Enter doctor's first name:");
    const lastName = prompt("Enter doctor's last name:");
    const email = prompt("Enter doctor's email:");
    const phoneNumber = prompt("Enter doctor's phone number:");
    const birthDate = prompt("Enter doctor's birth date (YYYY-MM-DD):");
    const gender = prompt("Enter doctor's gender:");
    const expertiseLevel = prompt("Enter doctor's expertise level:");
    const password = prompt("Enter a password for the doctor:");

    if (!firstName || !lastName || !email || !phoneNumber || !birthDate || !gender || !expertiseLevel || !password) {
        alert("All fields are required!");
        return;
    }

    const token = getToken();
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/admin/add-doctor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include token
            },
            body: JSON.stringify({ firstName, lastName, email, phoneNumber, birthDate, gender, expertiseLevel, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || "Failed to add doctor");

        alert(data.msg);
        fetchDoctors();
    } catch (error) {
        console.error("Error adding doctor:", error);
        alert("Error adding doctor: " + error.message);
    }
}

// Remove a doctor
async function removeDoctor(id) {
    if (!confirm("Are you sure you want to remove this doctor?")) return;

    const token = getToken();
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/admin/remove-doctor/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include token
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || "Failed to remove doctor");

        alert(data.msg);
        fetchDoctors();
    } catch (error) {
        console.error("Error removing doctor:", error);
        alert("Error removing doctor: " + error.message);
    }
}

// Remove a patient
async function removePatient(id) {
    if (!confirm("Are you sure you want to remove this patient?")) return;

    const token = getToken();
    if (!token) {
        alert("No token found. Please log in.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/admin/remove-patient/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include token
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || "Failed to remove patient");

        alert(data.msg);
        fetchPatients();
    } catch (error) {
        console.error("Error removing patient:", error);
        alert("Error removing patient: " + error.message);
    }
}
