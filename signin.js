document.getElementById('signin-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Get values from the form fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Send a POST request to the server's signin endpoint
        const response = await fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set content type to JSON
            },
            body: JSON.stringify({ email, password }), // Send the email and password in the request body
        });

        // Parse the JSON response from the server
        const result = await response.json();

        // Display the message from the server (success or error)
        alert(result.message);

        // If the sign-in is successful (response.ok means status 200-299), redirect to book.html
        if (response.ok) {
            window.location.href = '/book.html'; // Redirect to the booking page
        }
    } catch (error) {
        // Handle any errors that occurred during the fetch request
        console.error('Error during sign-in:', error);
        alert('An error occurred during sign-in. Please try again later.');
    }
});
