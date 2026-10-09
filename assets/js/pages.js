/* Inovus Labs — renderers for the extended pages (loaded after site.js) */
(() => {
  const D = window.INO || {};
  const { $, $$, esc, src, fmt, img, buildCard, eventCard, personCard, statusBadge, icons, reveal } = window.INO_UI;
  const page = document.body.dataset.page;
  const qs = k => new URLSearchParams(location.search).get(k);
  const ext = 'target="_blank" rel="noopener"';
  const year = d => (d || "").slice(0, 4);
  const range = (a, b) => b && b !== a ? `${fmt(a)} – ${fmt(b)}` : fmt(a);

  /* click-to-load embeds: nothing third-party loads until the visitor asks */
  function embedCard({ label, href, embed, height = 420, note = "Loads content from " }) {
    return `<div class="embed">
      <div class="slot" style="min-height:${height}px" data-embed="${esc(embed)}">
        <div><p class="hand hand-md">${esc(label)}</p>
        <p class="muted mt-2" style="font-size:.85rem">${note}${esc(new URL(embed).hostname.replace("www.", ""))}.</p>
        <button class="btn btn-ink btn-sm mt-4" type="button">Load preview</button></div>
      </div>
      <div class="src"><span>Source: <b>${esc(new URL(href).hostname.replace("www.", ""))}</b></span><a class="link" style="font-size:1.15rem" href="${esc(href)}" ${ext}>Open on platform ↗</a></div>
    </div>`;
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-embed] button"); if (!b) return;
    const slot = b.closest("[data-embed]");
    slot.innerHTML = `<p class="hand hand-md">Loading…</p>`;
    const f = document.createElement("iframe");
    f.src = slot.dataset.embed; f.loading = "lazy"; f.title = "Embedded post";
    f.allow = "encrypted-media; picture-in-picture"; f.referrerPolicy = "strict-origin-when-cross-origin";
    f.onload = () => slot.querySelector("p") && slot.querySelector("p").remove();
    slot.appendChild(f);
  });

  const social = {
    Instagram: ["https://www.instagram.com/inovuslabs/", "@inovuslabs", "camera"],
    LinkedIn: ["https://www.linkedin.com/company/inovus-labs-iedc/", "Inovus Labs IEDC", "people"],
    YouTube: ["https://www.youtube.com/@inovuslabs_official", "@inovuslabs_official", "mega"],
    Threads: ["https://www.threads.net/@inovuslabs", "@inovuslabs", "book"],
    X: ["https://twitter.com/inovuslabs", "@inovuslabs", "plane"],
    GitHub: ["https://github.com/inovus-labs", "inovus-labs", "chip"],
    WhatsApp: ["https://www.whatsapp.com/channel/0029VaC8Xz27oQhXmjqNUV3T", "Channel", "phone"],
  };

  const R = {
    /* ---------- Socials ---------- */
    socials() {
      $("#channels").innerHTML = Object.entries(social).map(([n, [u, h, ic]]) =>
        `<a class="channel" href="${u}" ${ext}><span class="ic">${icons[ic]}</span><span><b>${n}</b><small>${esc(h)}</small></span></a>`).join("");
      const S = D.socials || {};
      const toEmbed = {
        instagram: u => u.split("?")[0].replace(/\/$/, "") + "/embed",
        linkedin: u => u,
        youtube: u => u,
        twitter: u => "https://platform.twitter.com/embed/Tweet.html?id=" + (u.match(/status\/(\d+)/) || [])[1],
        threads: u => u.split("?")[0].replace(/\/$/, "") + "/embed",
      };
      const toHref = {
        linkedin: u => "https://www.linkedin.com/feed/update/" + (u.match(/urn:li:[a-z]+:\d+/) || [""])[0],
        youtube: u => u.replace("/embed/", "/watch?v=").split("?si")[0].replace(/\?.*$/, m => m.startsWith("?v=") ? m : ""),
      };
      const names = { instagram: "Instagram", linkedin: "LinkedIn", youtube: "YouTube", twitter: "X", threads: "Threads" };
      // one preview per platform: a calm digest, not a wall of embeds
      $("#feed").innerHTML = `<div class="grid g-3">${Object.keys(names).filter(k => (S[k] || []).length).map(k => {
        const u = S[k][0].url.replace(/&amp;/g, "&");
        const href = (toHref[k] || (x => x.split("?")[0]))(u);
        return `<div><h3 style="font-size:1.25rem;margin-bottom:.9rem">${names[k]}</h3>${embedCard({ label: `Latest on ${names[k]}`, href: href.startsWith("http") ? href : social[names[k]][0], embed: toEmbed[k](u), height: k === "youtube" ? 220 : 380 })}</div>`;
      }).join("")}</div>`;
    },

    /* ---------- News ---------- */
    news() {
      const yt = u => u.includes("youtube.com/embed/") ? "https://www.youtube.com/watch?v=" + u.split("/embed/")[1].split("?")[0] : src(u);
      $("#coverage").innerHTML = (D.news || []).map(n => `<li>
        <span class="when">${fmt(n.d)}</span>
        <div><h3>${esc(n.source)}</h3><p class="sub">${esc([n.type, n.edition].filter(Boolean).join(" · "))} · Atom EV launch</p></div>
        <div class="act"><span class="tag">${n.type === "YouTube" ? "Video" : n.type === "Newsletter" ? "Newsletter" : "Clipping"}</span>
          <a class="btn btn-ink btn-sm" href="${yt(n.url)}" ${ext}>${n.type === "YouTube" ? "Watch" : "View"} ↗</a></div></li>`).join("");
    },

    /* ---------- Reports ---------- */
    reports() {
      const seen = {}; (D.reports || []).forEach(r => seen[r.url] = (seen[r.url] || 0) + 1);
      const uniq = []; const keys = new Set();
      (D.reports || []).forEach(r => { const k = r.t + r.period; if (!keys.has(k)) { keys.add(k); uniq.push(r); } });
      const type = r => /monthly/i.test(r.t) ? "Monthly" : "Activity";
      const draw = f => {
        const list = uniq.filter(r => f === "All" || type(r) === f);
        $("#reports").innerHTML = list.map(r => {
          const ok = seen[r.url] === 1;
          return `<li>
            <span class="when">${esc(r.period.replace(/January |December |October /g, m => m.slice(0, 3) + " "))}</span>
            <div><h3>${esc(r.t)}</h3><div class="meta"><span class="tag">${type(r)} report</span><span class="tag">${r.url.includes("docs.google") ? "Google Doc" : "Drive file"}</span></div></div>
            <div class="act">${ok
              ? `<a class="btn btn-ink btn-sm" href="${r.url}" ${ext}>Open document ↗</a>`
              : `<span class="muted" style="font-size:.85rem">Link under review</span><a class="link" style="font-size:1.15rem" href="contact.html?topic=General">Request it →</a>`}</div></li>`;
        }).join("");
      };
      $("#rtype").addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; $$("#rtype .chip").forEach(c => c.setAttribute("aria-pressed", c === b)); draw(b.dataset.f); });
      draw("All");
    },

    /* ---------- Mini IoT Lab ---------- */
    iotlab() {
      const comps = [
        ["Boards", "chip", "Arduino Uno", "The classic first board."], ["Boards", "chip", "Arduino Nano / Mega", "Small builds and big pin counts."],
        ["Boards", "chip", "ESP32 / ESP8266", "Wi-Fi + Bluetooth for IoT."], ["Boards", "chip", "Raspberry Pi", "A tiny Linux computer."],
        ["Sensors", "search", "Ultrasonic sensor", "Measure distance."], ["Sensors", "search", "Temperature & humidity", "Read the room."],
        ["Sensors", "search", "PIR motion sensor", "Detect movement."], ["Sensors", "search", "Gas sensor", "Sniff out leaks."],
        ["Sensors", "search", "IR & LDR", "Remotes and light levels."], ["Actuators", "gear", "Servo & DC motors", "Make things move."],
        ["Actuators", "gear", "Relay modules", "Switch real appliances."], ["Actuators", "gear", "LCD & LED displays", "Show what’s happening."],
      ];
      const draw = () => {
        const q = $("#q").value.toLowerCase(), c = $("#ccat").value;
        const list = comps.filter(x => (c === "All" || x[0] === c) && (!q || (x[2] + x[3]).toLowerCase().includes(q)));
        $("#comps").innerHTML = list.map(([cat, ic, t, d]) => `<div class="comp">${icons[ic]}<span class="tag">${cat}</span><h3>${t}</h3><p>${d}</p></div>`).join("");
        $("#cempty").hidden = !!list.length;
      };
      $("#q").addEventListener("input", draw); $("#ccat").addEventListener("change", draw); draw();
      $("#labshots").innerHTML = (D.iotGallery || []).slice(0, 8).map((p, i) => `<figure class="polaroid ${i % 3 ? "" : "tape t-yellow"}" style="--r:${[-1.5, 1, -.5, 1.4][i % 4]}deg;margin:0"><img src="${src(p)}" alt="Inside the Mini IoT Lab" loading="lazy"></figure>`).join("");
    },

    /* ---------- Nanodegrees ---------- */
    nanodegree() {
      const [f, ...rest] = D.courses || [];
      $("#upcoming-courses").innerHTML = rest.map(c => `<li>
        <span class="when">${esc(c.level)}</span>
        <div><h3>${esc(c.t)}</h3><p class="sub">${esc(c.desc.split(". ")[0])}.</p></div>
        <div class="act"><span class="badge soon">In development</span></div></li>`).join("");
      $("#mods").innerHTML = (f.syllabus || []).map(m => `<li>${esc(m.title)}</li>`).join("");
    },

    /* ---------- Course detail ---------- */
    course() {
      const c = (D.courses || [])[0];
      const watch = u => "https://www.youtube.com/watch?v=" + u.split("/embed/")[1].split("?")[0];
      $("#rail-list").innerHTML = c.syllabus.map((m, i) => `<li><a href="#m${i + 1}">${i + 1}. ${esc(m.title.replace(/^Introduction to (the )?/i, ""))}</a></li>`).join("");
      $("#modules").innerHTML = c.syllabus.map((m, i) => `<details id="m${i + 1}" ${i === 4 ? "open" : ""}>
        <summary><span class="n">${i + 1}</span><h3>${esc(m.title)}</h3></summary>
        <div class="body">
          <ul>${[...new Set(m.lessons)].map(l => `<li>${esc(l)}</li>`).join("")}</ul>
          ${(m.tasks || []).length ? `<p class="hand hand-md mt-6">Try it:</p><ul class="checklist hand" style="font-size:1.3rem;display:grid;gap:.2rem;margin-top:.4rem;padding:0">${m.tasks.map(t => `<li>${esc(t.title)}</li>`).join("")}</ul>` : ""}
          ${(m.resources || []).length ? `<div class="meta mt-4" style="display:flex;gap:.6rem;flex-wrap:wrap">${m.resources.map((r, j) => `<a class="btn btn-ink btn-sm" href="${watch(r)}" ${ext}>▶ Video ${j + 1} ↗</a>`).join("")}</div>` : ""}
        </div></details>`).join("");
      const tasks = c.syllabus.flatMap(m => m.tasks || []);
      $("#tasks").innerHTML = tasks.map(t => `<li class="${""}">${esc(t.title)}</li>`).join("");
      $("#expand").addEventListener("click", e => { const open = e.target.dataset.open !== "1"; $$("#modules details").forEach(d => d.open = open); e.target.dataset.open = open ? "1" : "0"; e.target.textContent = open ? "Collapse all" : "Expand all"; });
    },

    /* ---------- InoRa ---------- */
    inora() {
      const I = D.inora || {};
      $("#show").innerHTML = embedCard({ label: "InoRa Radio on Spotify", href: `https://open.spotify.com/show/${I.show}`, embed: `https://open.spotify.com/embed/show/${I.show}`, height: 352 });
      // Episode titles aren't stored on our site, so episodes load straight from Spotify on request.
      const eps = I.episodes || [];
      $("#episodes").innerHTML = `<div class="index-card" style="--r:-.8deg">
          <p class="card-title">${eps.length} episodes</p>
          <p class="mt-2" style="color:var(--ink-2)">Titles and running times come from Spotify.</p>
          <button class="btn btn-ink btn-sm mt-4" id="load-eps" type="button">Load episode players</button>
        </div><div id="ep-list" style="display:grid;gap:.8rem;margin-top:1.4rem"></div>`;
      $("#load-eps").addEventListener("click", e => {
        e.target.remove();
        $("#ep-list").innerHTML = eps.map(id => `<iframe src="https://open.spotify.com/embed/episode/${id}" height="152" style="width:100%;border:0;border-radius:12px" loading="lazy" allow="encrypted-media" title="InoRa episode"></iframe>`).join("");
      });
      $("#crew").innerHTML = (I.crew || []).map(c => personCard({ name: c.name, role: c.role, img: c.img })).join("");
    },

    /* ---------- Lab Log ---------- */
    blog() {
      const P = D.posts || [];
      const card = (p, big) => `<a class="post ${big ? "big" : ""}" href="blog-post.html?p=${p.url.replace(/\/$/, "").split("/").pop()}">
        <div class="polaroid ${big ? "tape" : ""}" style="--r:${big ? -1 : .8}deg">${img(p.img, "")}</div>
        <div><span class="tag pen">${esc(p.tags[0] || "Lab Log")}</span></div>
        <h3>${esc(p.t)}</h3><p class="by">${esc(p.author)} · ${fmt(p.d)}</p></a>`;
      $("#feature").innerHTML = card(P[0], true);
      $("#side").innerHTML = P.slice(1, 3).map(p => card(p)).join("");
      $("#recent").innerHTML = P.slice(3, 9).map(p => card(p)).join("");
      const tags = {}; P.forEach(p => p.tags.forEach(t => tags[t] = (tags[t] || 0) + 1));
      $("#topics").innerHTML = Object.keys(tags).sort().map(t => { const x = ((window.INO_BLOG_DIR || {}).tags || []).find(g => g.name === t); return x ? `<a class="chip" href="blog-directory.html?tag=${x.slug}">${esc(t)}</a>` : ""; }).join("") + `<a class="chip" href="blog-directory.html#topics">All topics →</a>`;
      $("#authors").innerHTML = [...new Set(P.map(p => p.author))].map(a => `<li class="mentor"><span class="ini">${esc(a.split(" ").map(w => w[0]).slice(0, 2).join(""))}</span><b>${esc(a)}</b></li>`).join("");
    },

    /* ---------- Recurring series ---------- */
    recurring() {
      const all = (D.recurring || []).slice().sort((a, b) => b.d.localeCompare(a.d));
      const info = {
        "Weekend Workbench": "Saturday build sessions. Bring a problem, leave with a prototype.",
        "Hangout with Inovus": "Fireside chats with founders, alumni and people who’ve done the thing.",
        "Simply Series": "One topic, explained simply. LinkedIn, blockchain and more.",
      };
      $("#series").innerHTML = Object.keys(info).map((k, i) => {
        const n = all.filter(e => e.series === k);
        return `<button class="series-tab" role="tab" aria-selected="${!i}" data-s="${k}"><b>${k}</b><span>${info[k]}</span><small>${n.length} editions · ${year(n[n.length - 1].d)}–${year(n[0].d)}</small></button>`;
      }).join("");
      const draw = s => {
        $("#editions").innerHTML = all.filter(e => e.series === s).map(e => `<li>
          ${img(e.img, "", "thumb", "poster n/a")}
          <div><span class="when">${fmt(e.d)}</span><h3 class="mt-2">${esc(e.t.replace(/Hangout with Inovus -/i, "Hangout · "))}</h3></div>
          <div class="act"><span class="badge done">Past</span></div></li>`).join("");
      };
      $("#series").addEventListener("click", e => { const b = e.target.closest("[data-s]"); if (!b) return; $$("#series .series-tab").forEach(t => t.setAttribute("aria-selected", t === b)); draw(b.dataset.s); });
      draw("Weekend Workbench");
    },

    /* ---------- Outreach ---------- */
    outreach() {
      const O = (D.outreach || []).slice().sort((a, b) => b.d.localeCompare(a.d));
      $("#visits").innerHTML = O.map((o, i) => `<article class="event">
        ${img(o.img, o.t)}
        <div class="event-body">
          <p style="font:700 1.05rem/1.25 var(--f-display);letter-spacing:-.01em">${esc(o.where)}</p>
          <div class="row"><time datetime="${o.d}">${range(o.d, o.d2)}</time></div>
          <h3 style="font-weight:500;font-size:.98rem;color:var(--ink-2)">${esc(o.t)}</h3>
        </div></article>`).join("");
    },

    /* ---------- Guidelines ---------- */
    guidelines() {
      const G = D.guidelines || [];
      const id = t => t.toLowerCase().replace(/[^a-z]+/g, "-");
      $("#rail-list").innerHTML = G.map(g => `<li><a href="#${id(g.t)}">${esc(g.t)}</a></li>`).join("");
      $("#roles").innerHTML = G.map((g, i) => `<details id="${id(g.t)}">
        <summary><span class="n">${i + 1}</span><h3>${esc(g.t)}</h3></summary>
        <div class="body"><ul>${g.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul></div></details>`).join("");
      const f = $("#role-q");
      f.addEventListener("input", () => {
        const q = f.value.toLowerCase();
        $$("#roles details").forEach((d, i) => { const hit = !q || (G[i].t + G[i].points.join(" ")).toLowerCase().includes(q); d.hidden = !hit; if (q && hit) d.open = true; });
        $("#role-empty").hidden = $$("#roles details").some(d => !d.hidden);
      });
      $("#expand").addEventListener("click", e => { const open = e.target.dataset.open !== "1"; $$("#roles details").forEach(d => d.open = open); e.target.dataset.open = open ? "1" : "0"; e.target.textContent = open ? "Collapse all" : "Expand all"; });
      if (location.hash) { const d = $(location.hash); if (d && d.tagName === "DETAILS") d.open = true; }
    },

    /* ---------- Atom EV ---------- */
    atom() {
      const yt = u => u.includes("/embed/") ? "https://www.youtube.com/watch?v=" + u.split("/embed/")[1].split("?")[0] : src(u);
      $("#press").innerHTML = (D.news || []).map(n => `<li><span class="when">${fmt(n.d)}</span><div><h3>${esc(n.source)}</h3><p class="sub">${esc(n.type)}${n.edition ? " · " + esc(n.edition) : ""}</p></div><div class="act"><a class="link" style="font-size:1.15rem" href="${yt(n.url)}" ${ext}>Open ↗</a></div></li>`).join("");
      $("#related").innerHTML = ["edu-bulb", "smart-inovus", "open-pc"].map(i => (D.projects || []).find(p => p.id === i)).filter(Boolean).map(buildCard).join("");
    },

    /* ---------- Resources ---------- */
    resources() {
      const all = D.resources || [];
      const cats = ["All", ...new Set(all.flatMap(r => r.cats))];
      $("#rcats").innerHTML = cats.map(c => `<button class="chip" aria-pressed="${c === "All"}" data-c="${c}">${c}</button>`).join("");
      let cat = "All";
      const draw = () => {
        const q = $("#q").value.toLowerCase();
        const list = all.filter(r => (cat === "All" || r.cats.includes(cat)) && (!q || (r.t + r.desc).toLowerCase().includes(q)));
        $("#count").textContent = `${list.length} resource${list.length === 1 ? "" : "s"}`;
        $("#res").innerHTML = list.map(r => `<li>
          <span class="when">${esc(r.cats.join(", "))}</span>
          <div><h3 lang="${r.lang === "ml-IN" ? "ml" : "en"}">${esc(r.t)}</h3><p class="sub">${esc(r.desc)}</p></div>
          <div class="act">${r.links.map(l => `<a class="btn btn-ink btn-sm" href="${esc(l.url)}" ${ext}>${esc(l.type)} ↗</a>`).join("")}</div></li>`).join("");
        $("#empty").hidden = !!list.length;
      };
      $("#rcats").addEventListener("click", e => { const b = e.target.closest("[data-c]"); if (!b) return; cat = b.dataset.c; $$("#rcats .chip").forEach(c => c.setAttribute("aria-pressed", c === b)); draw(); });
      $("#q").addEventListener("input", draw);
      $("#reset").addEventListener("click", () => { $("#q").value = ""; cat = "All"; $$("#rcats .chip").forEach(c => c.setAttribute("aria-pressed", c.dataset.c === "All")); draw(); });
      draw();
    },

    /* ---------- Event detail ---------- */
    event() {
      const all = D.events || [];
      const e = all.find(x => String(x.id) === qs("id")) || all[0];
      document.title = `${e.t} · Inovus Labs IEDC`;
      $("#crumb").textContent = e.t;
      $("#title").textContent = e.t;
      $("#when").textContent = range(e.d, e.d2);
      $("#poster").innerHTML = img(e.img, e.t + " poster");
      $("#desc").innerHTML = `<p>${esc(e.desc)}</p>`;
      $("#meta").innerHTML = `<div><dt>Status</dt><dd><span class="badge done">Completed</span></dd></div>
        <div><dt>Date</dt><dd>${range(e.d, e.d2)}</dd></div>
        <div><dt>Type</dt><dd>${esc(e.tags.join(", ") || "Event")}</dd></div>
        <div><dt>Organiser</dt><dd>Inovus Labs IEDC</dd></div>`;
      const rel = all.filter(x => x.id !== e.id && x.tags.some(t => e.tags.includes(t))).slice(0, 3);
      $("#related").innerHTML = rel.map(eventCard).join("");
    },

    /* ---------- Project detail ---------- */
    project() {
      const all = D.projects || [];
      const p = all.find(x => x.id === qs("id")) || all.find(x => x.id === "smart-inovus");
      document.title = `${p.t} · Inovus Labs IEDC`;
      $("#crumb").textContent = p.t;
      $("#title").textContent = p.t;
      $("#status").innerHTML = statusBadge(p.status) + `<span class="muted" style="font-size:.85rem">as reported by the team</span>`;
      $("#shot").innerHTML = img(p.img, p.t, "", "media not yet added");
      $("#desc").innerHTML = p.desc.split(/(?<=\.)\s+(?=[A-Z])/).reduce((acc, s, i) => { const k = Math.floor(i / 3); (acc[k] = acc[k] || []).push(s); return acc; }, []).map(g => `<p>${esc(g.join(" "))}</p>`).join("");
      $("#meta").innerHTML = `<div><dt>Area</dt><dd>${esc(p.tags.join(", "))}</dd></div>
        <div><dt>Status</dt><dd>${esc(p.status)}</dd></div>
        ${p.by.length ? `<div><dt>Contributors</dt><dd>${esc(p.by.join(", "))}</dd></div>` : ""}
        <div><dt>${p.urlType === "demo" ? "Live demo" : "Source"}</dt><dd>${p.url ? `<a href="${esc(p.url)}" ${ext}>${p.urlType === "demo" ? "Visit" : "View repository"} ↗</a>` : `<span class="muted">Not published</span>`}</dd></div>`;
      const rel = all.filter(x => x.id !== p.id && x.tags.some(t => p.tags.includes(t))).slice(0, 3);
      $("#related").innerHTML = rel.map(buildCard).join("");
    },

    /* ---------- Lab Log article (publication template) ---------- */
    post() {
      const P = window.INO_POSTS || [], DIR = window.INO_BLOG_DIR || { authors: [], tags: [] };
      const p = P.find(x => x.slug === qs("p")) || P[0];
      const ini = n => n.split(" ").map(w => w[0]).slice(0, 2).join("");
      const au = DIR.authors.find(a => a.name === p.author);
      const tg = t => DIR.tags.find(x => x.name === t);
      document.title = `${p.t} · Lab Log`;
      $("#tag").innerHTML = p.tags.map(t => `<a class="tag pen" href="blog-directory.html?tag=${encodeURIComponent((tg(t) || {}).slug || "")}" style="text-decoration:none">${esc(t)}</a>`).join(" ") || `<span class="tag pen">Lab Log</span>`;
      $("#title").textContent = p.t;
      $("#byline").innerHTML = `<span class="ini">${esc(ini(p.author))}</span><span><b>${esc(p.author)}</b><br>${fmt(p.d)} · ${p.mins} min read</span>`;
      $("#cover").innerHTML = p.img ? `<img src="${esc(p.img)}" alt="" loading="eager">` : "";
      $("#cover").hidden = !p.img;
      $("#body").innerHTML = p.html; // sanitised to an allow-list at build time (build_posts.py)
      $("#original").href = p.url;
      $("#author-card").innerHTML = `<span class="ini" style="width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:var(--pen-soft);color:var(--pen);font-weight:600;flex-shrink:0">${esc(ini(p.author))}</span>
        <div><p class="hand hand-md">written by</p><b style="font-size:1.1rem">${esc(p.author)}</b><br>
        ${au ? `<a class="link" style="font-size:1.15rem" href="blog-directory.html?author=${au.slug}">More from ${esc(p.author.split(" ")[0])} →</a>` : ""}</div>`;
      const rel = P.filter(x => x !== p && (x.author === p.author || x.tags.some(t => p.tags.includes(t)))).concat(P.filter(x => x !== p)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 3);
      $("#more-posts").innerHTML = rel.map(x => `<a class="post" href="blog-post.html?p=${x.slug}"><div class="polaroid" style="--r:.6deg">${img(x.img, "")}</div><div><span class="tag pen">${esc(x.tags[0] || "Lab Log")}</span></div><h3>${esc(x.t)}</h3><p class="by">${esc(x.author)} · ${fmt(x.d)}</p></a>`).join("");
    },

    /* ---------- Lab Log authors & topics (publication directory template) ---------- */
    directory() {
      const P = window.INO_POSTS || [], DIR = window.INO_BLOG_DIR || { authors: [], tags: [] };
      const ini = n => n.split(" ").map(w => w[0]).slice(0, 2).join("");
      const recent = { a: {}, t: {} };
      P.forEach(p => { recent.a[p.author] = (recent.a[p.author] || 0) + 1; p.tags.forEach(t => recent.t[t] = (recent.t[t] || 0) + 1); });
      const card = x => `<a class="post" href="blog-post.html?p=${x.slug}"><div class="polaroid" style="--r:.6deg">${img(x.img, "")}</div><h3>${esc(x.t)}</h3><p class="by">${esc(x.author)} · ${fmt(x.d)}</p></a>`;
      const aSlug = qs("author"), tSlug = qs("tag");
      const sel = aSlug ? DIR.authors.find(a => a.slug === aSlug) : tSlug ? DIR.tags.find(t => t.slug === tSlug) : null;
      if (sel) {
        $("#dir-view").hidden = true; $("#archive").hidden = false;
        $("#ar-kind").textContent = aSlug ? "Author" : "Topic";
        $("#ar-title").textContent = sel.name;
        $("#ar-full").href = sel.url;
        const list = P.filter(p => aSlug ? p.author === sel.name : p.tags.includes(sel.name));
        $("#ar-list").innerHTML = list.map(card).join("");
        $("#ar-empty").hidden = !!list.length;
        document.title = `${sel.name} · Lab Log`;
        return;
      }
      const tab = w => { $$("[data-dtab]").forEach(t => t.setAttribute("aria-selected", t.dataset.dtab === w)); $("#authors-panel").hidden = w !== "authors"; $("#topics-panel").hidden = w !== "topics"; history.replaceState(null, "", "#" + w); };
      $$("[data-dtab]").forEach(t => t.addEventListener("click", () => tab(t.dataset.dtab)));
      $("#author-grid").innerHTML = DIR.authors.map(a => `<a class="dir-item" href="?author=${a.slug}"><span class="ini">${esc(ini(a.name))}</span><span><b>${esc(a.name)}</b>${recent.a[a.name] ? `<small>${recent.a[a.name]} recent post${recent.a[a.name] > 1 ? "s" : ""}</small>` : ""}</span></a>`).join("");
      $("#topic-list").innerHTML = DIR.tags.map(t => `<li><a href="?tag=${t.slug}">${esc(t.name)}${recent.t[t.name] ? `<span>${recent.t[t.name]} new</span>` : ""}</a></li>`).join("");
      const q = $("#dq");
      q.addEventListener("input", () => {
        const v = q.value.toLowerCase();
        $$("#author-grid .dir-item, #topic-list li").forEach(el => el.hidden = v && !el.textContent.toLowerCase().includes(v));
        $("#dempty").hidden = $$("#author-grid .dir-item, #topic-list li").some(el => !el.hidden && !el.closest("[hidden]"));
      });
      tab(location.hash === "#topics" ? "topics" : "authors");
    },

    /* ---------- Home: ventures ---------- */
    home() {
      const v = $("#ventures"); if (!v) return;
      v.innerHTML = (D.ventures || []).map(x => `<div class="venture">
        <div class="logo-box">${x.img ? `<img src="${src(x.img)}" alt="${esc(x.name)} logo" loading="lazy">` : ""}</div>
        <h3>${esc(x.name.replace(/ (Technology Solutions Pvt\. Ltd\.|Techno Solutions)$/, ""))}</h3><p>${esc(x.desc)}</p>
        ${x.url ? `<a class="link" style="font-size:1.1rem;margin-top:auto" href="${x.url}" ${ext}>Visit ↗</a>` : ""}</div>`).join("");
    },
  };

  (R[page] || (() => {}))();
  reveal();
})();
