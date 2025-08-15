// Handle textarea scrolling with buttons
document.querySelectorAll('.scroll-buttons').forEach(buttons => {
  const textarea = buttons.previousElementSibling;
  const up = buttons.querySelector('.scroll-up');
  const down = buttons.querySelector('.scroll-down');
  
  if (!textarea || !up || !down) return;
  
  up.addEventListener('click', () => {
    textarea.scrollTop -= 20;
  });
  
  down.addEventListener('click', () => {
    textarea.scrollTop += 20;
  });
});
