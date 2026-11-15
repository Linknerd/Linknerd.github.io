(function () {
  var P = window.PORTFOLIO;
  var app = document.getElementById("app");
  var sweep = document.getElementById("sweep");
  var sweepTitle = document.getElementById("sweep-title");
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ORDER = ["projects", "about", "experience", "contact"];
  var ROUTES = {
    projects: { label: "Projects", view: projectsView },
    about: { label: "About", view: aboutView },
    experience: { label: "Experience", view: experienceView },
    contact: { label: "Contact", view: contactView },
  };

  var current = null; // { route, sub }
  var busy = false;
  var pending = false;
  var menuSel = 0; // remembered menu cursor, so going back lands where you left

  /* ---------- helpers ---------- */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  // Resolves once the browser has drawn a frame (or shortly after, if the tab is hidden).
  function frame() {
    return Promise.race([new Promise(function (r) { requestAnimationFrame(r); }), wait(120)]);
  }
  function chips(items) {
    return '<ul class="chips row">' + (items || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
  }
  function parse() {
    var parts = location.hash.replace(/^#\/?/, "").split("/");
    return { route: ROUTES[parts[0]] ? parts[0] : "menu", sub: parts[1] || "" };
  }

  /* ---------- views ---------- */

  function menuView() {
    var c = P.contact;
    var items = ORDER.map(function (k, i) {
      return '<a class="menu-item row' + (i === menuSel ? " sel" : "") + '" href="#/' + k + '" data-i="' + i + '">' +
        '<span class="mi-num">' + pad(i + 1) + '</span><span class="mi-word">' + esc(ROUTES[k].label) + "</span></a>";
    }).join("");
    var names = P.name.split(" ");
    var ticker = P.skills.reduce(function (all, g) { return all.concat(g.items); }, [])
      .map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
    return '<main class="menu-view">' +
      '<section class="pitch">' +
        '<p class="count" aria-hidden="true"><b id="count">01</b><span>/' + pad(ORDER.length) + "</span></p>" +
        '<p class="pitch-role row">' + esc(P.role) + " · " + esc(P.school) + "</p>" +
        '<h1 class="row">' + esc(names[0]) + "<br>" + esc(names.slice(1).join(" ")) + "</h1>" +
        '<p class="pitch-seek row"><span>' + esc(P.seekingLead) + "</span> <b>" + esc(P.seekingWhat) + "</b></p>" +
        '<ul class="pitch-tags row">' + P.focus.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
        '<p class="pitch-links row"><a href="mailto:' + esc(c.email) + '">Email</a>' +
          c.links.map(function (l) {
            return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
          }).join("") + "</p>" +
      "</section>" +
      '<div class="menu-col">' +
        '<nav class="menu" aria-label="Main">' + items + "</nav>" +
        '<p class="hint row" id="hint" aria-live="polite"></p>' +
        '<p class="keys row" aria-hidden="true">↑ ↓ select · Enter open</p>' +
      "</div>" +
      '<span class="stripe" aria-hidden="true"></span>' +
      '<div class="ticker" aria-hidden="true"><div class="ticker-track">' + ticker + ticker + "</div></div>" +
      "</main>";
  }

  function shell(key, body) {
    var nav = ORDER.map(function (k) {
      return '<a href="#/' + k + '"' + (k === key ? ' aria-current="page"' : "") + ">" + esc(ROUTES[k].label) + "</a>";
    }).join("");
    return '<div class="page">' +
      '<header class="band-wrap"><div class="band">' +
        '<span class="band-ghost" aria-hidden="true">' + pad(ORDER.indexOf(key) + 1) + "</span>" +
        '<nav class="topnav wrap" aria-label="Main"><a class="back" href="#/">◀ Menu</a>' + nav + "</nav>" +
        '<div class="band-title wrap"><span class="band-num">' + pad(ORDER.indexOf(key) + 1) + "</span>" +
        '<h1 tabindex="-1"><span>' + esc(ROUTES[key].label) + "</span></h1></div>" +
      '</div><span class="edge" aria-hidden="true"></span></header>' +
      '<main class="wrap body">' + body + "</main>" +
      '<footer class="wrap foot"><span>© ' + new Date().getFullYear() + " " + esc(P.name) + "</span>" +
      '<a href="#/">Back to menu</a></footer>' +
      "</div>";
  }

  function projectsView() {
    var list = P.projects.map(function (p, i) {
      return '<a class="pl-item bar-item row" href="#/projects/' + esc(p.id) + '" data-id="' + esc(p.id) + '">' +
        '<span class="pl-num">' + pad(i + 1) + "</span>" +
        '<span class="pl-title">' + esc(p.title) + "</span>" +
        '<span class="pl-meta">' + esc(p.category) + " · " + esc(p.year) + "</span></a>";
    }).join("");
    var details = P.projects.map(function (p, i) {
      var links = (p.links || []).map(function (l) {
        return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + " ↗</a>";
      }).join("");
      return '<article class="project" data-id="' + esc(p.id) + '">' +
        (p.image ? '<img class="fig row" src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy">' : "") +
        '<p class="label row">' + pad(i + 1) + " · " + esc(p.category) + " · " + esc(p.year) + "</p>" +
        '<h2 class="row">' + esc(p.title) + "</h2>" +
        '<p class="lede row">' + esc(p.summary) + "</p>" +
        '<dl class="pao">' +
          '<div class="row"><dt>Problem</dt><dd>' + esc(p.problem) + "</dd></div>" +
          '<div class="row"><dt>Approach</dt><dd>' + esc(p.approach) + "</dd></div>" +
          '<div class="row"><dt>Outcome</dt><dd>' + esc(p.outcome) + "</dd></div>" +
        "</dl>" + chips(p.tools) +
        (links ? '<p class="plinks row">' + links + "</p>" : "") +
        "</article>";
    }).join("");
    return '<div class="projects">' +
      '<div class="plist" data-bar><span class="bar" aria-hidden="true"></span>' + list + "</div>" +
      '<div class="pdetail">' + details + "</div></div>";
  }

  function aboutView() {
    return '<div class="about">' +
      '<div class="prose">' + P.about.map(function (p) { return '<p class="row">' + esc(p) + "</p>"; }).join("") + "</div>" +
      "<aside>" +
        '<dl class="facts row">' + P.facts.map(function (f) {
          return "<div><dt>" + esc(f.label) + "</dt><dd>" + esc(f.value) + "</dd></div>";
        }).join("") + "</dl>" +
        P.skills.map(function (s) {
          return '<div class="skill-group"><h2 class="label row">' + esc(s.group) + "</h2>" + chips(s.items) + "</div>";
        }).join("") +
      "</aside></div>";
  }

  function experienceView() {
    return '<div class="xp" data-bar><span class="bar" aria-hidden="true"></span><ol>' + P.experience.map(function (e) {
      return '<li class="xp-item bar-item row"><p class="label">' + esc(e.period) + "</p><div><h2>" + esc(e.title) +
        '</h2><p class="org">' + esc(e.org) + "</p><p>" + esc(e.summary) + "</p></div></li>";
    }).join("") + "</ol></div>";
  }

  function contactView() {
    var c = P.contact;
    return '<div class="contact"><div>' +
      '<p class="lede row">' + esc(c.blurb) + "</p>" +
      '<p class="row"><a class="email" href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a></p>" +
      '<p class="actions row">' +
        (c.resumeUrl ? '<a class="btn" href="' + esc(c.resumeUrl) + '">Download résumé</a>' : "") +
        c.links.map(function (l) {
          return '<a class="btn" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + " ↗</a>";
        }).join("") + "</p></div>" +
      '<aside><h2 class="label row">At a glance</h2>' +
        '<dl class="facts row">' + P.facts.map(function (f) {
          return "<div><dt>" + esc(f.label) + "</dt><dd>" + esc(f.value) + "</dd></div>";
        }).join("") + "</dl>" + chips(P.focus) + "</aside></div>";
  }

  /* ---------- row stagger + highlight bar ---------- */

  // Number the visible rows so CSS can stagger their entrance.
  function indexRows(root) {
    var i = 0;
    root.querySelectorAll(".row").forEach(function (el) {
      if (el.offsetParent === null) return;
      el.style.setProperty("--i", Math.min(i++, 16));
    });
  }
  function slam() {
    indexRows(app);
    app.classList.remove("slam");
    void app.offsetWidth; // restart the animation
    app.classList.add("slam");
  }

  function moveBar(item) {
    var box = item.closest("[data-bar]");
    var bar = box.querySelector(".bar");
    box.querySelectorAll(".bar-item.on").forEach(function (el) { el.classList.remove("on"); });
    item.classList.add("on");
    // First appearance snaps into place; after that it slides between rows.
    var fresh = !bar.classList.contains("on");
    if (fresh) bar.style.transition = "none";
    bar.style.setProperty("--y", item.offsetTop + "px");
    bar.style.setProperty("--h", item.offsetHeight + "px");
    bar.classList.add("on");
    if (fresh) { void bar.offsetWidth; bar.style.transition = ""; }
  }
  function clearBar(box) {
    box.querySelectorAll(".bar-item.on").forEach(function (el) { el.classList.remove("on"); });
    box.querySelector(".bar").classList.remove("on");
  }

  function selectProject(id, animate) {
    var item = app.querySelector('.pl-item[data-id="' + id + '"]') || app.querySelector(".pl-item");
    if (!item) return;
    id = item.dataset.id;
    var art = app.querySelector('.project[data-id="' + id + '"]');
    if (art.classList.contains("active") && animate) return;
    app.querySelectorAll(".project.active").forEach(function (a) { a.classList.remove("active", "re"); });
    art.classList.add("active");
    moveBar(item);
    if (animate) {
      indexRows(art);
      void art.offsetWidth;
      art.classList.add("re");
    }
    if (current && current.route === "projects") current.sub = id;
  }

  function setMenuSel(i) {
    var items = app.querySelectorAll(".menu-item");
    if (!items.length) return;
    menuSel = (i + items.length) % items.length;
    items.forEach(function (el, n) { el.classList.toggle("sel", n === menuSel); });
    var hint = document.getElementById("hint");
    if (hint) hint.textContent = P.menuHints[ORDER[menuSel]] || "";
    var count = document.getElementById("count");
    if (count && count.textContent !== pad(menuSel + 1)) {
      count.textContent = pad(menuSel + 1);
      count.classList.remove("pop");
      void count.offsetWidth;
      count.classList.add("pop");
    }
  }

  /* ---------- rendering + transitions ---------- */

  function render(t) {
    document.body.className = "r-" + t.route;
    document.documentElement.className = "r-" + t.route;
    app.classList.remove("slam", "leave", "arrive", "hold");
    if (t.route === "menu") {
      app.innerHTML = menuView();
      setMenuSel(menuSel);
      document.title = P.name + " — " + P.role;
    } else {
      menuSel = ORDER.indexOf(t.route);
      app.innerHTML = shell(t.route, ROUTES[t.route].view());
      if (t.route === "projects") selectProject(t.sub, false);
      document.title = ROUTES[t.route].label + " — " + P.name;
    }
    window.scrollTo(0, 0);
  }

  // Menu -> page: black sheet sweeps in from the right, the page name is
  // stamped on it, then the sheet lifts away on a slant while rows slam in.
  async function enter(t) {
    sweepTitle.textContent = ROUTES[t.route].label;
    sweep.className = "sweep cover";
    await wait(230);
    render(t);
    await wait(230);
    sweep.className = "sweep lift";
    slam();
    await wait(250);
    sweep.className = "sweep";
    var h1 = app.querySelector("h1");
    if (h1) h1.focus({ preventScroll: true });
  }

  // Page -> menu: quicker. A red sheet sweeps in from the left, the menu is
  // drawn underneath it, and the sheet carries on off the right.
  async function back(t) {
    sweep.className = "sweep red cover-left";
    await wait(200);
    render(t);
    await frame(); await frame(); // let the menu draw underneath before anything moves
    sweep.className = "sweep red exit-right"; // the sheet carries on off the other side
    slam();
    await wait(210);
    sweep.className = "sweep";
  }

  // Page -> page: no full-screen sheet. The header stays put; the old rows
  // shoot off one side, the title rolls over, and the new rows come in from
  // the other side. Direction follows the order of the pages.
  async function switchTo(t) {
    var dir = ORDER.indexOf(t.route) > ORDER.indexOf(current.route) ? 1 : -1;
    app.style.setProperty("--dir", dir);
    app.classList.remove("slam", "arrive");
    app.classList.add("leave");
    await wait(210);

    var next = document.createElement("div");
    next.innerHTML = shell(t.route, ROUTES[t.route].view());
    [".topnav", ".band-title", ".band-ghost", ".body"].forEach(function (sel) {
      app.querySelector(sel).innerHTML = next.querySelector(sel).innerHTML;
    });
    document.body.className = "r-" + t.route;
    document.documentElement.className = "r-" + t.route;
    menuSel = ORDER.indexOf(t.route);
    if (t.route === "projects") selectProject(t.sub, false);
    document.title = ROUTES[t.route].label + " — " + P.name;
    window.scrollTo(0, 0);

    indexRows(app);
    app.classList.remove("leave");
    app.classList.add("hold");
    await frame(); await frame(); // let the new page draw before anything moves
    app.classList.remove("hold");
    app.classList.add("arrive");
    var wedge = document.querySelector(".wedge");
    wedge.classList.remove("pop");
    void wedge.offsetWidth;
    wedge.classList.add("pop");
    await wait(300);
    var h1 = app.querySelector("h1");
    if (h1) h1.focus({ preventScroll: true });
  }

  async function navigate() {
    if (busy) { pending = true; return; }
    var t = parse();
    if (current && t.route === current.route) {
      if (t.route === "projects" && t.sub) selectProject(t.sub, true);
      return;
    }
    busy = true;
    if (!current || calm) { render(t); slam(); }
    else if (t.route === "menu") await back(t);
    else if (current.route === "menu") await enter(t);
    else await switchTo(t);
    current = t;
    busy = false;
    if (pending) { pending = false; navigate(); }
  }

  /* ---------- events ---------- */

  app.addEventListener("click", function (e) {
    var mi = e.target.closest(".menu-item");
    if (mi) { setMenuSel(+mi.dataset.i); mi.classList.add("punch"); return; }
    var pl = e.target.closest(".pl-item");
    if (pl) {
      e.preventDefault();
      selectProject(pl.dataset.id, true);
      history.replaceState(null, "", "#/projects/" + pl.dataset.id);
    }
  });

  function hover(e) {
    var mi = e.target.closest(".menu-item");
    if (mi) return setMenuSel(+mi.dataset.i);
    var xp = e.target.closest(".xp-item");
    if (xp) moveBar(xp);
  }
  app.addEventListener("mouseover", hover);
  app.addEventListener("focusin", hover);
  app.addEventListener("mouseout", function (e) {
    var box = e.target.closest(".xp");
    if (box && !(e.relatedTarget && box.contains(e.relatedTarget))) clearBar(box);
  });

  document.addEventListener("keydown", function (e) {
    if (!current || current.route !== "menu" || busy) return;
    var items = app.querySelectorAll(".menu-item");
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setMenuSel(menuSel + (e.key === "ArrowDown" ? 1 : -1));
      items[menuSel].focus();
    } else if (e.key === "Enter" && !e.target.closest("a, button")) {
      items[menuSel].classList.add("punch");
      location.hash = items[menuSel].getAttribute("href");
    }
  });

  if (!calm) {
    app.addEventListener("mousemove", function (e) {
      var view = app.querySelector(".menu-view");
      if (!view) return;
      view.style.setProperty("--px", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
      view.style.setProperty("--py", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
    });
  }

  window.addEventListener("resize", function () {
    app.querySelectorAll(".bar-item.on").forEach(moveBar);
  });
  window.addEventListener("hashchange", navigate);
  navigate();
})();
