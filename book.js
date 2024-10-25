// book.js
document.getElementById('booking-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const tripName = document.getElementById('tripName').value;
    const userId = document.getElementById('userId').value;
    const date = document.getElementById('date').value;

    console.log('Submitting booking data:', { tripName, userId, date }); // Debug log

    const response = await fetch('/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tripName, userId, date }),
    });

    const result = await response.json();
    alert(result.message); // Show success or error message

    if (response.ok) {
        // Redirect to booking confirmed page after successful booking
        window.location.href = '/booking-confirmed.html';
    }
});
