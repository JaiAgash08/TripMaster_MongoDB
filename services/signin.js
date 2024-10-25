document.getElementById('signin-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  const response = await fetch('/signin', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  });

  const result = await response.json();
  alert(result.message);
  if (result.message === 'Signin successful!') {
      window.location.href = 'book.html'; // Redirect to book page after successful signin
  }
});
