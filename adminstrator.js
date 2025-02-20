document.addEventListener("DOMContentLoaded", function() {
    loadDoctors();
    loadPatients();
});

function loadDoctors() {
    const doctorTable = document.getElementById("doctorTable");
    doctorTable.innerHTML = `
        <tr>
            <td>Dr. John Doe</td>
            <td>john@example.com</td>
            <td>+1234567890</td>
            <td>
                <button class="btn btn-danger" onclick="removeDoctor(this)">Retire</button>
            </td>
        </tr>
    `;
}


function loadPatients() {
    const patientTable = document.getElementById("patientTable");
    patientTable.innerHTML = `
        <tr>
            <td>Jane Smith</td>
            <td>jane@example.com</td>
            <td>+0987654321</td>
            <td>
                <button class="btn btn-danger" onclick="removePatient(this)">Remove</button>
            </td>
        </tr>
    `;
}

function addDoctor() {
    const doctorTable = document.getElementById("doctorTable");
    const newRow = doctorTable.insertRow();
    newRow.innerHTML = `
        <td>Dr. New Dentist</td>
        <td>newdoc@example.com</td>
        <td>+1122334455</td>
        <td>
            <button class="btn btn-danger" onclick="removeDoctor(this)">Retire</button>
        </td>
    `;
}

function removeDoctor(button) {
    button.parentElement.parentElement.remove();
}

function removePatient(button) {
    button.parentElement.parentElement.remove();
}
