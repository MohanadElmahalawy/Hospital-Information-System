document.addEventListener("DOMContentLoaded", function() {
    loadPatients();
});


function loadPatients() {
    const patientTable = document.getElementById("patientTable");
    patientTable.innerHTML = `
        <tr>
            <td>Jane Smith</td>
            <td>jane@example.com</td>
            <td>+0987654321</td>
          
        </tr>
    `;
}