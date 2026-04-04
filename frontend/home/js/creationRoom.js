const name = document.querySelector('.create-room-form .name input')
const outputErrorName = document.querySelector('.create-room-form .name .title')

const form = document.querySelector('.create-room-form')

name.addEventListener('input', () => {
  checkValid(name, outputErrorName, 3, 'Имя')
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  
  if (form.checkValidity()) {
    fetch('/api/creationRoom', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({'name': name.value.trim()})
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
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