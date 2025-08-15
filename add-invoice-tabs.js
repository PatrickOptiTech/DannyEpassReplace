window.loadTabPartial = async function(container){
  const src = container.dataset.src;
  if (!src) return;
  try {
    const res = await fetch(src, { cache: 'no-store' });
    const html = await res.text();
    container.innerHTML = html;
    container.dataset.loaded = 'true';
  } catch (e) {
    container.innerHTML = '<div style="padding:8px;color:#b91c1c">Failed to load tab.</div>';
  }
};
