/* assets/script.js
   - Popula a lista de episódios em episodes.html
   - Lê ?id= na episode.html e carrega videos/ep{id}.mp4
   - Feito para vídeos locais dentro /videos (como você pediu)
*/

/* ===== Dados: edite títulos, thumbs e nomes de arquivo se quiser ===== */
const EPISODES = [
  { id:1, title:"NOITE ESCURA (T1, EP1)", thumb:"images/thumb1.jpg", file:"videos/ep1.mp4" },
  { id:2, title:"EP2 - SOMBRAS",          thumb:"images/thumb2.jpg", file:"videos/ep2.mp4" },
  { id:3, title:"EP3 - O LAGO",           thumb:"images/thumb3.jpg", file:"videos/ep3.mp4" },
  { id:4, title:"EP4 - MEMÓRIAS",         thumb:"images/thumb4.jpg", file:"videos/ep4.mp4" },
  { id:5, title:"EP5 - A FESTA",          thumb:"images/thumb5.jpg", file:"videos/ep5.mp4" },
  { id:6, title:"EP6 - NO SUBÚRBIO",      thumb:"images/thumb6.jpg", file:"videos/ep6.mp4" },
  { id:7, title:"EP7 - SEGREDOS",         thumb:"images/thumb7.jpg", file:"videos/ep7.mp4" },
  { id:8, title:"EP8 - FIM DO CULTO",     thumb:"images/thumb8.jpg", file:"videos/ep8.mp4" },
  { id:9, thumb:"images/thumb9.jpg",  title:"EXTRA 1 - INTRO PERDIDA", file:"videos/ep9.mp4" },
  { id:10, thumb:"images/thumb10.jpg",title:"EXTRA 2 - CENA REMOVIDA", file:"videos/ep10.mp4" },
  { id:11, thumb:"images/thumb11.jpg",title:"EXTRA 3 - ENTREVISTA",     file:"videos/ep11.mp4" },
];

/* ---------- Popula episodes.html ---------- */
(function populateEpisodesIfNeeded(){
  const list = document.getElementById('episodesList');
  if(!list) return;
  // Limpa
  list.innerHTML = '';
  EPISODES.forEach(ep=>{
    const a = document.createElement('a');
    a.href = `episode.html?id=${encodeURIComponent(ep.id)}`;
    a.className = 'episode-card';
    a.innerHTML = `
      <img class="episode-thumb" src="${ep.thumb}" alt="${escapeHtml(ep.title)}" onerror="this.onerror=null; this.src='images/hero.jpg'">
      <div class="episode-info">${escapeHtml(ep.title)}</div>
    `;
    list.appendChild(a);
  });
})();

/* ---------- Carrega episódio se estivermos em episode.html ---------- */
(function loadEpisodeIfNeeded(){
  const epTitle = document.getElementById('epTitle');
  const videoPanel = document.getElementById('videoPanel');
  const fallback = document.getElementById('videoFallback');
  if(!epTitle || !videoPanel) return;

  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id'), 10) || 0;
  const ep = EPISODES.find(e=>e.id === id);

  if(!ep){
    epTitle.textContent = 'Episódio não encontrado';
    if(fallback) fallback.textContent = 'ID inválido. Volte para a lista de episódios.';
    return;
  }

  epTitle.textContent = ep.title;
  // monta <video> com source para arquivo local (videos/epX.mp4)
  const vid = document.createElement('video');
  vid.controls = true;
  vid.playsInline = true;
  vid.preload = 'metadata';
  vid.style.width = '100%';
  vid.style.height = '100%';

  const src = document.createElement('source');
  src.src = ep.file;
  src.type = 'video/mp4';
  vid.appendChild(src);

  // limpa e insere
  videoPanel.innerHTML = '';
  videoPanel.appendChild(vid);

  // tenta carregar (se o arquivo estiver no GitHub Pages, vai carregar)
  setTimeout(()=> {
    try{ vid.load(); }catch(e){}
  }, 50);
})();

/* escape simples para evitar XSS quando mostramos títulos */
function escapeHtml(s){
  if(!s) return '';
  return String(s).replace(/[&<>"']/g, function(ch){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[ch];
  });
}
