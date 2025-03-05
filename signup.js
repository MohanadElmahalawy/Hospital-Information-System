const API_BASE_URL = "http://localhost:3000/api/auth"; 

document.getElementById("signupForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const birthDate = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        document.getElementById("passwordError").classList.remove("d-none");
        return;
    } else {
        document.getElementById("passwordError").classList.add("d-none");
    }

    const patientData = {
        firstName,
        lastName,
        birthDate,
        gender,
        email,
        phoneNumber,
        password,
        role: "Patient"
    };

    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patientData),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Signup successful! Redirecting to login...");
            window.location.href = "login.html"; 
        } else {
            alert(`Signup failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Error signing up:", error);
        alert("Error connecting to the server.");
    }
});
