const navs = document.querySelectorAll('nav button')
const sections = document.querySelectorAll('section[data-type^="section-"]')
const rooms = document.querySelector('.you-rooms')

document.body.style.height = `${window.innerHeight}px`

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
  })
})