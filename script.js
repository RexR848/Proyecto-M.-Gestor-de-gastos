const { exec } = require('child_process');

const urls = [
  'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwjS576T3cKOAxWVle4BHcWFIAYQFnoECAoQAQ&url=https%3A%2F%2Fes.pornhub.com%2F&usg=AOvVaw1dhA39z_vJqwysXB97rFVs&opi=89978449',
  'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiEqfyZ3cKOAxXLl-4BHXqxFvUQFnoECAwQAQ&url=https%3A%2F%2Fwww.xvideos.com%2F&usg=AOvVaw1WOXjblt8wFIzKYnLM3-Tj&opi=89978449',
  'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwj4s-Kk3cKOAxWRI0QIHdkYED4QFnoECBkQAQ&url=https%3A%2F%2Fwww.temu.com%2Fmx%2F1pc--realista--eyaculador--largo-y---estimulacion-juguetes-sexuales-para-adultos-de---calidad-g-601099527080322.html&usg=AOvVaw1lGyXsh6zHLbU9Pt71W8I3&opi=89978449',
  'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwj5mN6t3cKOAxVKDEQIHWGjJ60Qh-wKegQIHhAE&url=https%3A%2F%2Fwww.tiktok.com%2F%40pablonomah%2Fvideo%2F7487730106236931383&usg=AOvVaw1MBmi5HnNHQc4tLiTtjkv1&opi=89978449'
];

let i = 0;
const interval = setInterval(() => {
  if (i >= urls.length) {
    clearInterval(interval);
    return;
  }

  // Cambia según tu sistema operativo:
  // En Windows:
  exec(`start ${urls[i]}`);
  // En macOS usa: exec(`open ${urls[i]}`);
  // En Linux usa: exec(`xdg-open ${urls[i]}`);

  i++;
}, 1000);
