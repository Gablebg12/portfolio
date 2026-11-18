/* Vrais modèles 3D des maisons (GLB exportés de Blender par outils/export_glb.py), affichés avec three.js.
   La maison tourne en suivant le défilement (rotation lissée), un peu inclinée, sur un fond blanc, avec son ombre. */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const draco = new DRACOLoader().setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/libs/draco/gltf/");
const loader = new GLTFLoader().setDRACOLoader(draco);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = t => t * t * (3 - 2 * t);

/* ---------- herbe : les pelouses arrivent de Blender en simples surfaces (l'herbe procédurale n'existe pas sur le web).
   On leur donne une texture d'herbe dessinée dans un canevas (raccordable) et on y plante des milliers de touffes. ---------- */
let texHerbeCache;
function texHerbe() {
  if (texHerbeCache) return texHerbeCache;
  const N = 512, c = document.createElement("canvas"); c.width = c.height = N;
  const g = c.getContext("2d");
  g.fillStyle = "#56762f"; g.fillRect(0, 0, N, N);
  const r = (a, b) => a + Math.random() * (b - a);
  const enBoucle = f => { for (const dx of [-N, 0, N]) for (const dy of [-N, 0, N]) f(dx, dy); };
  // grandes taches plus claires / plus sombres
  for (let i = 0; i < 60; i++) {
    const x = r(0, N), y = r(0, N), rad = r(30, 120), clair = Math.random() < 0.5;
    const col = clair ? `rgba(140,170,70,${r(.12, .25)})` : `rgba(40,62,22,${r(.12, .25)})`;
    enBoucle((dx, dy) => { const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, rad);
      gr.addColorStop(0, col); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x + dx - rad, y + dy - rad, rad * 2, rad * 2); });
  }
  // brins
  const pal = ["#3f5c22", "#4d6d29", "#5e8233", "#6f923b", "#86a64a", "#9cb85a", "#36511d"];
  g.lineCap = "round";
  for (let i = 0; i < 14000; i++) {
    const x = r(0, N), y = r(0, N), l = r(3, 9), a = r(-0.6, 0.6) - Math.PI / 2;
    g.strokeStyle = pal[(Math.random() * pal.length) | 0]; g.globalAlpha = r(.45, .95); g.lineWidth = r(.8, 1.8);
    enBoucle((dx, dy) => { g.beginPath(); g.moveTo(x + dx, y + dy); g.lineTo(x + dx + Math.cos(a) * l, y + dy + Math.sin(a) * l); g.stroke(); });
  }
  g.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return (texHerbeCache = t);
}
function touffe() {   // trois brins croisés, base sombre -> pointe claire
  const pos = [], col = [];
  for (let k = 0; k < 3; k++) {
    const a = k * Math.PI / 3 + Math.random() * 0.4, w = 0.035, lean = (Math.random() - 0.5) * 0.35;
    const cx = Math.cos(a) * w, cz = Math.sin(a) * w;
    pos.push(-cx, 0, -cz, cx, 0, cz, lean, 1, lean * 0.6);
    col.push(.45, .5, .35, .45, .5, .35, 1, 1, .9);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  geo.computeVertexNormals();
  return geo;
}
function herbe(root) {
  root.updateMatrixWorld(true);
  const pelouses = [];
  root.traverse(o => { if (o.isMesh && /pelouse/i.test(o.name + " " + (o.parent?.name || ""))) pelouses.push(o); });
  if (!pelouses.length) return;
  const tex = texHerbe(), v = new THREE.Vector3();
  const tris = [];
  let aire = 0;
  for (const o of pelouses) {
    const geo = o.geometry, p = geo.attributes.position, idx = geo.index;
    // coordonnées de texture à plat, en mètres : un motif tous les 1,6 m
    const uv = new Float32Array(p.count * 2);
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld); uv[2 * i] = v.x / 1.6; uv[2 * i + 1] = v.z / 1.6; }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    o.material = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.95, metalness: 0 });
    o.receiveShadow = true; o.castShadow = false;
    const n = idx ? idx.count : p.count, get = i => new THREE.Vector3().fromBufferAttribute(p, idx ? idx.getX(i) : i).applyMatrix4(o.matrixWorld);
    for (let i = 0; i < n; i += 3) {
      const a = get(i), b = get(i + 1), c = get(i + 2);
      const s = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).length() / 2;
      if (s > 1e-4) { tris.push([a, b, c, s]); aire += s; }
    }
  }
  const nb = Math.min(42000, Math.round(aire * 45));
  const brin = new THREE.InstancedMesh(touffe(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, side: THREE.DoubleSide }), nb);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), coul = new THREE.Color();
  const verts = [[0.30, 0.46, 0.16], [0.36, 0.52, 0.19], [0.42, 0.56, 0.22], [0.27, 0.40, 0.14], [0.50, 0.60, 0.26]];
  for (let i = 0; i < nb; i++) {
    let x = Math.random() * aire, t = tris[0];
    for (const tr of tris) { if ((x -= tr[3]) <= 0) { t = tr; break; } }
    let u = Math.random(), w = Math.random(); if (u + w > 1) { u = 1 - u; w = 1 - w; }
    const p = t[0].clone().addScaledVector(new THREE.Vector3().subVectors(t[1], t[0]), u).addScaledVector(new THREE.Vector3().subVectors(t[2], t[0]), w);
    q.setFromAxisAngle(up, Math.random() * Math.PI * 2);
    const h = 0.07 + Math.random() * 0.1, l = 0.8 + Math.random() * 0.7;
    sc.set(l, h, l); m.compose(p, q, sc); brin.setMatrixAt(i, m);
    brin.setColorAt(i, coul.setRGB(...verts[(Math.random() * verts.length) | 0]));
  }
  brin.castShadow = false; brin.receiveShadow = true;
  root.add(brin);
}

