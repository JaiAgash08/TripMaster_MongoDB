// assets/js/app.js
document.addEventListener('DOMContentLoaded', function () {
    // Your client-side code goes here

    const reserveButton = document.getElementById('reserve-button');
    if (reserveButton) {
        reserveButton.addEventListener('click', function () {
            alert('Booking logic goes here.');
        });
    }
});
