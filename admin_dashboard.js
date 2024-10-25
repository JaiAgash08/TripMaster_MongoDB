document.addEventListener('DOMContentLoaded', async () => {
    const detailsBody = document.getElementById('details-body');

    try {
        const response = await fetch('/get_user_booking_details');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        data.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.username}</td>
                <td>${record.email}</td>
                <td><a href="mailto:${record.email}">Contact</a></td>
                <td><a href="mailto:${record.email}">Contact User</a></td>
                <td>${record.bookingId}</td>
                <td>${new Date(record.date).toLocaleDateString()}</td>
                <td>${record.status}</td>
            `;
            detailsBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching user and booking details:', error);
    }
});

function logout() {
    fetch('/admin_logout', {
        method: 'POST',
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/admin_signin.html'; // Redirect to admin signin
        } else {
            alert('Error during logout');
        }
    })
    .catch(error => console.error('Error during logout:', error));
}
