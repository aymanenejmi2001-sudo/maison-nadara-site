/* ============================================================
   MAISON NADARA — v2 · interactions
   1. Outils   2. Apparitions   3. Bandeaux   4. Héros
   5. Panier   6. Grille        7. Fiche      8. Formulaires
   ============================================================ */
(() => {
  "use strict";

  /* ---------- 1. Outils ---------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = window.MN || { products: [], journal: [], fmt: n => n + " €" };
  const byId = id => D.products.find(p => p.id === id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- 1b. Devise ---------- */
  const CLE_DEVISE = "mn-devise";
  const Money = {
    code: "EUR",
    load() {
      try {
        const v = localStorage.getItem(CLE_DEVISE);
        if (v && D.devises && D.devises[v]) this.code = v;
      } catch (e) {}
    },
    def() { return (D.devises && D.devises[this.code]) || { champ: "price", suffixe: " €", franco: 90 }; },
    prix(p) { return p[this.def().champ]; },
    n(v) { return v.toLocaleString("fr-FR") + this.def().suffixe; },
    fmt(p) { return this.n(this.prix(p)); },
    franco() { return this.n(this.def().franco); },
    bascule() {
      const codes = Object.keys(D.devises || { EUR: 1 });
      this.code = codes[(codes.indexOf(this.code) + 1) % codes.length];
      try { localStorage.setItem(CLE_DEVISE, this.code); } catch (e) {}
      appliquerDevise();
    }
  };

  function appliquerDevise() {
    $$("[data-devise-lbl]").forEach(el => el.textContent = Money.def().label);
    $$("[data-prix-de]").forEach(el => {
      const p = byId(el.dataset.prixDe);
      if (p) el.textContent = Money.fmt(p);
    });
    $$("[data-economie]").forEach(el => {
      const trio = byId("coffret-trois-soleils");
      const unites = D.products.filter(x => x.family !== "Coffret");
      if (!trio || unites.length < 3) return;
      const somme = unites.slice(0, 3).reduce((n, x) => n + Money.prix(x), 0);
      el.textContent = Money.n(somme - Money.prix(trio));
    });
    $$("[data-franco]").forEach(el => el.textContent = Money.franco());
    renderGrid(); renderColl();
    if ($("[data-pdp]")) initPDP();
    Cart.render();
  }

  function initCurrency() {
    Money.load();
    $$("[data-devise]").forEach(b => b.addEventListener("click", () => Money.bascule()));
    appliquerDevise();
  }

  /* ---------- 2. Apparitions ---------- */
  const SEL = "[data-in],.wipe,.fig,.growline,.hero,.duo > a,.bars";

  function showVisible(root = document) {
    $$(SEL, root).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) el.classList.add("on");
    });
  }

  function initReveal(root = document) {
    if (!("IntersectionObserver" in window)) {
      $$(SEL, root).forEach(el => el.classList.add("on"));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("on");
        obs.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    $$(SEL, root).forEach(el => io.observe(el));
    addEventListener("load", () => setTimeout(() => showVisible(root), 350), { once: true });
  }

  /* ---------- 3. Bandeaux défilants ---------- */
  function initTickers() {
    $$(".ticker").forEach(t => {
      const track = $(".ticker__t", t);
      const first = track && track.firstElementChild;
      if (!first) return;
      const need = () => track.scrollWidth < t.clientWidth * 2 + first.offsetWidth;
      let guard = 0;
      while (need() && guard++ < 12) track.appendChild(first.cloneNode(true));
      const secs = Math.max(18, Math.round(first.offsetWidth / 42));
      track.style.setProperty("--tick", secs + "s");
      $$("span", track).forEach(s => s.style.setProperty("--tick", secs + "s"));
    });
  }

  /* ---------- 4. Héros & diaporama ---------- */
  function initHero() {
    const hero = $(".hero");
    if (!hero) return;
    requestAnimationFrame(() => hero.classList.add("on"));
    setTimeout(() => hero.classList.add("on"), 60);
    const slides = $$(".slide", hero);
    if (slides.length === 1) {
      slides[0].classList.add("on");
      const v = slides[0].querySelector("video");
      if (v) {
        playVideo(v);
        const lire = $("[data-lire]", hero);
        if (lire) {
          // certains navigateurs refusent la lecture automatique : on offre le geste
          setTimeout(() => { if (v.paused) lire.hidden = false; }, 1600);
          lire.addEventListener("click", () => { playVideo(v); });
          v.addEventListener("playing", () => { lire.hidden = true; });
        }
      }
      return;
    }
    initSlider(hero);
  }

  function playVideo(v) {
    // data-debut : secondes à sauter au début du plan (amorce sombre) — la boucle
    // repart de ce point plutôt que de zéro.
    const debut = parseFloat(v.dataset.debut) || 0;
    const cale = () => {
      if (debut && v.readyState >= 1 && v.currentTime < debut - 0.05) {
        try { v.currentTime = debut; } catch (e) {}
      }
    };
    if (debut && !v.dataset.boucle) {
      v.dataset.boucle = "1";
      v.loop = false;
      v.addEventListener("ended", () => { cale(); v.play().catch(() => {}); });
      v.addEventListener("loadeddata", cale);
    }
    const start = () => {
      cale();
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    };
    if (v.readyState >= 2) start();
    else { v.addEventListener("canplay", start, { once: true }); v.load(); }
  }

  function initSlider(hero) {
    const slides = $$(".slide", hero);
    if (slides.length < 2) return;

    const cur  = $("[data-cur]", hero);
    const tot  = $("[data-tot]", hero);
    const cap  = $("[data-capout]", hero);
    const rail = $(".hero__rail i", hero);
    const dots = $$(".hero__dots button", hero);
    const pad2 = n => String(n + 1).padStart(2, "0");
    if (tot) tot.textContent = pad2(slides.length - 1);

    let i = 0, timer = 0;

    const runRail = ms => {
      if (!rail) return;
      rail.style.transition = "none";
      rail.style.width = "0%";
      void rail.offsetWidth;                    // force le recalcul
      if (REDUCE) { rail.style.width = "100%"; return; }
      rail.style.transition = `width ${ms}ms linear`;
      rail.style.width = "100%";
    };

    const show = n => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        const on = k === i;
        s.classList.toggle("on", on);
        s.setAttribute("aria-hidden", String(!on));
        const v = s.querySelector("video");
        if (v) {
          if (on) playVideo(v);
          else v.pause();
        }
      });
      dots.forEach((d, k) => d.setAttribute("aria-current", String(k === i)));
      if (cur) cur.textContent = pad2(i);
      if (cap) cap.textContent = slides[i].dataset.cap || "";

      clearTimeout(timer);
      const ms = parseInt(slides[i].dataset.dur, 10) || 6500;
      runRail(ms);
      if (!REDUCE) timer = setTimeout(() => show(i + 1), ms);
    };

    const go = n => show(n);
    const prev = $("[data-prev]", hero), next = $("[data-next]", hero);
    if (prev) prev.addEventListener("click", () => go(i - 1));
    if (next) next.addEventListener("click", () => go(i + 1));
    dots.forEach((d, k) => d.addEventListener("click", () => go(k)));

    hero.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
    });

    // glissement tactile
    let x0 = null;
    hero.addEventListener("pointerdown", e => { x0 = e.clientX; }, { passive: true });
    hero.addEventListener("pointerup", e => {
      if (x0 === null) return;
      const dx = e.clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 48) go(i + (dx < 0 ? 1 : -1));
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clearTimeout(timer);
      else show(i);
    });

    show(0);
  }

  /* ---------- 5. Panier ---------- */
  const KEY = "mn-cart-v1";
  const Cart = {
    items: [],
    load() {
      try { this.items = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { this.items = []; }
      this.items = this.items.filter(i => byId(i.id));
    },
    persist() {
      try { localStorage.setItem(KEY, JSON.stringify(this.items)); } catch (e) {}
      this.render();
    },
    count() { return this.items.reduce((n, i) => n + i.q, 0); },
    total() { return this.items.reduce((n, i) => n + i.q * Money.prix(byId(i.id)), 0); },
    add(id, q = 1) {
      const cur = this.items.find(i => i.id === id);
      if (cur) cur.q += q; else this.items.push({ id, q });
      this.persist();
    },
    setQty(id, q) {
      const cur = this.items.find(i => i.id === id);
      if (!cur) return;
      cur.q = q;
      if (cur.q <= 0) this.items = this.items.filter(i => i.id !== id);
      this.persist();
    },
    render() {
      $$("[data-count]").forEach(b => b.textContent = this.count());
      const body = $(".drawer__body"), sum = $(".drawer__sum"), ft = $(".drawer__ft");
      if (!body) return;
      if (!this.items.length) {
        body.innerHTML =
          '<div class="drawer__empty"><p class="ui">Panier vide</p>' +
          '<p class="k60" style="margin-top:10px">Trois soleils vous attendent.</p>' +
          '<p style="margin-top:24px"><a class="btn btn--ghost" href="boutique.html">Voir la boutique</a></p></div>';
        if (ft) ft.hidden = true;
        return;
      }
      if (ft) ft.hidden = false;
      body.innerHTML = this.items.map(it => {
        const p = byId(it.id);
        return `<article class="citem">
          <div class="citem__img"><img src="${p.images.front}" alt="" loading="lazy"></div>
          <div>
            <p class="ui">${esc(p.plain)}</p>
            <p class="ui k60" style="margin-top:4px">${esc(p.volume)}</p>
            <div class="qty">
              <button type="button" data-q="-1" data-id="${p.id}" aria-label="Retirer un exemplaire">&minus;</button>
              <output>${it.q}</output>
              <button type="button" data-q="1" data-id="${p.id}" aria-label="Ajouter un exemplaire">+</button>
            </div>
            <button class="citem__rm" type="button" data-rm="${p.id}">Retirer</button>
          </div>
          <p class="ui num">${Money.n(Money.prix(p) * it.q)}</p>
        </article>`;
      }).join("");
      if (sum) sum.textContent = Money.n(this.total());
      $$("[data-q]", body).forEach(b => b.addEventListener("click", () => {
        const it = this.items.find(i => i.id === b.dataset.id);
        this.setQty(b.dataset.id, it.q + parseInt(b.dataset.q, 10));
      }));
      $$("[data-rm]", body).forEach(b => b.addEventListener("click", () => this.setQty(b.dataset.rm, 0)));
    }
  };

  function initCart() {
    Cart.load();
    Cart.render();
    const dlg = $(".drawer");
    const open = () => { if (dlg) { dlg.showModal(); document.documentElement.style.overflow = "hidden"; } };
    const close = () => { if (dlg) dlg.close(); };
    $$("[data-cart-open]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); open(); }));
    $$("[data-cart-close]").forEach(b => b.addEventListener("click", close));
    if (dlg) {
      dlg.addEventListener("click", e => { if (e.target === dlg) close(); });
      dlg.addEventListener("close", () => { document.documentElement.style.overflow = ""; });
    }
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-add]");
      if (!b) return;
      e.preventDefault();
      Cart.add(b.dataset.add, parseInt(b.dataset.qty || "1", 10) || 1);
      if (b.dataset.open === "1") open();
      else flash(b);
    });
    const co = $("[data-checkout]");
    if (co) co.addEventListener("click", () => {
      const n = $(".drawer__note");
      if (n) n.textContent = "Démonstration — le paiement n'est pas branché.";
    });
    window.MNCart = Cart;
  }

  function flash(btn) {
    if (REDUCE) return;
    const old = btn.textContent;
    btn.textContent = "Ajouté";
    setTimeout(() => { btn.textContent = old; }, 1100);
  }

  /* ---------- 6. Grille produits ---------- */
  function cardHTML(p) {
    return `<article class="card" data-family="${esc(p.family)}">
      ${p.badge ? `<span class="card__tag ui">${esc(p.badge)}</span>` : ""}
      <div class="card__media">
        <img class="a" src="${p.images.front}" alt="${esc(p.plain)}" loading="lazy">
        <img class="b" src="${p.images.alt}" alt="" loading="lazy" aria-hidden="true">
      </div>
      <a class="card__link" href="produit.html?p=${p.id}"><span class="sr-only">${esc(p.plain)}</span></a>
      <button class="card__add" type="button" data-add="${p.id}">Ajouter — ${Money.fmt(p)}</button>
      <p class="card__t ui">${esc(p.plain)}</p>
      <p class="card__p ui num">${Money.fmt(p)}</p>
    </article>`;
  }

  function renderGrid() {
    const grid = $("[data-grid]");
    if (!grid) return;
    const n = parseInt(grid.dataset.grid, 10);
    const list = isNaN(n) ? D.products : D.products.slice(0, n);
    grid.innerHTML = list.map(cardHTML).join("");
    initReveal(grid);
  }

  function initGrid() {
    const grid = $("[data-grid]");
    if (!grid) return;
    renderGrid();

    const chips = $$(".chip");
    chips.forEach(c => c.addEventListener("click", () => {
      chips.forEach(x => x.setAttribute("aria-pressed", String(x === c)));
      const f = c.dataset.filter;
      $$(".card", grid).forEach(card => {
        card.classList.toggle("is-out", f !== "*" && card.dataset.family !== f);
      });
    }));
  }

  /* ---------- 6b. Index collection ---------- */
  function renderColl() {
    const host = $("[data-coll]");
    if (!host) return;
    host.innerHTML = D.products.map((p, i) => `
      <article class="coll__row" data-img="${p.images.front}">
        <a class="coll__hit" href="produit.html?p=${p.id}"><span class="sr-only">${esc(p.plain)}</span></a>
        <span class="coll__thumb"><img src="${p.images.front}" alt="" loading="lazy"></span>
        <span class="coll__i ui">${String(i + 1).padStart(2, "0")}</span>
        <h3 class="coll__n">${esc(p.plain)}</h3>
        <p class="coll__s ui">${esc(p.sub)}</p>
        <p class="coll__p ui">${Money.fmt(p)}</p>
        <button class="coll__add" type="button" data-add="${p.id}">Ajouter</button>
      </article>`).join("");
    bindPeek(host);
  }

  // aperçu du flacon qui suit le curseur — rebranché à chaque rendu des lignes
  function bindPeek(host) {
    const peek = $(".coll__peek");
    const img = peek && peek.querySelector("img");
    if (!peek || !img || !matchMedia("(hover:hover) and (min-width:821px)").matches) return;

    let live = false;
    const move = e => {
      const w = peek.offsetWidth, h = peek.offsetHeight;
      const x = Math.min(Math.max(e.clientX + 28, 8), innerWidth - w - 8);
      const y = Math.min(Math.max(e.clientY - h / 2, 8), innerHeight - h - 8);
      peek.style.transform = `translate3d(${x}px,${y}px,0)`;
    };

    $$(".coll__row", host).forEach(r => {
      r.addEventListener("pointerenter", e => {
        const src = r.dataset.img;
        if (img.getAttribute("src") !== src) img.setAttribute("src", src);
        move(e);
        live = true;
        peek.classList.add("on");
      });
      r.addEventListener("pointermove", e => { if (live) move(e); });
      r.addEventListener("pointerleave", () => { live = false; peek.classList.remove("on"); });
    });
  }

  function initColl() { renderColl(); }

  /* ---------- 7. Fiche produit ---------- */
  function initPDP() {
    const root = $("[data-pdp]");
    if (!root) return;
    const p = byId(new URLSearchParams(location.search).get("p")) || D.products[0];
    document.title = p.plain + " — Maison Nadara";

    const set = (k, html) => { const el = $(`[data-f=${k}]`, root); if (el) el.innerHTML = html; };
    set("name", esc(p.plain));
    set("sub", esc(p.sub));
    set("family", esc(p.family));
    set("volume", esc(p.volume));
    set("price", Money.fmt(p));
    set("claim", esc(p.claim));
    set("story", esc(p.story));
    set("usage", esc(p.usage));
    set("compo", esc(p.compo));
    set("notes", Object.entries(p.pyramid).map(([k, v]) =>
      `<div><b class="ui k60">${esc(k)}</b><span>${esc(v.join(" · "))}</span></div>`).join(""));
    set("bars", Object.entries(p.sillage).map(([k, v]) =>
      `<div><span class="ui k60">${esc(k)}</span><i style="--v:${v}%"></i></div>`).join(""));

    const views = $("[data-f=views]", root);
    if (views) views.innerHTML = p.images.gallery.map((src, i) =>
      `<figure class="pdp__view"><img src="${src}" alt="${esc(p.plain)} — vue ${i + 1}" ${i ? 'loading="lazy"' : ""}></figure>`).join("");

    const add = $("[data-f=add]", root);
    if (add) { add.dataset.add = p.id; add.dataset.open = "1"; }

    const st = $("[data-qty]", root);
    if (st && add) {
      const out = $("output", st);
      out.textContent = "1";
      $$("button", st).forEach(b => b.addEventListener("click", () => {
        const v = Math.min(9, Math.max(1, parseInt(out.textContent, 10) + parseInt(b.dataset.step, 10)));
        out.textContent = v;
        add.dataset.qty = v;
      }));
    }

    const rel = $("[data-f=related]");
    if (rel) { rel.innerHTML = D.products.filter(x => x.id !== p.id).slice(0, 4).map(cardHTML).join(""); }
    initReveal(root);
    if (rel) initReveal(rel);
  }

  /* ---------- 7b. Journal ---------- */
  function initJournal() {
    const g = $("[data-journal]");
    if (!g) return;
    g.innerHTML = D.journal.map((a, i) => `
      <article data-in="${i}">
        <figure class="fig"><img src="${a.img}" alt="" loading="lazy"></figure>
        <p class="ui k60">${esc(a.d)} — ${esc(a.c)}</p>
        <h3 class="h3" style="margin-top:10px">${esc(a.t)}</h3>
        <p class="k60" style="margin-top:8px">${esc(a.x)}</p>
      </article>`).join("");
    initReveal(g);
  }

  /* ---------- 7c. Compteurs ---------- */
  function initStats() {
    const els = $$("[data-num]");
    if (!els.length || !("IntersectionObserver" in window)) {
      els.forEach(el => el.textContent = el.dataset.num + (el.dataset.suffix || ""));
      return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        const el = e.target, to = parseFloat(el.dataset.num), suf = el.dataset.suffix || "";
        if (REDUCE) { el.textContent = to + suf; return; }
        const t0 = performance.now();
        (function tick(now) {
          const t = Math.min(1, (now - t0) / 1200);
          el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3))) + suf;
          if (t < 1) requestAnimationFrame(tick);
        })(performance.now());
      });
    }, { threshold: 0.4 });
    els.forEach(el => io.observe(el));
  }

  /* ---------- 8. Formulaires ---------- */
  function initForms() {
    $$("form[data-demo]").forEach(f => f.addEventListener("submit", e => {
      e.preventDefault();
      const m = f.querySelector(".msg");
      if (m) m.textContent = f.dataset.demo;
      f.reset();
    }));
  }

  /* ---------- démarrage ---------- */
  function boot() {
    initGrid();
    initColl();
    initPDP();
    initJournal();
    initReveal();
    initTickers();
    initHero();
    initStats();
    initCart();
    initCurrency();
    initForms();
  }
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", boot);
  else boot();
})();
