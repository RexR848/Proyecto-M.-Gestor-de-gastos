function setTheme(theme) {
  localStorage.setItem('selectedTheme', theme)
  applyTheme()
}

function applyTheme() {
  const theme = localStorage.getItem('selectedTheme') || 'dark'
  document.body.classList.remove('light-theme', 'custom-theme')
  if (theme === 'light') document.body.classList.add('light-theme')
  if (theme === 'custom') document.body.classList.add('custom-theme')
}

document.addEventListener('DOMContentLoaded', applyTheme)
