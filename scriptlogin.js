// login.js

// API base URL
const API_BASE_URL = "http://localhost:3000/api";

// Function to handle login
async function login(event) {
    event.preventDefault();  // Prevent default form submission

    // Get form data
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const loginData = {
        email: email,
        password: password
    };

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);  // Save JWT token

            // Check user role and redirect accordingly
            if (data.role === "Doctor") {
                window.location.href = "indexdr.html";  // Redirect to doctor page
            } else if (data.role === "Admin") {
                window.location.href = "admin.html";  // Redirect to admin page
            } else if (data.role === "Patient") {
                window.location.href = "PatientPage.html";  // Redirect to Patient page
            } else {
                alert("Unknown user role!");
            }
        } else if (response.status === 401) {
            alert("Invalid email or password.");
        } else if (data.token) {
            localStorage.setItem("token", data.token);
        } else {
            alert("Login successful, but no token received.");
            return;
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
    }
}

// Event listener for login form submission
document.getElementById("loginForm").addEventListener("submit", login);
