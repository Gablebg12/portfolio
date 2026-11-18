/* Portfolio : construit la page à partir de data/projets.js */
(() => {
  const P = window.PORTFOLIO;
  const $ = (s, el = document) => el.querySelector(s);
  const h = (tag, attrs = {}, ...kids) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    }
    for (const k of kids.flat()) if (k != null) el.append(k.nodeType ? k : document.createTextNode(k));
    return el;
  };
  const isPlaceholder = s => typeof s === "string" && /^\[.*\]$/.test(s.trim());
  const txt = s => h("p", { class: isPlaceholder(s) ? "placeholder" : null }, s);

  /* ---------- briques communes ---------- */
  const chiffres = list => h("div", { class: "chiffres" }, list.map(([b, s]) => h("div", { class: "chiffre" }, h("b", {}, b), h("span", {}, s))));
  const tags = list => h("div", { class: "tags" }, list.map(t => h("span", { class: "tag" }, t)));
  const galerie = items => h("div", { class: "galerie" }, items.map(it =>
    h("figure", { onclick: () => lightbox(it) }, h("img", { src: it.src, alt: it.legende || "", loading: "lazy" }), it.legende ? h("figcaption", {}, it.legende) : null)));

  /* Toutes les vidéos tournent en boucle, sans clic, son coupé. Si la vidéo a du son, un bouton l'active ;
     dès qu'elle sort de l'écran, le son se coupe (et la vidéo se met en pause pour ne rien consommer). */
  const boucles = [];
  function boucle({ src, poster, titre, son, format = "paysage" }) {
    const v = h("video", { src, poster, autoplay: "", muted: "", loop: "", playsinline: "", preload: "metadata", "aria-label": titre || "Vidéo" });
    v.muted = true;
    const box = h("div", { class: `boucle ${format}` }, v, titre ? h("div", { class: "boucle-titre" }, titre) : null);
    if (son) {
      const b = h("button", { class: "boucle-son", type: "button", "aria-label": "Activer le son" });
      const maj = () => { b.classList.toggle("on", !v.muted); b.textContent = v.muted ? "🔇 Activer le son" : "🔊 Son activé"; b.setAttribute("aria-label", v.muted ? "Activer le son" : "Couper le son"); };
      b.addEventListener("click", () => {
        const allumer = v.muted;
        boucles.forEach(o => { o.muted = true; o.dispatchEvent(new Event("volumechange")); });   // une seule vidéo parle à la fois
        v.muted = !allumer; v.play().catch(() => {}); maj();
      });
      v.addEventListener("volumechange", maj);
      maj(); box.append(b);
    }
    boucles.push(v);
    return box;
  }
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { v.play().catch(() => {}); }
    else { v.muted = true; v.pause(); }
  }), { threshold: 0.15 });

  /* ---------- en-tête ---------- */
  const id = P.identite;
  $("#hero-nom").textContent = id.nom;
  $("#nav-nom").textContent = isPlaceholder(id.nom) ? "Portfolio" : id.nom;
  $("#hero-accroche").textContent = id.accroche;
  $("#hero-intro").textContent = id.intro;
  { // écran d entrée : nom en grand sur fond noir, qui s efface en descendant
    const [pre, ...reste] = id.nom.split(" ");
    $("#rideau-nom").append(h("span", {}, pre), " ", h("span", { class: "acc" }, reste.join(" ")));
    const fond = $("#rideau-fond"), nomR = $("#rideau-nom"), nav = $(".nav"), indice = $(".rideau-hint");
    let att = false;
    const maj = () => {
      att = false;
      const k = Math.min(1, scrollY / (innerHeight * 0.75));
      fond.style.opacity = (1 - k) * (1 - k);
      indice.style.opacity = Math.max(0, 1 - k * 4);
      fond.style.visibility = k >= 1 ? "hidden" : "visible";
      nomR.style.opacity = 1 - k * 1.2;
      nomR.style.transform = `translateY(${scrollY * 0.35}px) scale(${1 - k * 0.08})`;
      nav.classList.toggle("sur-noir", k < 0.3);
    };
    addEventListener("scroll", () => { if (!att) { att = true; requestAnimationFrame(maj); } }, { passive: true });
    addEventListener("resize", maj);
    maj();
  }
  if (!isPlaceholder(id.nom)) document.title = `${id.nom} · Portfolio`;

  /* ---------- 1. modèles 3D ---------- */
  const liste3d = $("#modeles-liste");
  for (const m of P.modeles3d) {
    const bloc = h("article", { class: "projet", id: `projet-${m.id}` });
    const corps = h("div", { class: "wrap" });
    if (m.type === "modele3d") {
      bloc.append(scene3d(m));
      corps.classList.add("m3d-apres");
    } else {
      corps.append(h("div", { class: "projet-head reveal" }, h("h3", {}, m.titre), h("p", { class: "sous" }, m.sousTitre)));
    }
    corps.append(h("div", { class: "grid2 reveal" },
      h("div", { class: "texte" }, m.description.map(txt), tags(m.tags)),
      chiffres(m.chiffres)));
    if (m.coulisses) corps.append(h("h4", { class: "sous-titre" }, "Dans Blender"), galerie(m.coulisses));
    if (m.video) corps.append(h("h4", { class: "sous-titre" }, m.video.titre || "Vidéo"), boucle({ ...m.video, titre: null }));
    if (m.galerie) corps.append(h("h4", { class: "sous-titre" }, "Rendus"), galerie(m.galerie));
    if (m.aVenir) corps.append(h("div", { class: "a-venir" }, m.aVenir));
    bloc.append(corps);
    liste3d.append(bloc);
  }

  /* Section façon « produit » : le vrai modèle 3D (GLB, three.js) tourne avec le défilement (assets/maison3d.js),
     un mot géant pâle derrière, et trois blocs de texte qui se relaient à côté. */
  function scene3d(m) {
    const etapes = m.etapes.map(([t, s], i) => h("div", { class: "m3d-etape", "data-i": i },
      h("small", {}, `0${i + 1} / 0${m.etapes.length}`), h("h3", {}, t), h("p", {}, s)));
    return h("section", m.sequence
        ? { class: "m3d m3d-seq", "data-seq": m.sequence.dossier, "data-nb": m.sequence.nb, style: "height:500vh" }
        : { class: "m3d", "data-glb": m.glb, "data-echelle": m.echelle || 1, style: "height:400vh" },
      h("div", { class: "m3d-sticky" },
        h("div", { class: "m3d-mot", "aria-hidden": "true" }, m.motFond || ""),
        h("div", { class: "m3d-socle" }),
        h("div", { class: "m3d-canvas" }),
        h("div", { class: "m3d-texte" }, etapes),
        h("div", { class: "m3d-titre" }, h("span", {}, m.sousTitre), h("h2", {}, m.titre)),
        h("div", { class: "m3d-deg" }, m.sequence ? "0 %" : "0°"),
        h("div", { class: "m3d-charge" }, m.sequence ? "Chargement…" : "Chargement du modèle 3D…"),
        h("div", { class: "m3d-bar" }, h("i"))));
  }

  /* ---------- 2. films : un épisode + comment il a été fait ---------- */
  const F = P.films;
  $("#films-contenu").append(
    h("div", { class: "projet-head reveal" }, h("h3", {}, F.titre)),
    h("p", { class: "films-intro reveal" }, F.intro),
    h("div", { class: "film reveal" },
      h("div", { class: "film-video" }, boucle({ ...F.episode, format: "vertical" })),
      h("div", {},
        h("h4", { class: "sous-titre", style: "margin-top:0" }, "Comment je me sers de l'IA pour les faire"),
        h("ol", { class: "film-etapes" }, F.methode.map(([b, s]) => h("li", {}, h("b", {}, b), h("span", {}, s)))),
        tags(F.tags))));

  /* ---------- 3. jeu ---------- */
  const J = P.jeu;
  $("#jeu-contenu").append(
    h("div", { class: "jeu-hero reveal" }, boucle({ ...J.trailer, titre: "Trailer" })),
    h("h3", { class: "jeu-titre" }, J.titre), h("div", { class: "jeu-ancien" }, `Anciennement « ${J.ancienNom} »`),
    h("p", { class: "accroche" }, J.accroche),
    J.pointFort ? h("div", { class: "point-fort reveal" }, h("div", { class: "pf-icone", "aria-hidden": "true" }, "🌐"),
      h("div", {}, h("b", {}, J.pointFort.titre), h("span", {}, J.pointFort.texte))) : "",
    h("div", { class: "grid2 reveal" },
      h("div", { class: "texte" }, J.description.map(txt),
        h("ul", { class: "fonctions" }, J.fonctions.map(f => h("li", {}, f))), tags(J.tags)),
      chiffres(J.chiffres)),
    h("h4", { class: "sous-titre" }, "Captures"), galerie(J.captures));

  /* ---------- 4. automatisation ---------- */
  const A = P.automatisation;
  $("#auto-contenu").append(
    h("div", { class: "projet-head reveal" }, h("h3", {}, A.titre), h("p", { class: "accroche" }, A.accroche)),
    h("div", { class: "auto reveal" },
      h("div", { class: "auto-boucle" }, boucle({ ...A.boucle, format: "vertical" })),
      h("div", {},
        h("div", { class: "texte" }, A.description.map(txt)),
        chiffres(A.chiffres), tags(A.tags))),
    h("h4", { class: "sous-titre" }, "Comment ça marche"),
    h("div", { class: "pipeline reveal" }, A.etapes.map(([b, s]) => h("div", { class: "etape" }, h("b", {}, b), h("span", {}, s)))));
  boucles.forEach(v => vio.observe(v));

  /* ---------- 5. qui je suis ---------- */
  const M = P.moi;
  const item = e => h("div", { class: "item" }, h("small", { class: isPlaceholder(e.periode.split(" ·")[0]) ? "placeholder" : null }, e.periode), h("b", {}, e.titre), h("span", {}, e.lieu), e.detail ? h("span", {}, e.detail) : null);
  const age = (() => {
    if (!id.naissance) return "";
    const n = new Date(id.naissance), d = new Date();
    return d.getFullYear() - n.getFullYear() - (d < new Date(d.getFullYear(), n.getMonth(), n.getDate()) ? 1 : 0);
  })();
  $("#moi-contenu").append(h("div", { class: "moi reveal" },
    h("div", {},
      h("div", { class: "moi-photo" }, M.photo ? h("img", { src: M.photo, alt: id.nom }) : "Photo à venir"),
      M.langues ? h("div", { class: "moi-liste" }, h("h4", {}, "Langues"), M.langues.map(l => h("div", {}, l))) : null,
      M.passions ? h("div", { class: "moi-liste" }, h("h4", {}, "Passions"), M.passions.map(l => h("div", {}, l))) : null),
    h("div", {},
      h("div", { class: "moi-texte" }, M.texte.map(s => txt(s.replace("{age}", age)))),
      tags(M.competences),
      M.methode ? h("div", { class: "methode" }, h("h4", {}, "Ma méthode avec l'IA"),
        h("div", { class: "methode-grille" }, M.methode.map(([b, s], i) => h("div", { class: "methode-etape" }, h("small", {}, `0${i + 1}`), h("b", {}, b), h("span", {}, s))))) : null,
      h("div", { class: "timeline" },
        h("div", {}, h("h4", {}, "Études"), M.etudes.map(item)),
        h("div", {}, h("h4", {}, "Expériences"), M.experiences.map(item))),
      M.cv ? h("a", { class: "bouton", href: M.cv, download: "Gabriel Lecerf - CV.pdf" }, "Télécharger mon CV")
           : h("span", { class: "bouton", "aria-disabled": "true" }, "CV : bientôt disponible"))));

  $("#footer").append(
    h("div", {}, `© ${new Date().getFullYear()} ${isPlaceholder(id.nom) ? "" : id.nom}`),
    h("div", {}, isPlaceholder(id.email) ? h("span", { class: "placeholder" }, id.email) : h("a", { href: `mailto:${id.email}` }, id.email),
      id.liens.map(l => [" · ", h("a", { href: l.url, target: "_blank", rel: "noopener" }, l.label)])));

  /* ---------- agrandissement des images ---------- */
  const lb = $("#lightbox");
  function fermer() { lb.hidden = true; document.body.style.overflow = ""; }
  function lightbox(it) { lb.querySelector("img").src = it.src; lb.querySelector("figcaption").textContent = it.legende || ""; lb.hidden = false; document.body.style.overflow = "hidden"; }
  lb.querySelector(".modal-close").addEventListener("click", fermer);
  lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lightbox-fig")) fermer(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && !lb.hidden) fermer(); });

  /* ---------- apparitions et menu actif ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vu"); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  const liens = [...document.querySelectorAll(".nav nav a")];
  const nio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) liens.forEach(a => a.classList.toggle("actif", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("section.cat").forEach(s => nio.observe(s));
})();
