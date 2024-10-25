// submit_booking.js
document.getElementById('booking-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Gather the input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const destination = document.getElementById('destination').value;
    const date = document.getElementById('date').value;
    const duration = document.getElementById('duration').value;
    const numPeople = document.getElementById('num-people').value;
    const otherInfo = document.getElementById('other-info').value;

    console.log('Submitting booking data:', { name, email, destination, date, duration, numPeople, otherInfo }); // Debug log

    // Send the booking data to the server
    const response = await fetch('/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            name, 
            email, 
            destination, 
            date, 
            duration: parseInt(duration), // Convert duration to a number
            num_people: parseInt(numPeople), // Convert num_people to a number
            other_info: otherInfo 
        }),
    });

    const result = await response.json(); // Parse the JSON response

    // Alert the user with the result message
    alert(result.message); 

    // Check if the booking was successful
    if (response.ok) {
        // Redirect to booking confirmed page after successful booking
        window.location.href = '/booking-confirmed.html';
    } else {
        // Log the error for debugging
        console.error('Error during booking:', result);
    }
});
