document.getElementById('patient-form').addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevent the form from submitting

  // Get values from form inputs
  const name = document.getElementById('patient-name').value;
  const email = document.getElementById('patient-email').value;
  const phone = document.getElementById('patient-phone').value;
  const address = document.getElementById('patient-address').value;

  // Create patient data object
  const patientData = { name, email, phone, address };

  try {
      // Send a POST request to the backend API
      const response = await fetch('https://your-backend-url/api/patients', {
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
