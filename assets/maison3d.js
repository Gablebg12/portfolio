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
