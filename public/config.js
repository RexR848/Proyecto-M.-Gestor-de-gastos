function setTheme(theme) {
  document.body.classList.remove('light-theme', 'custom-theme');
  document.getElementById('color-picker-section').style.display = 'none';

  if (theme === 'light') {
    document.body.classList.add('light-theme');
  } else if (theme === 'custom') {
    document.body.classList.add('custom-theme');
    document.getElementById('color-picker-section').style.display = 'block';
  }
}

function toggleCustomPicker() {
  setTheme('custom');
}

document.getElementById('color').addEventListener('input', function () {
  const color = this.value;
  document.documentElement.style.setProperty('--accent-color', color);
});
