const accountExitButton = document.querySelector('.account .exit')

accountExitButton.addEventListener('click', () => {
  fetch('/api/exitAccount', {
    method: 'POST',
    credentials: 'include',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({})
  })
  .then(response => response.json())
  .then(data => {
    if (data.ok) {
      window.location.href = "/logIn";
    }
  })
})