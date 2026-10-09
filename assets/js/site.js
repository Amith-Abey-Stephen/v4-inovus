/* Inovus Labs — shared chrome + page behaviours */
(() => {
  const CDN = "https://cdn.inovuslabs.org";
  const D = window.INO || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const src = p => (!p ? "" : /^https?:/.test(p) ? p : CDN + encodeURI(p));
  const fmt = iso => iso ? new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Date n/a";

  /* ---------- hand-drawn icon set ---------- */
  const I = (d, vb = "0 0 48 48") => `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const icons = {
    bulb: I('<path d="M24 8c-7 0-12 5.2-12 11.6 0 4.3 2.3 7 4.4 9.2 1.5 1.6 2.4 3.4 2.4 5.6h10.4c0-2.2.9-4 2.4-5.6 2.1-2.2 4.4-4.9 4.4-9.2C36 13.2 31 8 24 8Z"/><path d="M19.5 38.5h9M20.5 42.5h7M24 34.4v-8.6l-3-3M24 25.8l3-3"/><path d="M24 2.5v2.4M8 8l1.8 1.7M40 8l-1.8 1.7M3.5 20h2.4M42.1 20h2.4"/>'),
    chip: I('<rect x="13" y="13" width="22" height="22" rx="2.5"/><rect x="19" y="19" width="10" height="10" rx="1"/><path d="M18 13V7M24 13V7M30 13V7M18 41v-6M24 41v-6M30 41v-6M13 18H7M13 24H7M13 30H7M41 18h-6M41 24h-6M41 30h-6"/>'),
    people: I('<circle cx="24" cy="15" r="5.5"/><circle cx="11" cy="19" r="4.2"/><circle cx="37" cy="19" r="4.2"/><path d="M14.5 39c0-6.3 4.2-11.5 9.5-11.5s9.5 5.2 9.5 11.5M3.8 36.5c0-5 3.2-8.6 7.2-8.6 1.5 0 2.8.4 4 1.2M44.2 36.5c0-5-3.2-8.6-7.2-8.6-1.5 0-2.8.4-4 1.2"/>'),
    rocket: I('<path d="M28.5 7.5c6.5-2 11.5-1.6 12 0 .5 1.6-.1 6.6-2 12L27 31l-10-10L28.5 7.5Z"/><circle cx="31.5" cy="16.5" r="3.4"/><path d="M17 21l-6.5-.6L5 26l8.6 2M27 31l.6 6.5L22 43l-2-8.6M13 35c-3 .5-5.5 3-6 7 4-.5 6.5-3 7-6"/>'),
    book: I('<path d="M24 12c-4.5-3.2-10.5-4-17-3v28c6.5-1 12.5-.2 17 3 4.5-3.2 10.5-4 17-3V9c-6.5-1-12.5-.2-17 3Z"/><path d="M24 12v28M11.5 16.5c2.8-.3 5.5 0 8 1M11.5 22.5c2.8-.3 5.5 0 8 1M28.5 17.5c2.5-1 5.2-1.3 8-1M28.5 23.5c2.5-1 5.2-1.3 8-1"/>'),
    mentor: I('<circle cx="17" cy="14" r="5.5"/><path d="M6 40c0-7.5 5-13 11-13 3 0 5.7 1.3 7.7 3.5"/><path d="M28 24h15v11H33l-4 4v-4h-1z"/><path d="M32 29.5h7"/>'),
    search: I('<circle cx="21" cy="21" r="12"/><path d="M30 30l11 11M15 19c.8-2.7 3-4.5 5.8-4.8"/>'),
    flask: I('<path d="M19 6h10M20.5 6v13L9.5 37.5C8 40 9.8 43 12.7 43h22.6c2.9 0 4.7-3 3.2-5.5L27.5 19V6"/><path d="M14 31h20"/><circle cx="21" cy="36" r="1.2"/><circle cx="27.5" cy="34.5" r="1.5"/>'),
    gear: I('<circle cx="24" cy="24" r="6"/><path d="M24 4.5v6M24 37.5v6M43.5 24h-6M10.5 24h-6M37.8 10.2l-4.2 4.2M14.4 33.6l-4.2 4.2M37.8 37.8l-4.2-4.2M14.4 14.4l-4.2-4.2"/><circle cx="24" cy="24" r="13"/>'),
    plane: I('<path d="M43 6L5 21.5l14 5.5M43 6l-7 35-17-14M43 6L19 27v12l6.5-7"/>'),
    handshake: I('<path d="M4 18l8-6 8 3 5-2 8 1 11 4M4 18v12l6 2 9 8c1.6 1.4 3.6.8 4-1 1.6 1.2 3.6.4 3.8-1.4 1.6.8 3.4-.2 3.4-2 1.8.2 3-1.4 2.2-3L28 23"/><path d="M44 20v11l-6 2M25 13l-7 7c-1.3 1.3-.6 3.4 1.2 3.6 2.6.3 4.8-.8 6.8-2.6"/>'),
    mega: I('<path d="M6 20v8c0 1.1.9 2 2 2h5l18 9V9L13 18H8c-1.1 0-2 .9-2 2Z"/><path d="M13 30l3 11h5l-2-9M37 17c2 1.5 3 4.5 3 7s-1 5.5-3 7M42 12c3 3 4.5 7.5 4.5 12S45 33 42 36"/>'),
    camera: I('<path d="M6 15h8l3-5h14l3 5h8v24H6z"/><circle cx="24" cy="26" r="7.5"/><path d="M37 20h1"/>'),
    mail: I('<rect x="5" y="10" width="38" height="28" rx="2"/><path d="M5.5 11l18.5 15 18.5-15"/>'),
    pin: I('<path d="M24 43s14-12.5 14-24a14 14 0 1 0-28 0c0 11.5 14 24 14 24Z"/><circle cx="24" cy="19" r="5"/>'),
    phone: I('<path d="M10 6h7l3 9-4.5 3a24 24 0 0 0 14.5 14.5L33 28l9 3v7c0 2.2-1.8 4-4 4C21.4 42 6 26.6 6 10c0-2.2 1.8-4 4-4Z"/>'),
    box: I('<path d="M6 15l18-8 18 8v19l-18 8-18-8z"/><path d="M6 15l18 8 18-8M24 23v19M15 11l18 8"/>'),
    star: I('<path d="M24 5l5.6 12 13 1.5-9.7 8.8 2.7 12.9L24 33.6l-11.6 6.6 2.7-12.9-9.7-8.8 13-1.5z"/>'),
    heart: I('<path d="M24 40S6 29.5 6 17.5C6 12 10 8 15 8c4 0 7 2.5 9 6 2-3.5 5-6 9-6 5 0 9 4 9 9.5C42 29.5 24 40 24 40Z"/>'),
    leaf: I('<path d="M9 39C9 20 20 9 41 7c-1 21-12 32-30 32"/><path d="M9 39c6-9 13-16 22-22"/>'),
    chev: '<svg viewBox="0 0 12 8" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M1 1.5l5 5 5-5"/></svg>',
    arrowL: I('<path d="M30 10L16 24l14 14"/>'),
    arrowR: I('<path d="M18 10l14 14-14 14"/>'),
    close: I('<path d="M12 12l24 24M36 12L12 36"/>'),
    menu: I('<path d="M7 14c11-1 23-1 34 0M7 24c11 .8 23 .8 34 0M7 34c11-1 23-1 34 0"/>'),
  };
  const social = {
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3zM9.5 9.75h3.8v1.6c.55-1 1.9-1.95 3.9-1.95 4 0 4.8 2.5 4.8 5.8V21h-4v-5.1c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V21h-4z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 7.5a3 3 0 0 0-2.1-2.1C18 5 12 5 12 5s-6 0-7.9.4A3 3 0 0 0 2 7.5 31 31 0 0 0 1.6 12 31 31 0 0 0 2 16.5a3 3 0 0 0 2.1 2.1C6 19 12 19 12 19s6 0 7.9-.4a3 3 0 0 0 2.1-2.1c.4-1.5.4-4.5.4-4.5s0-3-.4-4.5ZM10 15V9l5.2 3z"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>',
  };
  window.INO_ICONS = icons;

  const logoSvg = `<svg viewBox="0 0 40 46" fill="none" stroke="#16171b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11c-6.2 0-10.5 4.6-10.5 10.2 0 3.8 2 6.2 3.9 8.1 1.3 1.4 2.1 3 2.1 4.9h9c0-1.9.8-3.5 2.1-4.9 1.9-1.9 3.9-4.3 3.9-8.1C30.5 15.6 26.2 11 20 11Z"/><path d="M16 38h8M17 42h6M20 34v-7l-2.6-2.6M20 27l2.6-2.6"/><path d="M20 2.5v3.5M6 7.5l2.4 2.3M34 7.5l-2.4 2.3M1.5 19h3M35.5 19h3" stroke="#2c40a8"/></svg>`;

  /* ---------- navigation map ---------- */
  const NAV = [
    { label: "Explore", items: [
      ["projects.html", "Builds", "Student projects & prototypes", "chip"],
      ["products.html", "Products", "Tools made here, used anywhere", "box"],
      ["iot-lab.html", "Mini IoT Lab", "Boards, sensors, a workbench", "bulb"],
      ["nanodegree.html", "Nanodegrees", "Short, hands-on learning paths", "book"],
      ["resources.html", "Resources", "Hand-picked learning links", "search"],
    ]},
    { label: "Community", items: [
      ["team.html", "People", "Team, mentors & alumni", "people"],
      ["events.html", "Events", "Workshops, hackathons, meetups", "rocket"],
      ["recurring-events.html", "Series", "Weekend Workbench & more", "gear"],
      ["outreach.html", "Outreach", "Workshops beyond campus", "handshake"],
      ["guidelines.html", "Guidelines", "How we work together", "star"],
    ]},
    { label: "Media", items: [
      ["gallery.html", "Gallery", "Moments from the lab", "camera"],
      ["blog.html", "Lab Log", "Stories by students", "book"],
      ["inora.html", "InoRa Radio", "Our podcast", "mega"],
      ["news.html", "In the news", "Press coverage", "mail"],
      ["socials.html", "Socials", "Where to follow us", "heart"],
    ]},
    { label: "About", items: [
      ["about.html", "Our story", "Why we exist", "bulb"],
      ["atom-ev.html", "Atom EV", "Our flagship build", "rocket"],
      ["reports.html", "Reports", "Our work, on record", "book"],
      ["join.html", "Join Inovus", "Find your way in", "star"],
      ["contact.html", "Contact", "Say hello or plan a visit", "mail"],
    ]},
  ];
  const here = location.pathname.split("/").pop() || "index.html";

  function header() {
    const el = $("[data-header]");
    if (!el) return;
    el.className = "site-header";
    el.innerHTML = `<div class="wrap">
      <a class="logo" href="index.html" aria-label="Inovus Labs home">${logoSvg}<span>Inovus Labs</span></a>
      <nav class="nav" id="nav" aria-label="Main">
        ${NAV.map((g, i) => {
          const active = g.items.some(it => it[0] === here);
          return `<div class="nav-item">
            <button class="nav-btn" aria-expanded="false" aria-controls="dd${i}" ${active ? 'aria-current="true"' : ""}>${g.label}${icons.chev}</button>
            <div class="dropdown" id="dd${i}">
              ${g.items.map(([h, t, s, ic]) => `<a href="${h}" ${h === here ? 'aria-current="page"' : ""} ${h.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${icons[ic]}<b>${t}</b><small>${s}</small></a>`).join("")}
            </div></div>`;
        }).join("")}
        <a class="btn btn-stamp mobile-join" href="join.html">Join Inovus</a>
      </nav>
      <div class="header-aside">
        <a class="note-pill" href="contact.html"><i></i>Lab visits by arrangement</a>
        <a class="btn btn-stamp" href="join.html">Join Inovus</a>
      </div>
      <button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="nav">${icons.menu}</button>
    </div>`;

    const items = $$(".nav-item", el);
    const closeAll = except => items.forEach(it => { if (it !== except) { it.classList.remove("open"); $(".nav-btn", it).setAttribute("aria-expanded", "false"); } });
    items.forEach(it => {
      const b = $(".nav-btn", it);
      b.addEventListener("click", e => {
        e.stopPropagation();
        const open = !it.classList.contains("open");
        closeAll(it);
        it.classList.toggle("open", open);
        b.setAttribute("aria-expanded", open);
      });
      if (matchMedia("(hover:hover) and (min-width: 901px)").matches) {
        let t;
        it.addEventListener("mouseenter", () => { clearTimeout(t); closeAll(it); it.classList.add("open"); b.setAttribute("aria-expanded", "true"); });
        it.addEventListener("mouseleave", () => { t = setTimeout(() => { it.classList.remove("open"); b.setAttribute("aria-expanded", "false"); }, 180); });
      }
    });
    document.addEventListener("click", e => { if (!el.contains(e.target)) closeAll(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") { closeAll(); el.classList.remove("menu-open"); } });
    const mb = $(".menu-btn", el);
    mb.addEventListener("click", () => {
      const o = el.classList.toggle("menu-open");
      mb.setAttribute("aria-expanded", o);
      mb.setAttribute("aria-label", o ? "Close menu" : "Open menu");
      mb.innerHTML = o ? icons.close : icons.menu;
    });
  }

  function footer() {
    const el = $("[data-footer]");
    if (!el) return;
    el.className = "site-footer sheet sheet-kraft no-bottom";
    const col = (h, links) => `<div><h4>${h}</h4><ul>${links.map(([u, t]) => `<li><a href="${u}" ${u.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${t}</a></li>`).join("")}</ul></div>`;
    el.innerHTML = `<div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="logo" href="index.html">${logoSvg}<span>Inovus Labs</span></a>
          <p class="hand hand-md mt-4" style="max-width:16ch">Ideas today.<br>A brighter tomorrow.</p>
        </div>
        ${col("Explore", [["projects.html", "Builds"], ["products.html", "Products"], ["iot-lab.html", "IoT Lab"], ["nanodegree.html", "Nanodegrees"], ["resources.html", "Resources"]])}
        ${col("Community", [["team.html", "People"], ["events.html", "Events"], ["outreach.html", "Outreach"], ["guidelines.html", "Guidelines"], ["join.html", "Join"]])}
        ${col("Media", [["gallery.html", "Gallery"], ["blog.html", "Lab Log"], ["inora.html", "InoRa Radio"], ["news.html", "News"], ["reports.html", "Reports"]])}
        ${col("Reach us", [["mailto:info@inovuslabs.org", "info@inovuslabs.org"], ["tel:+919400057152", "+91 94000 57152"], ["contact.html", "Visit the lab"], ["status.html", "Service status"]])}
        <div><h4>Follow</h4>
          <div class="socials">
            <a href="https://www.instagram.com/inovuslabs/" target="_blank" rel="noopener" aria-label="Instagram">${social.instagram}</a>
            <a href="https://www.linkedin.com/company/inovus-labs-iedc/" target="_blank" rel="noopener" aria-label="LinkedIn">${social.linkedin}</a>
            <a href="https://www.youtube.com/@inovuslabs_official" target="_blank" rel="noopener" aria-label="YouTube">${social.youtube}</a>
            <a href="https://github.com/inovus-labs" target="_blank" rel="noopener" aria-label="GitHub">${social.github}</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom"><span>© ${new Date().getFullYear()} Inovus Labs IEDC · Kristu Jyoti College of Management & Technology, Kerala</span><span class="hand" style="font-size:1.2rem">keep building :)</span></div>
    </div>`;
  }

  /* ---------- reveal on scroll ---------- */
  function reveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) return els.forEach(e => e.classList.add("in"));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach(e => io.observe(e));
  }

  /* ---------- shared renderers ---------- */
  const img = (p, alt, cls = "", ph = "photo coming soon") => p
    ? `<img class="${cls}" src="${src(p)}" alt="${esc(alt)}" loading="lazy" decoding="async" onerror="this.outerHTML='<div class=&quot;ph ${cls}&quot;>${esc(ph)}</div>'">`
    : `<div class="ph ${cls}">${esc(ph)}</div>`;
  const initials = n => n.split(/\s+/).filter(w => w.length > 1).map(w => w[0]).slice(0, 2).join("");
  // Several project records on the live site reuse the InoMail image as a stand-in.
  const projImg = p => (/Ino-mail/.test(p.img) && p.t !== "InoMail") ? "" : p.img;
  const statusBadge = s => s === "Completed" ? `<span class="badge done">Completed</span>` : `<span class="badge wip">In progress</span>`;

  const buildCard = p => `<a class="build" href="${p.id === "atom-ev" ? "atom-ev.html" : "project.html?id=" + p.id}">
      <div class="polaroid tape ${["", "t-pink", "t-yellow", "t-green"][p.t.length % 4]}">${img(projImg(p), p.t)}</div>
      <div class="build-meta">
        <div class="row">${statusBadge(p.status)}<span class="tags">${esc(p.tags.join(" · "))}</span></div>
        <h3>${esc(p.t)}</h3>
        <p>${esc(p.desc)}</p>
      </div></a>`;

  const eventCard = e => `<a class="event" href="event.html?id=${e.id}">
      ${img(e.img, e.t)}
      <div class="event-body">
        <div class="row"><time datetime="${e.d}">${fmt(e.d)}</time><span class="badge done">Completed</span></div>
        <h3>${esc(e.t)}</h3>
        <p>${esc(e.desc)}</p>
      </div></a>`;

  const personCard = t => `<article class="person" data-ini="${esc(initials(t.name))}">
      <div class="polaroid">${img(t.img, t.name, "", initials(t.name))}</div>
      <h3>${esc(t.name)}</h3><p>${esc(t.role)}</p></article>`;

  /* ---------- page: home ---------- */
  function home() {
    const ev = D.events || [];
    const h = $("#happening");
    if (h && ev.length) {
      const [a, b, ...rest] = ev;
      h.innerHTML = `
        <a class="index-card tape t-corner" href="events.html" style="text-decoration:none">
          <span class="badge done">Completed</span>
          <span class="card-title">${esc(a.t.replace(/–.*$/, "").trim())}</span>
          <span class="muted" style="font-size:.95rem">${esc(a.t.split("–")[1] || "")}</span>
          <span class="date-tag">${fmt(a.d)}</span>
        </a>
        <a class="sticky tape t-pink" href="events.html" style="text-decoration:none;--r:2deg">
          <span class="badge done">Completed</span>
          <span class="card-title">${esc(b.t)}</span>
          <span class="hand hand-md" style="color:var(--ink)">${fmt(b.d)}</span>
        </a>
        ${rest.slice(0, 3).map((e, i) => `<a class="polaroid tape ${["t-green", "t-yellow", ""][i]} ${i === 2 ? "hide-md" : ""}" href="events.html">${img(e.img, e.t)}<figcaption>${esc(e.t.split(/[–:]/)[0])}<br><small class="muted" style="font-size:1rem">${fmt(e.d)}</small></figcaption></a>`).join("")}`;
    }
    const fb = $("#featured-builds");
    if (fb) fb.innerHTML = ["Atom EV", "Smart Inovus", "Open PC"].map(n => (D.projects || []).find(p => p.t === n)).filter(Boolean).map(buildCard).join("");
    const pp = $("#people-strip");
    if (pp) pp.innerHTML = (D.team || []).slice(0, 4).map(personCard).join("");
  }

  /* ---------- page: projects ---------- */
  function projects() {
    const grid = $("#builds"); if (!grid) return;
    const all = D.projects || [];
    const cats = ["All", "Software", "Hardware", "Electronics", "Internet of Things", "Open-source", "Mechanical"];
    const st = { cat: "All", status: "all", q: "" };
    $("#cats").innerHTML = cats.map(c => `<button class="chip" aria-pressed="${c === "All"}" data-cat="${c}">${c === "Internet of Things" ? "IoT" : c}</button>`).join("");
    const draw = () => {
      const q = st.q.toLowerCase();
      const list = all.filter(p => (st.cat === "All" || p.tags.includes(st.cat)) && (st.status === "all" || p.status === st.status) && (!q || (p.t + " " + p.desc).toLowerCase().includes(q)));
      $("#count").textContent = `${list.length} build${list.length === 1 ? "" : "s"}`;
      grid.innerHTML = list.length ? list.map(buildCard).join("") : "";
      $("#empty").hidden = !!list.length;
    };
    $("#cats").addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if (!b) return; st.cat = b.dataset.cat; $$("#cats .chip").forEach(c => c.setAttribute("aria-pressed", c === b)); draw(); });
    $("#status").addEventListener("change", e => { st.status = e.target.value; draw(); });
    $("#q").addEventListener("input", e => { st.q = e.target.value; draw(); });
    $("#reset").addEventListener("click", () => { st.cat = "All"; st.status = "all"; st.q = ""; $("#q").value = ""; $("#status").value = "all"; $$("#cats .chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.cat === "All")); draw(); });
    draw();
  }

  /* ---------- page: events ---------- */
  function events() {
    const grid = $("#events"); if (!grid) return;
    const all = (D.events || []).filter(e => e.d);
    const years = [...new Set(all.map(e => e.d.slice(0, 4)))];
    $("#year").innerHTML = `<option value="all">All years</option>` + years.map(y => `<option>${y}</option>`).join("");
    const PAGE = 12; let shown = PAGE; const st = { y: "all", q: "" };
    const tab = (which) => {
      $$("[data-tab]").forEach(t => t.setAttribute("aria-selected", t.dataset.tab === which));
      $("#upcoming").hidden = which !== "upcoming";
      $("#past").hidden = which !== "past";
    };
    $$("[data-tab]").forEach(t => t.addEventListener("click", () => tab(t.dataset.tab)));
    const draw = () => {
      const q = st.q.toLowerCase();
      const list = all.filter(e => (st.y === "all" || e.d.startsWith(st.y)) && (!q || (e.t + " " + e.tags.join(" ")).toLowerCase().includes(q)));
      $("#count").textContent = `${list.length} event${list.length === 1 ? "" : "s"}`;
      grid.innerHTML = list.slice(0, shown).map(eventCard).join("");
      $("#more").hidden = list.length <= shown;
      $("#empty").hidden = !!list.length;
    };
    $("#year").addEventListener("change", e => { st.y = e.target.value; shown = PAGE; draw(); });
    $("#q").addEventListener("input", e => { st.q = e.target.value; shown = PAGE; draw(); });
    $("#more").addEventListener("click", () => { shown += PAGE; draw(); });
    $("#reset").addEventListener("click", () => { st.y = "all"; st.q = ""; $("#q").value = ""; $("#year").value = "all"; draw(); });
    tab("past"); draw();
  }

  /* ---------- page: team ---------- */
  function team() {
    const grid = $("#team-grid"); if (!grid) return;
    const sets = { "2026": { label: "2026 · 9th generation", list: D.team || [] }, "2025": { label: "2025 · 8th generation", list: D.team2025 || [] }, "2024": { label: "2024 · 7th generation", list: D.team2024 || [] } };
    const draw = () => {
      const y = new URLSearchParams(location.search).get("year") || "2026";
      const s = sets[y];
      $("#year").value = y;
      $("#gen-title").textContent = s ? s.label : `${y} archive`;
      grid.innerHTML = s && s.list.length ? s.list.map(personCard).join("") : "";
      $("#archive-empty").hidden = !!(s && s.list.length);
    };
    $("#year").addEventListener("change", e => { const u = new URL(location); u.searchParams.set("year", e.target.value); history.replaceState(null, "", u); draw(); });
    $("#mentor-list").innerHTML = (D.mentors || []).map(m => `<li class="mentor">${m.img ? `<img src="${src(m.img)}" alt="" loading="lazy">` : `<span class="ini">${m.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</span>`}<b>${esc(m.name)}</b></li>`).join("");
    draw();
  }

  /* ---------- page: gallery ---------- */
  function gallery() {
    const grid = $("#masonry"); if (!grid) return;
    const moments = (D.gallery || []).map(g => ({ t: g.t || "A day at Inovus", img: g.img, d: "" }));
    const events = (D.events || []).filter(e => e.img).map(e => ({ t: e.t, img: e.img, d: e.d }));
    const albums = { "Moments": moments, "Event posters": events };
    $("#years").innerHTML = Object.keys(albums).map((y, i) => `<button class="chip" aria-pressed="${!i}" data-y="${y}">${y} <span class="muted" style="margin-left:.35rem;font-size:.8rem">${albums[y].length}</span></button>`).join("");
    let list = moments, shown = 18, cur = 0;
    const draw = () => {
      grid.innerHTML = list.slice(0, shown).map((e, i) => `<button class="polaroid shot" data-i="${i}" aria-label="Open photo: ${esc(e.t)}"><img src="${src(e.img)}" alt="${esc(e.t)}" loading="lazy" onerror="this.closest('.shot').remove()"><figcaption>${esc(e.t.split(/[–:]/)[0])}</figcaption></button>`).join("");
      $("#more").hidden = list.length <= shown;
    };
    $("#years").addEventListener("click", e => { const b = e.target.closest("[data-y]"); if (!b) return; $$("#years .chip").forEach(c => c.setAttribute("aria-pressed", c === b)); list = albums[b.dataset.y]; shown = 18; draw(); });
    $("#more").addEventListener("click", () => { shown += 18; draw(); });

    const lb = $("#lightbox"), lbImg = $("img", lb), lbT = $("b", lb), lbD = $("time", lb);
    let opener;
    const show = i => { cur = (i + list.length) % list.length; const e = list[cur]; lbImg.src = src(e.img); lbImg.alt = e.t; lbT.textContent = e.t; lbD.textContent = e.d ? fmt(e.d) : ""; };
    const open = i => { opener = document.activeElement; show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; $(".lb-close", lb).focus(); };
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; opener && opener.focus(); };
    grid.addEventListener("click", e => { const s = e.target.closest(".shot"); if (s) open(+s.dataset.i); });
    $(".lb-close", lb).addEventListener("click", close);
    $(".lb-prev", lb).addEventListener("click", () => show(cur - 1));
    $(".lb-next", lb).addEventListener("click", () => show(cur + 1));
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
      if (e.key === "Tab") { const f = $$("button", lb); const i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
    });
    draw();
  }

  /* ---------- page: products ---------- */
  function products() {
    const wrap = $("#products"); if (!wrap) return;
    const dev = ["inomail", "certificate"];
    wrap.innerHTML = (D.products || []).map(p => {
      const live = !dev.includes(p.id);
      return `<article class="product reveal">
        <div class="product-shot tape ${live ? "" : "t-yellow"}"><div class="bar"><i></i><i></i><i></i></div>${img(p.img, p.name + " screenshot")}</div>
        <div>
          ${live ? `<span class="badge live">Live</span>` : `<span class="badge soon">In development</span>`}
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.tagline)}.</p>
          <div class="hero-actions">${live
            ? `<a class="btn btn-ink" href="${p.url}" target="_blank" rel="noopener">Visit ${esc(p.name)} <span class="arr">→</span></a>`
            : `<a class="link" href="contact.html">Ask about it →</a>`}</div>
        </div></article>`;
    }).join("");
  }

  /* ---------- page: contact ---------- */
  function contact() {
    const f = $("#enquiry"); if (!f) return;
    $$(".purpose .chip").forEach(c => c.addEventListener("click", () => {
      $$(".purpose .chip").forEach(x => x.setAttribute("aria-pressed", x === c));
      f.subject.value = c.textContent.trim();
    }));
    const p = new URLSearchParams(location.search).get("topic");
    if (p) { const c = $$(".purpose .chip").find(x => x.textContent.trim().toLowerCase() === p.toLowerCase()); c && c.click(); }
    const rules = {
      name: v => v.trim().length > 1 || "Tell us your name.",
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "That email doesn't look right.",
      message: v => v.trim().length > 9 || "A few more words, please (10+ characters).",
    };
    const check = el => {
      const r = rules[el.name]; if (!r) return true;
      const res = r(el.value), fld = el.closest(".field");
      fld.classList.toggle("invalid", res !== true);
      el.setAttribute("aria-invalid", res !== true);
      $(".err", fld).textContent = res === true ? "" : res;
      return res === true;
    };
    $$("input, textarea", f).forEach(el => el.addEventListener("blur", () => check(el)));
    f.addEventListener("submit", e => {
      e.preventDefault();
      const bad = $$("input, textarea", f).filter(el => !check(el));
      const out = $("#form-status");
      if (bad.length) { out.textContent = `Fix ${bad.length} field${bad.length > 1 ? "s" : ""} above.`; bad[0].focus(); return; }
      const body = `${f.message.value}\n\n— ${f.name.value} (${f.email.value})`;
      location.href = `mailto:info@inovuslabs.org?subject=${encodeURIComponent("[" + (f.subject.value || "General") + "] Enquiry from " + f.name.value)}&body=${encodeURIComponent(body)}`;
      out.textContent = "Opening your email app. Hit send there and we'll reply.";
    });
  }

  window.INO_UI = { $, $$, esc, src, fmt, img, initials, buildCard, eventCard, personCard, statusBadge, icons, reveal };

  header(); footer();
  ({ home, projects, events, team, gallery, products, contact }[document.body.dataset.page] || (() => {}))();
  reveal();
})();
