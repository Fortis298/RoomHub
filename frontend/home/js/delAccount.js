const delAccountModal = document.querySelector('.modal-del-account')
const openDeleteModalBtn = document.querySelector('.account-actions .del-account')
const closeDeleteModalBtn = document.querySelector('.modal-actions .cancel')
const confirmDelAccountBtn = document.querySelector('.modal-actions .del-account')

openDeleteModalBtn.addEventListener('click', () => {
  delAccountModal.classList.add('active')
})
closeDeleteModalBtn.addEventListener('click', () => {
  delAccountModal.classList.remove('active')
})
confirmDelAccountBtn.addEventListener('click', () => {
  fetch('/api/delAccount', {
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