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

function setCustomThemeColor(hexColor) {
  document.body.className = "custom-theme";
  document.documentElement.style.setProperty('--bg-color', hexColor);

  const brightness = getBrightness(hexColor);
  const textColor = brightness > 128 ? '#000000' : '#f0f0f0'; // texto negro si fondo claro, blanco si fondo oscuro
  document.documentElement.style.setProperty('--text-color', textColor);
}

function getBrightness(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}
