
// DATOS DEL SITIO  —  EDITA AQUÍ (Andrés: sitios Luna/Marte; Emma: análogos terrestres)
// ⚠ Los valores 'v' son EJEMPLOS aproximados. Reemplázalos con datos reales.
// Cada variable va normalizada de 0 a 1 (0 = mínimo, 1 = máximo del rango).
// ============================================================
const VARS = {
  temp:   'Temperatura (frío→cálido)',
  rad:    'Radiación',
  ice:    'Hielo / agua',
  relief: 'Relieve',
  volc:   'Vulcanismo / subsuelo',
  press:  'Presión atmosférica'
};

// Pesos por perfil de usuario (ajustables)
const PROFILES = {
  infra: { label: 'Infraestructura', w: { temp:1, rad:1.2, ice:1, relief:1.3, volc:.6, press:.8 } },
  astro: { label: 'Astrobiología',   w: { temp:1, rad:.8, ice:1.5, relief:.5, volc:1.3, press:.8 } }
};

// lat/lon en grados (lon este positivo)
const BODIES = {
  moon: { name:'Luna', color:[150,150,155], glow:'#9fb4ff', sites:[
    { name:'Polo sur lunar', lat:-88, lon:0, v:{temp:.05,rad:.95,ice:.6,relief:.7,volc:.1,press:0} }
  ]},
  mars: { name:'Marte', color:[175,80,45], glow:'#ff8a5c', sites:[
    { name:'Arcadia Planitia',      lat:47,  lon:-168, v:{temp:.2, rad:.8, ice:.8, relief:.1, volc:.3, press:.05} },
    { name:'Utopia Planitia',       lat:46,  lon:118,  v:{temp:.2, rad:.8, ice:.8, relief:.1, volc:.2, press:.05} },
    { name:'Deuteronilus Mensae',   lat:44,  lon:22,   v:{temp:.25,rad:.75,ice:.7, relief:.6, volc:.2, press:.05} },
    { name:'Protonilus Mensae',     lat:42,  lon:49,   v:{temp:.25,rad:.75,ice:.7, relief:.6, volc:.2, press:.05} },
    { name:'Melas Chasma',          lat:-10, lon:-70,  v:{temp:.4, rad:.7, ice:.3, relief:1,  volc:.5, press:.08} },
    { name:'Cráter Jezero',         lat:18,  lon:77,   v:{temp:.4, rad:.75,ice:.3, relief:.5, volc:.4, press:.06} }
  ]}
};

// Análogos terrestres (de los PDF de Emma: 5 sitios + 4 de montaña)
// ⚠ Los números 'v' son ESTIMACIONES hechas a partir de los PDF (0–1). Andrés: reemplazar con datos medidos.
const EARTH = [
  { name:'Concordia (Dome C), Antártida', type:'Polar · aislamiento y hipoxia', lat:-75,   lon:123,   v:{temp:.05,rad:.6, ice:.9, relief:.05,volc:.02,press:.65} },
  { name:'Desierto del Namib, Namibia',   type:'Árido · dunas',                 lat:-24,   lon:15,    v:{temp:.75,rad:.5, ice:.02,relief:.6, volc:.05,press:.97} },
  { name:'Isla Devon, Canadá',            type:'Polar · cráter y permafrost',   lat:75,    lon:-88,   v:{temp:.12,rad:.45,ice:.6, relief:.45,volc:.02,press:.98} },
  { name:'Tubos de lava, Lanzarote',      type:'Subterráneo · cueva',           lat:29,    lon:-13.6, v:{temp:.6, rad:.05,ice:.05,relief:.5, volc:.75,press:.98} },
  { name:'Cuevas de lava, Islandia',      type:'Subterráneo · cueva con hielo', lat:64,    lon:-21,   v:{temp:.25,rad:.08,ice:.45,relief:.45,volc:.95,press:.98} },
  { name:'Mauna Loa y Mauna Kea, Hawái',  type:'Montaña · volcán escudo',       lat:19.5,  lon:-155.6,v:{temp:.35,rad:.5, ice:.1, relief:.35,volc:.85,press:.6} },
  { name:'Monte Etna, Italia',            type:'Montaña · regolito negro',      lat:37.75, lon:15,    v:{temp:.4, rad:.4, ice:.25,relief:.6, volc:.95,press:.7} },
  { name:'Askja, Islandia',               type:'Montaña · entrenamiento Apolo', lat:65,    lon:-16.7, v:{temp:.2, rad:.45,ice:.3, relief:.55,volc:.7, press:.85} },
  { name:'Volcán Licancabur, Bolivia/Chile',type:'Montaña · aire fino',         lat:-22.8, lon:-67.9, v:{temp:.15,rad:.65,ice:.15,relief:.85,volc:.35,press:.5} }
];