function setup(sec) {
  const holder = sec.querySelector(".m3d-canvas");
  const etapes = [...sec.querySelectorAll(".m3d-etape")];
  const mot = sec.querySelector(".m3d-mot");
  const deg = sec.querySelector(".m3d-deg");
  const bar = sec.querySelector(".m3d-bar i");
  const charge = sec.querySelector(".m3d-charge");

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  holder.append(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);

  const sun = new THREE.DirectionalLight(0xfff3e2, 3.2);
  sun.position.set(-6, 10, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -3.4, right: 3.4, top: 3.4, bottom: -3.4, near: 0.1, far: 40 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.01;
  scene.add(sun, new THREE.HemisphereLight(0xffffff, 0xd8d2c8, 0.9));

  const ombre = new THREE.Mesh(new THREE.CircleGeometry(1.25, 64), new THREE.ShadowMaterial({ opacity: 0.16 }));
  ombre.rotation.x = -Math.PI / 2; ombre.receiveShadow = true;
  scene.add(ombre);

  const pivot = new THREE.Group();   // rotation au scroll
  const incline = new THREE.Group(); // légère inclinaison « produit »
  incline.add(pivot); scene.add(incline);

  let ready = false, visible = false, current = 0, raf = 0;
  const progress = () => {
    const r = sec.getBoundingClientRect();
    return clamp(-r.top / (sec.offsetHeight - innerHeight), 0, 1);
  };

  function resize() {
    const w = holder.clientWidth, h = holder.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function frame(t) {
    raf = visible ? requestAnimationFrame(frame) : 0;
    const p = progress();
    const target = p * Math.PI * 2;
    current += (target - current) * 0.12;                  // rotation lissée comme un « scrub »
    const mobile = innerWidth < 760;
    const k = Math.sin(p * Math.PI);
    pivot.rotation.y = -0.55 + current;
    incline.rotation.z = 0.06 * Math.sin(current * 0.5);
    incline.position.y = 0.03 * Math.sin(t / 900);         // flotte doucement
    // la maison est à droite quand le texte est à gauche ; elle revient au centre à la fin du tour
    incline.position.x = mobile ? 0 : (0.72 - 0.3 * smooth(clamp((p - 0.82) / 0.18, 0, 1)));
    const s = (mobile ? 0.62 : 1.18) * (0.9 + 0.1 * k) * (+sec.dataset.echelle || 1);
    incline.scale.setScalar(s);
    ombre.position.x = incline.position.x; ombre.scale.setScalar(s);
    camera.position.set(0, mobile ? 2.4 : 2.0, mobile ? 9.2 : 6.6);
    camera.lookAt(incline.position.x * 0.35, mobile ? 0.55 : 0.42, 0);
    renderer.render(scene, camera);

    // interface autour du modèle
    const n = etapes.length, i = Math.min(n - 1, Math.floor(p * n * 0.999));
    etapes.forEach((e, j) => e.classList.toggle("on", j === i));
    if (mot) mot.style.transform = `translateX(${(18 - p * 36).toFixed(2)}vw)`;
    deg.textContent = `${Math.round(p * 360)}°`;
    bar.style.width = `${(p * 100).toFixed(1)}%`;
  }

  function load() {
    loader.load(sec.dataset.glb, gltf => {
      const m = gltf.scene;
      m.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = true; o.receiveShadow = true;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(mt => { if (mt.transparent) { mt.depthWrite = false; o.castShadow = false; } mt.side = THREE.FrontSide; });
      });
      herbe(m);
      // mise à l'échelle : la plus grande dimension au sol vaut 2 unités, posée à y = 0, centrée
      const box = new THREE.Box3().setFromObject(m), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
      const sc = 2 / Math.max(size.x, size.z);
      m.scale.setScalar(sc);
      m.position.set(-c.x * sc, -box.min.y * sc, -c.z * sc);
      pivot.add(m);
      ready = true;
      charge.remove();
      resize();
      if (!raf) raf = requestAnimationFrame(frame);
    }, ev => { if (ev.total) charge.textContent = `Chargement du modèle 3D… ${Math.round(ev.loaded / ev.total * 100)} %`; },
    () => { charge.textContent = "Le modèle 3D n'a pas pu être chargé."; });
  }

  let asked = false;
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !asked) { asked = true; load(); }
  }), { rootMargin: "120% 0px" }).observe(sec);
  new IntersectionObserver(es => es.forEach(e => {
    visible = e.isIntersecting;
    if (visible && ready && !raf) raf = requestAnimationFrame(frame);
  })).observe(sec);
  addEventListener("resize", () => ready && resize());
  resize();
}

document.querySelectorAll(".m3d[data-glb]").forEach(setup);
