let theme = 'light';

const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
if (colorSchemeMedia.matches)  theme = 'dark';


function setTheme(theme) {
  switch (theme) {
    case 'dark':
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      break;

    case 'light':
    default:
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
  }
}

setTheme(theme);

colorSchemeMedia.addEventListener('change', e => {
  const theme = e.matches ? 'dark' : 'light';
  setTheme(theme);
});
