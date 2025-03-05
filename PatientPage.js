// ✅ Fetch and Display Doctors List
async function loadDoctors() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Unauthorized! Please log in.");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(`${API_BASE_URL}/patients/doctors`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` },
        });

        const doctors = await response.json();
        
        if (response.ok) {
            const tableBody = document.getElementById("doctorsTableBody");
            tableBody.innerHTML = ""; // Clear previous data

            if (doctors.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="2" class="text-center">No doctors available</td></tr>`;
                return;
            }

            doctors.forEach((doctor) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${doctor.firstName} ${doctor.lastName}</td>
                    <td>${doctor.phoneNumber}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            alert(`Error: ${doctors.msg}`);
        }
    } catch (error) {
        console.error("Error loading doctors:", error);
    }
}

// ✅ Ensure it runs when page loads
document.addEventListener("DOMContentLoaded", loadDoctors);
