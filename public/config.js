document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const colorPicker = document.getElementById("colorPicker");
  const colorPickerContainer = document.getElementById("color-picker-container");

  // Restaurar tema guardado
  const savedTheme = localStorage.getItem("theme") || "dark";
  const savedColor = localStorage.getItem("customColor") || "#4caf50";

  applyTheme(savedTheme);
  if (savedTheme === "custom") {
    colorPicker.value = savedColor;
    root.style.setProperty('--custom-color', savedColor);
    colorPickerContainer.classList.remove("hidden");
  }

  colorPicker.addEventListener("input", () => {
    const selectedColor = colorPicker.value;
    root.style.setProperty('--custom-color', selectedColor);
    localStorage.setItem("customColor", selectedColor);
  });
});

function setTheme(theme) {
  const root = document.documentElement;
  const colorPickerContainer = document.getElementById("color-picker-container");

  document.body.classList.remove("dark-theme", "light-theme", "custom-theme");

  if (theme === "dark") {
    document.body.classList.add("dark-theme");
    colorPickerContainer.classList.add("hidden");
  } else if (theme === "light") {
    document.body.classList.add("light-theme");
    colorPickerContainer.classList.add("hidden");
  } else if (theme === "custom") {
    document.body.classList.add("custom-theme");
    colorPickerContainer.classList.remove("hidden");
  }

  localStorage.setItem("theme", theme);
}
