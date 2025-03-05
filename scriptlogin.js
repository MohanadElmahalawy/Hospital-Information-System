const API_BASE_URL = "http://localhost:3000/api"; // Must match backend URL

async function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            // console.log("Login Response:", data);
            localStorage.setItem("token", data.token); // Save JWT token

            // Redirect user based on role
            switch (data.user.role) {
                case "Doctor":
                    window.location.href = "indexdr.html";
                    break;
                case "Admin":
                    window.location.href = "admin.html";
                    break;
                case "Patient":
                    window.location.href = "PatientPage.html";
                    break;
                default:
                    alert("Unknown user role!");
            }
        } else {
            alert("Invalid email or password.");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("An error occurred. Please try again.");
    }
}

document.getElementById("loginForm").addEventListener("submit", login);
