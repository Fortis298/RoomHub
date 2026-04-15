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
      
      if (!data.result.length) {
        htmlResults =`<div class="not-results">Нет результатов</div>`
        resultsContainer.innerHTML = htmlResults
        resultsContainer.classList.add('active')
      }
      
      for (let i = 0; i < data.result.length; i++) {
        let isPrivate = ``
        
        if (data.result[i].type == 'private') {
          isPrivate = document.createElement('svg')
          
          isPrivate = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="lock">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>`
          }
        
         htmlResults += `<div data-room-id="${data.result[i].room_id}">${data.result[i].name}${isPrivate}</div>`
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