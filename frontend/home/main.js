const navs = document.querySelectorAll('nav button')
const sections = document.querySelectorAll('section[data-type^="section-"]')
const accountNick = document.querySelector('.account .nick')

const accountId = document.querySelector('.account .id')
const accountCreatedAt = document.querySelector('.account .created-at')
const accountExitButton = document.querySelector('.account .exit')

const delAccountModal = document.querySelector('.modal-del-account')
const openDeleteModalBtn = document.querySelector('.account-actions .del-account')
const closeDeleteModalBtn = document.querySelector('.modal-actions .cancel')
const confirmDelAccountBtn = document.querySelector('.modal-actions .del-account')


navs.forEach((btn) => {
  btn.addEventListener('click', () => {
    navs.forEach((b) => {
      b.classList.remove('active')
    })
    btn.classList.add('active')
    
    sections.forEach((section) => {
      section.classList.remove('active')
    })
    document.querySelector(`[data-type="section-${btn.dataset.type}"]`).classList.add('active')
    
    btn.scrollIntoView({
      behavior: "smooth",
      inline: "center"
    })
  })
})

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