const input = document.querySelector('.row input')
const blackout = document.querySelector('.blackout')
const resultsContainer = document.querySelector('.results')

input.addEventListener('input', () => {
  if (input.value.length > 0) {
    blackout.classList.add('active')
    
    fetch('/api/searchRoom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({'search': input.value.trim()})
    })
    .then(response => response.json())
    .then(data => {
      let htmlResults = ''
      
      for (let i = 0; i < data.result.length; i++) {
         htmlResults += `
          <div data-room-id="${data.result[i].room_id}">${data.result[i].name}</div>
        `
      }
      resultsContainer.innerHTML = htmlResults
      resultsContainer.classList.add('active')
    })
  }
  else {
    blackout.classList.remove('active')
    resultsContainer.classList.remove('active')
  }
})

input.addEventListener('focus', () => {
  if (input.value.length > 0) {
    blackout.classList.add('active')
    resultsContainer.classList.add('active')
  }
})

input.addEventListener('blur', () => {
  blackout.classList.remove('active')
  resultsContainer.classList.remove('active')
})