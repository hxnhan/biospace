// la UI de lo de la similitud
const $ = id => document.getElementById(id);
const S = { body:'mars', site:0, profile:'infra' };
const similarity = (a,b,w)=>{let n=0,d=0;for(const k in w){n+=w[k]*(a[k]-b[k])**2;d+=w[k];}return Math.round(100*(1-Math.sqrt(n/d)));};
const bars = (v,ref)=>Object.keys(VARS).map(k=>`<div class="bar">${VARS[k]}<i><s style="width:${v[k]*100}%"></s></i><span>${ref?(v[k]>=ref[k]?'+':'')+Math.round((v[k]-ref[k])*100):Math.round(v[k]*100)}</span></div>`).join('');
function btns(el,items,cur,fn){el.innerHTML=items.map(([id,l])=>`<button class="${id==cur?'on':''}" data-id="${id}">${l}</button>`).join('');
  el.querySelectorAll('button').forEach(b=>b.onclick=()=>fn(b.dataset.id));}
function render(){
  const B=BODIES[S.body],site=B.sites[S.site],w=PROFILES[S.profile].w;
  btns($('bodies'),Object.entries(BODIES).map(([k,b])=>[k,b.name]),S.body,id=>{S.body=id;S.site=0;render();});
  btns($('sites'),B.sites.map((s,i)=>[i,s.name]),S.site,id=>{S.site=+id;render();});
  btns($('profiles'),Object.entries(PROFILES).map(([k,p])=>[k,p.label]),S.profile,id=>{S.profile=id;render();});
  $('target').innerHTML=`<h2>${site.name}</h2><small>Variables del sitio (0–100)</small>${bars(site.v)}`;
  const rank=EARTH.map(e=>({...e,s:similarity(site.v,e.v,w)})).sort((a,b)=>b.s-a.s);
  $('results').innerHTML=`<div class="lab">Análogos en la Tierra</div>`+rank.map(r=>`<div class="match"><h3>${r.name}<em>${r.s}%</em></h3><small>${r.type} · diferencia vs. el sitio (puntos)</small>${bars(r.v,site.v)}</div>`).join('');
}

// texto de cada planeta
const CH=[
 {n:'Marte',r:0,p:'Seis zonas candidatas: del hielo de Arcadia y Utopia a las capas de Valles Marineris y el cráter Jezero.',c:[['Atmósfera','CO₂ 95 %. Presión media cercana a 0,6 kPa.'],['Clima','Media de −60 °C, con oscilaciones diarias enormes.'],['Físico','Radio 3 389,5 km. Gravedad 3,71 m/s².']]},
 {n:'Luna',r:1,p:'Nos centramos en el polo sur: hielo de agua y zonas con luz solar casi permanente.',c:[['Atmósfera','Prácticamente nula: solo una exosfera tenue.'],['Clima','De −170 a +120 °C en la superficie.'],['Físico','Radio 1 737 km. Gravedad 1,62 m/s².']]},
 {n:'Tierra',r:0,p:'Nueve laboratorios naturales: polos, desiertos, cuevas de lava y volcanes. Cada punto brillante es un sitio análogo.',c:[['Atmósfera','Nitrógeno 78 %, oxígeno 21 %.'],['Clima','Media global cercana a 15 °C.'],['Físico','Radio 6 371 km. Gravedad 9,81 m/s².']]}];
$('chs').innerHTML=CH.map((c,i)=>`<section class="ch ${c.r?'r':''}"><div class="ct"><div class="num">0${i+2}<b></b>05</div><h2>${c.n}</h2><p>${c.p}</p></div><div class="d3">${c.c.map(x=>`<div><h4>${x[0]}</h4><p>${x[1]}</p></div>`).join('')}</div></section>`).join('');
const NAMES=['Inicio','Marte','Luna','Tierra','Explorador'];
$('idx').innerHTML=NAMES.map((n,i)=>`<a href="#" data-i="${i}">0${i+1} ${n}</a>`).join('');
$('idx').querySelectorAll('a').forEach(a=>a.onclick=e=>{e.preventDefault();scrollTo({top:a.dataset.i*innerHeight,behavior:'smooth'})});

// Ruido y texturas q son procedurales
function hash(x,y,z){let h=Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(z,2147483647);h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296;}
function noise(x,y,z){const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),u=x-xi,v=y-yi,w=z-zi,f=t=>t*t*(3-2*t),a=f(u),b=f(v),c=f(w),L=(p,q,t)=>p+(q-p)*t;
  return L(L(L(hash(xi,yi,zi),hash(xi+1,yi,zi),a),L(hash(xi,yi+1,zi),hash(xi+1,yi+1,zi),a),b),L(L(hash(xi,yi,zi+1),hash(xi+1,yi,zi+1),a),L(hash(xi,yi+1,zi+1),hash(xi+1,yi+1,zi+1),a),b),c);}
