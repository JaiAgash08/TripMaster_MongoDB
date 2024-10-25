// signup.js

// Event listener for form submission
document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent default form submission behavior

    // Retrieve form values
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Make a POST request to the '/signup' endpoint with form data
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // Inform server about JSON data
            },
            body: JSON.stringify({ username, email, password }),  // Send data as JSON
        });

        // Parse JSON response from the server
        const result = await response.json();

        if (response.status === 201) {
            // Show success message and redirect to the signin page
            alert(result.message);
            window.location.href = '/signin.html';  // Redirect to signin page
        } else {
            // Show error message if registration fails
            alert(result.message);
        }
    } catch (error) {
        // Handle any errors that occur during the fetch operation
        console.error('Error during signup:', error);
        alert('An error occurred. Please try again later.');
    }
});
