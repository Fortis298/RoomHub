const name = document.querySelector('.create-room-form .name input')
const outputErrorName = document.querySelector('.create-room-form .name .title')
const form = document.querySelector('.create-room-form')

name.addEventListener('input', () => {
  checkValid(name, outputErrorName, 3, 'Название')
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  
  if (form.checkValidity()) {
    const typeRoom = document.querySelector('input[name="type-room"]:checked')
    
    fetch('/api/creationRoom', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({'name': name.value.trim(), 'typeroom': typeRoom.value.trim()})
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        if (data.typeroom == 'public') {
          const html = `
            <div class="modal">
              <p>Комната «${name.value.trim()}» создана</p>
              <div class="modal-actions room-public">
                <button class="modal-button close">Закрыть</button>
              </div>
            </div>`
          modalWindow.innerHTML = html
          modalWindow.classList.add('active')
          
          modalWindow.addEventListener('click', (e) => {
            if (e.target.classList.contains('close')) {
              modalWindow.classList.remove('active')
            }
          })
        }
        else {
          const html = `
            <div class="modal">
              <p>Комната «${name.value.trim()}» создана</p>
              <span>Сохраните ключ для входа, он будет показан только 1 раз</span>
              
              <div class="invite-code">${data.invitecode}</div>
    
              <div class="modal-actions room-private">
                <button class="modal-button close">Закрыть</button>
                <button class="modal-button copy">Скопировать</button>
              </div>
            </div>`
          modalWindow.innerHTML = html
          modalWindow.classList.add('active')
          
          modalWindow.addEventListener('click', (e) => {
            if (e.target.classList.contains('close')) {
              modalWindow.classList.remove('active')
            }
            if (e.target.classList.contains('copy')) {
              const textToCopy = data.invitecode
              
              navigator.clipboard.writeText(textToCopy)
              .then(() => {
                e.target.textContent = 'Скопировано'
              })
              .catch(err => {
                e.target.textContent = 'Ошибка'
              })
            }
          })
        }
      }
      else {
        if (data.errors.name) {
          !checkValid(name, outputErrorName, 3, 'Название', data.errors.name.cause) ? invalidAnimation(name) : null
        }
      }
    })
  }
  else {
    !checkValid(name, outputErrorName, 3, 'Название') ? invalidAnimation(name) : null
  }
})

function invalidAnimation(field) {
  field.parentElement.classList.toggle('shake')
  field.parentElement.addEventListener('animationend', () => {
    field.parentElement.classList.remove('shake')
  }, { once: true })
}

function checkValid(field, outputError, minLen, fieldName, cause=false) {
  const validity = field.validity
  
  if (validity.valueMissing || validity.tooShort || cause == 'EMPTY' || cause == 'TOO_SHORT') {
    outputError.textContent = `Минимальная длинна - ${minLen}`
    field.parentElement.classList.add('invalid')
    return false
  } 
  else if (validity.patternMismatch || cause == 'INVALID_PATTERN') {
    outputError.textContent = 'Можно только A-Z , a-z , 0-9 , _'
    field.parentElement.classList.add('invalid')
    return false
  }
  else if (cause == 'TOO_LONG') {
    outputError.textContent = `Слишком длинное значение`
    field.parentElement.classList.add('invalid')
    return false
  }
  else if (cause == 'EXISTS') {
    outputError.textContent = `Такого название занято`
    field.parentElement.classList.add('invalid')
    return false
  }
  else if (validity.valid) {
    outputError.textContent = fieldName
    field.parentElement.classList.remove('invalid')
    return true
  }
  else {
    outputError.textContent = 'Неверный ввод'
    field.parentElement.classList.add('invalid')
    return false
  }
  
}