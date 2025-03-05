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
            if (data.role === "doctor") {
                window.location.href = "indexdr.html";  // Redirect to doctor page
            } else if (data.role === "admin") {
                window.location.href = "indexadmin.html";  // Redirect to admin page
            } else if (data.role === "receptionist") {
                window.location.href = "indexreceptionist.html";  // Redirect to receptionist page
            } else {
                alert("Unknown user role!");
            }
        } else if (response.status === 401) {
            alert("Invalid email or password.");
        } else {
            console.log("Login failed:", response.status);
            alert("Login failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
    }
}

// Event listener for login form submission
document.getElementById("loginForm").addEventListener("submit", login);