function fbm(x,y,z,o){let a=.5,f=1,s=0,n=0;for(let i=0;i<o;i++){s+=a*noise(x*f,y*f,z*f);n+=a;a*=.5;f*=2.03;}return Math.min(1,Math.max(0,(s/n-.5)*1.9+.5));}
const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
const sm=(a,b,x)=>{x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x);};
const COL={
 mars:(x,y,z)=>{const n=fbm(x*2.2,y*2.2,z*2.2,5),d=fbm(x*6+7,y*6,z*6,3);let c=mix(mix([58,28,22],[178,86,48],sm(.3,.62,n)),[224,162,110],sm(.55,.8,d*.6+n*.5));c=mix(c,[240,235,228],sm(.9,.95,Math.abs(y)+n*.05));return[...c,n*.7+d*.3];},
 moon:(x,y,z)=>{const n=fbm(x*3,y*3,z*3,6),m=sm(.45,.6,fbm(x*1.3+3,y*1.3,z*1.3,3)),v=(95+n*120)*(1-.4*m);return[v,v*.99,v*.96,n];},
 earth:(x,y,z)=>{const h=fbm(x*1.7,y*1.7,z*1.7,6);let c=h<.52?mix([4,18,52],[22,84,148],sm(.3,.52,h)):mix(mix([34,78,40],[100,100,58],sm(.52,.62,h)),[152,130,100],sm(.62,.78,h));c=mix(c,[238,244,248],sm(.86,.93,Math.abs(y)+(h-.5)*.12));return[...c,h<.52?.35:h];},
 cloud:(x,y,z)=>{const c=fbm(x*3+11,y*3,z*3,5);return[255,255,255,0,sm(.5,.8,c)*235];}
};
function crater(c,x,y,r,k){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(0,0,0,${.45*k})`);g.addColorStop(.7,`rgba(0,0,0,${.2*k})`);g.addColorStop(.88,`rgba(255,255,255,${.2*k})`);g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,6.283);c.fill();}
function texture(kind,W=768,H=384){
  const mk=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c},cm=mk(),cb=mk(),xm=cm.getContext('2d'),xb=cb.getContext('2d'),im=xm.createImageData(W,H),ib=xb.createImageData(W,H);
  for(let j=0;j<H;j++){const la=(.5-j/H)*Math.PI,cl=Math.cos(la),y=Math.sin(la);
    for(let i=0;i<W;i++){const lo=i/W*2*Math.PI,c=COL[kind](cl*Math.cos(lo),y,cl*Math.sin(lo)),k=(j*W+i)*4;
      im.data[k]=c[0];im.data[k+1]=c[1];im.data[k+2]=c[2];im.data[k+3]=c[4]??255;ib.data[k]=ib.data[k+1]=ib.data[k+2]=c[3]*255;ib.data[k+3]=255;}}
  xm.putImageData(im,0,0);xb.putImageData(ib,0,0);
  if(kind=='moon'||kind=='mars'){const N=kind=='moon'?900:260;for(let i=0;i<N;i++){const x=Math.random()*W,y=Math.random()*H,r=Math.random()**3*(kind=='moon'?16:12)+1.5;crater(xm,x,y,r,1);crater(xb,x,y,r,1);}}
  return{map:new THREE.CanvasTexture(cm),bump:new THREE.CanvasTexture(cb)};
}

// Escena 3D (mwjorar)
const cv=$('scene'),R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true,powerPreference:'high-performance'});
R.setPixelRatio(Math.min(devicePixelRatio,1.5));
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,1,.1,200);scene.add(cam);
scene.add(new THREE.AmbientLight(0x404058,.4));
const sun=new THREE.DirectionalLight(0xfff0dc,2.3);sun.position.set(6,2,5);scene.add(sun);
const PL={},reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
// borde interior y el halo exterior medio difuso
const rim=c=>new THREE.ShaderMaterial({uniforms:{c:{value:new THREE.Color(c)}},transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,
  vertexShader:'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'varying vec3 n;uniform vec3 c;void main(){float d=abs(dot(n,vec3(0.,0.,1.)));gl_FragColor=vec4(c*pow(1.-d,3.5)*.8,1.);}'});
const mkTex=stops=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,0,64,64,64);stops.forEach(([o,a])=>g.addColorStop(o,`rgba(255,255,255,${a})`));x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c);};
const dotT=mkTex([[0,1],[.25,.5],[1,0]]),haloT=mkTex([[0,.3],[.6,.22],[.68,.1],[.85,.03],[1,0]]);
const ll=(lat,lon,r)=>{const a=lat*Math.PI/180,o=lon*Math.PI/180;return new THREE.Vector3(r*Math.cos(a)*Math.sin(o),r*Math.sin(a),r*Math.cos(a)*Math.cos(o));};
function makePlanet(key,y,glow,sites,col){
  const t=texture(key),g=new THREE.Group(),mat=new THREE.MeshStandardMaterial({map:t.map,bumpMap:t.bump,bumpScale:key=='earth'?.02:.06,roughness:.95});g.position.y=y;
  g.add(new THREE.Mesh(new THREE.SphereGeometry(1,72,72),mat));
  // Si existe assets se usa en lugar de la textura por código (ya existen, hay q limpiar)
  new THREE.TextureLoader().load(`assets/${key}.jpg`,tx=>{mat.map=tx;mat.bumpMap=null;mat.needsUpdate=true;},undefined,()=>{});
  if(glow){g.add(new THREE.Mesh(new THREE.SphereGeometry(1.025,64,64),rim(glow)));
    const h=new THREE.Sprite(new THREE.SpriteMaterial({map:haloT,color:glow,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.7}));h.scale.setScalar(3.1);g.add(h);}
  let clouds;if(false){const ct=texture('cloud',512,256);clouds=new THREE.Mesh(new THREE.SphereGeometry(1.012,64,64),new THREE.MeshStandardMaterial({map:ct.map,transparent:true,depthWrite:false,roughness:1}));g.add(clouds);}
  const mk=sites.map(s=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:dotT,color:col,blending:THREE.AdditiveBlending,depthWrite:false}));sp.position.copy(ll(s.lat,s.lon,1.015));sp.scale.setScalar(.09);g.add(sp);return sp;});
  scene.add(g);PL[key]={g,mk,clouds,sites};
}
const stars=(()=>{const p=[];for(let i=0;i<3500;i++){const r=40+Math.random()*60,t=Math.random()*6.283,f=Math.acos(2*Math.random()-1);p.push(r*Math.sin(f)*Math.cos(t),r*Math.cos(f),r*Math.sin(f)*Math.sin(t));}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));const s=new THREE.Points(g,new THREE.PointsMaterial({size:.14,color:0xdfe6ff,transparent:true,opacity:.8}));scene.add(s);return s;})();
// Malla de terreno animada en la GPU como tipo preview del terreno 3D q falta
const tm=new THREE.Mesh(new THREE.PlaneGeometry(18,12,70,44),new THREE.ShaderMaterial({wireframe:true,transparent:true,depthWrite:false,uniforms:{t:{value:0},o:{value:.16}},
  vertexShader:'uniform float t;varying float a;void main(){vec3 p=position;p.z=sin(p.x*.5+t)*cos(p.y*.45+t*.7)*.6+sin(p.x*1.5-t*1.2)*.1;a=smoothstep(-6.,-2.,p.y)*(1.-smoothstep(1.,6.,p.y))*(1.-smoothstep(6.,9.,abs(p.x)));gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}',
  fragmentShader:'uniform float o;varying float a;void main(){gl_FragColor=vec4(1.,.42,.18,o*a);}'}));
tm.position.set(0,-2.6,-6);tm.rotation.x=-1.3;cam.add(tm);

// camara guiada por scroll
const ease=t=>t*t*(3-2*t),damp=(a,b,l,dt)=>a+(b-a)*(1-Math.exp(-l*dt)),mob=()=>innerWidth<900;
// side: 1 = planeta a la derecha, -1 = a la izquierda. La posicion X se calcula segun el ancho visible asi el planeta nunca se sale de pantalla
const keys=()=>{const o=mob()?0:1,sel=PL[S.body].g.position.y;return[{y:0,z:8,side:o},{y:0,z:3.9,side:o},{y:-9,z:4,side:-o},{y:-18,z:4,side:o},{y:sel,z:3.3,side:o}];};
const cur={y:0,z:8,side:1},mouse={x:0,y:0},ms={x:0,y:0};
addEventListener('pointermove',e=>{mouse.x=e.clientX/innerWidth-.5;mouse.y=e.clientY/innerHeight-.5;});
function resize(){R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();}
addEventListener('resize',resize);
const secs=[...document.querySelectorAll('.ch')],tele=$('tele'),idxA=[...$('idx').querySelectorAll('a')],co=$('callout');
const wrap=a=>((a+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI,V=new THREE.Vector3(),C=new THREE.Vector3();
let sSm=0,prevS=0,last=performance.now(),telT=0,coKey='',opC=[];
function loop(now){
  const dt=Math.min((now-last)/1000,.05);last=now;const t=now/1000;
  const raw=Math.min(scrollY/innerHeight,4);sSm=reduce?raw:damp(sSm,raw,5,dt);const s=sSm;
  const i=Math.min(Math.floor(s),3),f=ease(s-i),K=keys(),a=K[i],b=K[i+1],kk=reduce?1:8;
  cur.y=damp(cur.y,a.y+(b.y-a.y)*f,kk,dt);cur.z=damp(cur.z,a.z+(b.z-a.z)*f,kk,dt);cur.side=damp(cur.side,a.side+(b.side-a.side)*f,kk,dt);
  ms.x=damp(ms.x,mouse.x,3,dt);ms.y=damp(ms.y,mouse.y,3,dt);
  const halfW=Math.tan(cam.fov*Math.PI/360)*cur.z*cam.aspect;
  cam.position.set(-cur.side*.46*halfW+ms.x*.3,cur.y-ms.y*.2,cur.z);
  const dS=s-prevS;prevS=s;let showCo=false;
  for(const key in PL){const p=PL[key],g=p.g,inExp=s>3.5&&key==S.body;
    if(inExp){const st=p.sites[S.site];g.rotation.y+=wrap(-st.lon*Math.PI/180-g.rotation.y)*(1-Math.exp(-3*dt));g.rotation.x=damp(g.rotation.x,st.lat*Math.PI/180*.7,3,dt);}
    else{g.rotation.y+=(reduce?0:dt*.1)+dS*1.2;g.rotation.x=damp(g.rotation.x,0,3,dt);}
    if(p.clouds)p.clouds.rotation.y+=dt*.02;
    p.mk.forEach((m,j)=>m.scale.setScalar(inExp&&j==S.site?.22+Math.sin(t*4)*.05:.07+Math.sin(t*2+j)*.01));
    if(inExp){const m=p.mk[S.site];m.getWorldPosition(V);g.getWorldPosition(C);const nrm=V.clone().sub(C);
      if(nrm.dot(cam.position.clone().sub(V))>0){V.project(cam);co.style.transform=`translate(${(V.x*.5+.5)*innerWidth}px,${(-V.y*.5+.5)*innerHeight}px)`;showCo=true;}}}
  const sk=S.body+S.site;if(sk!=coKey){coKey=sk;const st=BODIES[S.body].sites[S.site];co.querySelector('b').textContent=st.name;co.querySelector('small').textContent=`${Math.abs(st.lat).toFixed(1)}° ${st.lat<0?'S':'N'} · ${Math.abs(st.lon).toFixed(1)}° ${st.lon<0?'O':'E'}`;}
  co.style.opacity=showCo?1:0;
  stars.position.y=cur.y*.9;tm.material.uniforms.t.value=reduce?0:t*.6;tm.material.uniforms.o.value=.16*(1-.6*sm(3,4,s));
  secs.forEach((el,j)=>{const o=Math.max(0,Math.min(1,1-Math.abs(s-j)*1.5)),r=Math.round(o*50);if(opC[j]!==r){opC[j]=r;el.style.opacity=r/50;}});
  idxA.forEach((el,j)=>el.classList.toggle('on',Math.round(s)==j));
  if(now-telT>150){telT=now;tele.innerHTML=`Escala <b>${cur.z.toFixed(2)} R</b> · Altitud <b>${Math.abs(cur.y).toFixed(1)}</b> · Ruta <b>${Math.round(Math.min(scrollY/(document.body.scrollHeight-innerHeight),1)*100)}%</b>`;}
  R.render(scene,cam);requestAnimationFrame(loop);
}
render();resize();
setTimeout(()=>{
  makePlanet('mars',0,0xff7a3d,BODIES.mars.sites,0xff7a3d);
  makePlanet('moon',-9,0x9fb4ff,BODIES.moon.sites,0xffd2a8);
  makePlanet('earth',-18,0x4aa3ff,EARTH,0x8fd0ff);
  requestAnimationFrame(loop);
  const b=$('boot');b.style.opacity=0;setTimeout(()=>b.remove(),1300);
},80);
