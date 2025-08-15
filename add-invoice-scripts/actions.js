(function wireButtons(){
  const cancelBtn = document.getElementById('btn-cancel');
  if (!cancelBtn) return;

  cancelBtn.addEventListener('click', () => {
    // Preferred: use Electron APIs via window.close if allowed in modal
    try {
      // In most Electron renderers, this will close the current window
      window.close();
    } catch (e) {
      console.error('Failed to close window via window.close()', e);
    }
  });
})();
