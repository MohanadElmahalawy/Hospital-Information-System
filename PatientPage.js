const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sample in-memory storage (replace with database logic)
const patients = [];

// API Route to handle patient form submission
app.post('/api/patients', (req, res) => {
    const { name, email, phone, address } = req.body;
    
    if (!name || !email || !phone || !address) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newPatient = { id: patients.length + 1, name, email, phone, address };
    patients.push(newPatient);

    res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Frontend script to handle patient form submission
document.getElementById('patient-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form from submitting

    // Get values from form inputs
    const name = document.getElementById('patient-name').value;
    const email = document.getElementById('patient-email').value;
    const phone = document.getElementById('patient-phone').value;
    const address = document.getElementById('patient-address').value;

    // Create patient data object
    const patientData = { name, email, phone, address };

    try {
        // Send a POST request to the backend API
        const response = await fetch('http://localhost:5000/api/patients', { // Updated to local backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        if (response.ok) {
            const result = await response.json();
            alert(`Patient Info Updated Successfully!`);
        } else {
            throw new Error('Failed to update patient info');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating patient info');
    }
});
