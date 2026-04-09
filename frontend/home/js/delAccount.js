const modalWindow = document.querySelector('.modal-window')
const openDeleteModalBtn = document.querySelector('.account-actions .del-account')

openDeleteModalBtn.addEventListener('click', () => {
  const html = `
    <div class="modal">
      <p>Вы точно хотите удалить аккаунт?</p>
    
      <div class="modal-actions del">
        <button class="modal-button cancel">Отмена</button>
        <button class="modal-button del-account">Удалить</button>
      </div>
    </div>`
  modalWindow.innerHTML = html
  modalWindow.classList.add('active')
})

modalWindow.addEventListener('click', (e) => {
  if (e.target.classList.contains('cancel')) {
    modalWindow.classList.remove('active')
  }
  if (e.target.classList.contains('del-account')) {
    fetch('/api/delAccount', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        window.location.href = "/logIn";
      }
    })
  }
})