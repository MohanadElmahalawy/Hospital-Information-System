document.addEventListener("DOMContentLoaded", () => {
    fetchDoctors();
    fetchPatients();
});

// Fetch and display doctors
async function fetchDoctors() {
    try {
        const response = await fetch('/api/admin/users');
        const users = await response.json();
        
        if (!response.ok) throw new Error(users.message || "Failed to fetch doctors");

        const doctors = users.filter(user => user.role === "doctor");
        const doctorTable = document.getElementById("doctorTable");

        doctorTable.innerHTML = doctors.map(doctor => `
            <tr>
                <td>${doctor.firstName} ${doctor.lastName}</td>
                <td>${doctor.email}</td>
                <td>${doctor.phoneNumber}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="retireDoctor('${doctor._id}')">
                        Retire
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
    try {
        const response = await fetch('/api/admin/users');
        const users = await response.json();
        
        if (!response.ok) throw new Error(users.message || "Failed to fetch patients");

        const patients = users.filter(user => user.role === "patient");
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
    const expertise = prompt("Enter doctor's expertise:");
    const password = prompt("Enter a password for the doctor:");

    if (!firstName || !lastName || !email || !phoneNumber || !birthDate || !gender || !expertise || !password) {
        alert("All fields are required!");
        return;
    }

    try {
        const response = await fetch('/api/admin/add-doctor', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, email, phoneNumber, birthDate, gender, expertise, password })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to add doctor");

        alert(data.message);
        fetchDoctors();
    } catch (error) {
        console.error("Error adding doctor:", error);
        alert("Error adding doctor: " + error.message);
    }
}

// Retire a doctor
async function retireDoctor(id) {
    if (!confirm("Are you sure you want to retire this doctor?")) return;

    try {
        const response = await fetch(`/api/admin/retire-doctor/${id}`, { method: "DELETE" });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to retire doctor");

        alert(data.message);
        fetchDoctors();
    } catch (error) {
        console.error("Error retiring doctor:", error);
        alert("Error retiring doctor: " + error.message);
    }
}

// Remove a patient
async function removePatient(id) {
    if (!confirm("Are you sure you want to remove this patient?")) return;

    try {
        const response = await fetch(`/api/admin/remove-patient/${id}`, { method: "DELETE" });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to remove patient");

        alert(data.message);
        fetchPatients();
    } catch (error) {
        console.error("Error removing patient:", error);
        alert("Error removing patient: " + error.message);
    }
}
