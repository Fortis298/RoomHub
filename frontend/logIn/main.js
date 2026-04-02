const nick = document.querySelector('.nick input')
const outputErrorNick = document.querySelector('.nick div')
const password = document.querySelector('.password input')
const outputErrorPassword = document.querySelector('.password div')

const form = document.querySelector('form')

nick.addEventListener('input', () => {
  checkValid(nick, outputErrorNick, 3, 'Имя')
})
password.addEventListener('input', () => {
  checkValid(password, outputErrorPassword, 8, 'Пароль')
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  
  if (form.checkValidity()) {
    fetch('/api/logIn', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({'nick': nick.value.trim(), 'password': password.value.trim()})
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        window.location.href = "/home";
      }
      else {
        if (data.errors.nick) {
          !checkValid(nick, outputErrorNick, 3, 'Имя', data.errors.nick.cause) ? invalidAnimation(nick) : null
        }
        if (data.errors.password) {
          !checkValid(password, outputErrorPassword, 8, 'Пароль', data.errors.password.cause) ? invalidAnimation(password) : null
        }
      }
    })
  }
  else {
    !checkValid(nick, outputErrorNick, 3, 'Имя') ? invalidAnimation(nick) : null
    !checkValid(password, outputErrorPassword, 8, 'Пароль') ? invalidAnimation(password) : null
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
  else if (cause == 'NOT_EXISTS') {
    outputError.textContent = `Такого пользователя нет`
    field.parentElement.classList.add('invalid')
    return false
  }
  else if (cause == 'INVALID_PASSWORD') {
    outputError.textContent = `Неверный пароль`
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