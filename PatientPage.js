document.getElementById('patient-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting
    
    // Get values from form inputs
    const name = document.getElementById('patient-name').value;
    const email = document.getElementById('patient-email').value;
    const phone = document.getElementById('patient-phone').value;
    const address = document.getElementById('patient-address').value;
  
    // Display a confirmation message or save data logic here (like an API call)
    alert(`Patient Info Updated!\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}`);
  });
  