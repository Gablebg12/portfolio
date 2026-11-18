/* Vue éclatée de la 4L : 120 images rendues dans Blender (outils/eclate_4l.py), la position du défilement
   choisit l'image affichée, donc la voiture se monte quand on descend et se démonte quand on remonte.
   Les images ont un fond blanc : le canevas est en « multiply » pour se fondre dans le fond de la section. */
(() => {
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  document.querySelectorAll(".m3d[data-seq]").forEach(sec => {
    const dossier = sec.dataset.seq, nb = +sec.dataset.nb;
    const holder = sec.querySelector(".m3d-canvas");
    const etapes = [...sec.querySelectorAll(".m3d-etape")];
    const mot = sec.querySelector(".m3d-mot"), deg = sec.querySelector(".m3d-deg");
    const bar = sec.querySelector(".m3d-bar i"), charge = sec.querySelector(".m3d-charge");
    const cv = document.createElement("canvas"), ctx = cv.getContext("2d");
    holder.append(cv);
    const imgs = new Array(nb);
    let charges = 0, demande = false, vu = -1, raf = 0;

    const nom = i => `${dossier}f${String(i).padStart(3, "0")}.jpg`;
    function charger() {
      if (demande) return; demande = true;
      // la première image d'abord, puis une sur huit (aperçu rapide en scrollant vite), puis le reste
      const ordre = [0, ...Array.from({ length: nb }, (_, i) => i).filter(i => i && i % 8 === 0),
                     ...Array.from({ length: nb }, (_, i) => i).filter(i => i % 8)];
      ordre.forEach(i => {
        const im = new Image();
        im.decoding = "async";
        im.onload = () => { imgs[i] = im; charges++; if (charge) charge.textContent = `Chargement… ${Math.round(charges / nb * 100)} %`;
                            if (charges === nb && charge) charge.remove(); vu = -1; demander(); };
        im.src = nom(i);
      });
    }
    function proche(i) {               // image chargée la plus proche de celle demandée
      for (let d = 0; d < nb; d++) { if (imgs[i - d]) return imgs[i - d]; if (imgs[i + d]) return imgs[i + d]; }
    }
    function taille() {
      const r = Math.min(devicePixelRatio || 1, 2);
      cv.width = holder.clientWidth * r; cv.height = holder.clientHeight * r; vu = -1;
    }
    function dessiner() {
      raf = 0;
      const rect = sec.getBoundingClientRect();
      const p = clamp(-rect.top / (sec.offsetHeight - innerHeight), 0, 1);
      const i = Math.round(p * (nb - 1));
      const n = etapes.length, e = Math.min(n - 1, Math.floor(p * n * 0.999));
      etapes.forEach((el, j) => el.classList.toggle("on", j === e));
      if (mot) mot.style.transform = `translateX(${(18 - p * 36).toFixed(2)}vw)`;
      deg.textContent = `${Math.round(p * 100)} %`;
      bar.style.width = `${(p * 100).toFixed(1)}%`;
      const im = proche(i);
      if (!im || i === vu) return;
      vu = imgs[i] ? i : -1;
      const W = cv.width, H = cv.height, mobile = innerWidth < 760;
      const s = mobile ? Math.min(W * 1.25 / im.width, H * 0.62 / im.height) : Math.min(W * 0.8 / im.width, H * 1.0 / im.height);
      const w = im.width * s, h = im.height * s;
      const cx = mobile ? W / 2 : W * 0.6, cy = mobile ? H * 0.43 : H * 0.54;
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
      ctx.drawImage(im, cx - w / 2, cy - h / 2, w, h);
    }
    const demander = () => { if (!raf) raf = requestAnimationFrame(dessiner); };

    new IntersectionObserver(es => es.forEach(e => e.isIntersecting && charger()), { rootMargin: "150% 0px" }).observe(sec);
    addEventListener("scroll", demander, { passive: true });
    addEventListener("resize", () => { taille(); demander(); });
    taille(); demander();
  });
})();
