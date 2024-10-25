document.getElementById('adminLogoutButton').addEventListener('click', function () {
    // Clear admin session and redirect to signin page
    fetch('/admin_logout', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                window.location.href = 'admin_signin.html'; // Redirect after successful logout
            }
        })
        .catch(error => {
            console.error('Logout error:', error);
        });
});
