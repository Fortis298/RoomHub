const accountNick = document.querySelector('.account .nick')
const accountId = document.querySelector('.account .id')
const accountCreatedAt = document.querySelector('.account .created-at')

fetch('/api/checkSession', {
  method: 'POST',
  credentials: 'include',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({})
})
.then(response => response.json())
.then(data => {
  if (data.ok) {
    accountNick.textContent = data.info.nick
    accountId.textContent = data.info.id
    accountCreatedAt.textContent = data.info.created_at
  }
  else {
    window.location.href = "/logIn";
  }
})