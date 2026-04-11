import { fetchDataUser } from './fetchDataUser.js'

const rooms = document.querySelector('.you-rooms')
const modalWindow = document.querySelector('.modal-window')

rooms.addEventListener('click', (e) => {
  const room = e.target.closest('.btn-del-room')
  if (!room) return
  
  const html = `
    <div class="modal">
      <p>Вы точно хотите удалить комнату «${room.dataset.roomName}»?</p>
    
      <div class="modal-actions del">
        <button class="modal-button cancel">Отмена</button>
        <button class="modal-button del-room" data-room-id="${room.dataset.roomId}">Удалить</button>
      </div>
    </div>`
  modalWindow.innerHTML = html
  modalWindow.classList.add('active')
})

modalWindow.addEventListener('click', (e) => {
  if (e.target.classList.contains('del-room')) {
    fetch('/api/delRoom', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({'room_id': e.target.dataset.roomId})
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        const html = `
          <div class="modal">
            <p>Комната успешно удалена</p>
          
            <div class="modal-actions del">
              <button class="modal-button cancel">Закрыть</button>
            </div>
          </div>`
        modalWindow.innerHTML = html
        modalWindow.classList.add('active')
        
        fetchDataUser()
      }
      else {
        const html = `
          <div class="modal">
            <p>Не удалось удалить комнату</p>
          
            <div class="modal-actions del">
              <button class="modal-button cancel">Закрыть</button>
            </div>
          </div>`
        modalWindow.innerHTML = html
        modalWindow.classList.add('active')
      }
    })
  }
})