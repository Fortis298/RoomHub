const accountNick = document.querySelector('.account .nick')
const accountId = document.querySelector('.account .id')
const accountCreatedAt = document.querySelector('.account .created-at')
const rooms = document.querySelector('.you-rooms')

export function fetchDataUser() {
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
      
      let roomCardHtml = ''
      
      for (let i = 0; i < data.room.length; i++) {
        let isPrivate = ``
        
        if (data.room[i].type == 'private') {
          isPrivate = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="lock">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>`
        }
        
        roomCardHtml += `
          <section class="you-room">
            <div class="name-room">
              <h3>${data.room[i].name}</h3>
              ${isPrivate}
            </div>
            <button class="btn-del-room" data-room-id="${data.room[i].room_id}" data-room-name="${data.room[i].name}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="del-room">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </section>
        `
      }
      rooms.innerHTML = roomCardHtml
    }
    else {
      window.location.href = "/logIn";
    }
  })
}

fetchDataUser()