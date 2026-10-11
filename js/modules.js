
// MÓDULOS PLANEADOS de lo qur falta
const MODULES = [
  { t:'Mapa de análogos',            d:'Mapa mundial con todos los sitios terrestres y su índice de similitud con el sitio elegido.', who:'' },
  { t:'Modo astrobiología',          d:'Busca lugares terrestres para estudiar habitabilidad y señales o restos de vida microbiana.', who:'' },
  { t:'Terreno 3D real',             d:'Reconstrucción del terreno a partir de heightmaps de NASA (Three.js / CesiumJS).', who:'Andrés (datos) y Hanne (visualización)' },
  { t:'Comparación lado a lado',     d:'Terreno de Luna/Marte junto al análogo terrestre, con cámaras sincronizadas.', who:'' },
  { t:'Paseo virtual y modo rover',  d:'Recorrer el terreno y ver cómo se mueve un rover (Unity WebGL).', who:'' },
  { t:'Perfiles de usuario y misión',d:'Ajusta la búsqueda según el tipo de usuario y el perfil de misión: tripulación, duración, recursos.', who:'' },
  { t:'Fichas de los sitios',        d:'Flora y fauna, suelo y minerales, clima, humedad y topografía de cada sitio, con imágenes.', who:'' },
  { t:'Descubrir sitios nuevos',     d:'Búsqueda en bases de datos amplias para hallar lugares poco estudiados o no considerados.', who:'' },
  { t:'Biodiversidad y conservación',d:'Especies del lugar y cómo proteger las que estén amenazadas o dependan de ese hábitat.', who:'' },
  { t:'Datos NISAR',                 d:'Humedad, tipo de suelo y salud de la vegetación como dato complementario.', who:'' },
  { t:'Datasets e instrumentos',     d:'Fuentes usadas: HiRISE, CRISM, MOLA, THEMIS (Marte); LOLA, LROC, Diviner, M³ (Luna).', who:'' }
];
const dlg = document.getElementById('mdlg');
document.getElementById('mgrid').innerHTML = MODULES.map((m,i)=>
  `<button class="mcard" data-i="${i}"><strong>${m.t}</strong><span>${m.d}</span><em>${m.ready?'Disponible':'Próximamente'}</em></button>`).join('');
document.querySelectorAll('.mcard').forEach(b=>b.onclick=()=>{
  const m = MODULES[b.dataset.i];
  if(m.ready && m.url){ location.href = m.url; return; }
  document.getElementById('mt').textContent = m.t;
  document.getElementById('md').textContent = m.d;
  document.getElementById('mw').textContent = 'Responsable: ' + m.who;
  dlg.showModal();
});
document.getElementById('mc').onclick = ()=>dlg.close();
dlg.addEventListener('click', e=>{ if(e.target===dlg) dlg.close(); });
