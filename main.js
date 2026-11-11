(function () {
  var P = window.PORTFOLIO;
  var page = document.body.dataset.page;
  var $ = function (id) { return document.getElementById(id); };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function chips(items) {
    return '<ul class="chips">' + (items || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
  }
  function figure(p, i) {
    if (p.image) return '<img class="fig" src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy">';
    return '<div class="fig placeholder" aria-hidden="true"><span>FIG. ' + pad(i + 1) + "</span></div>";
  }

  // Shared
  document.querySelectorAll("[data-fill]").forEach(function (el) { el.textContent = P[el.dataset.fill] || ""; });
  $("year").textContent = new Date().getFullYear();
  document.title = (page === "projects" ? "Projects — " : "") + P.name + (page === "home" ? " — " + P.role : "");

  $("theme").addEventListener("click", function () {
    var root = document.documentElement;
    var dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });

  if (page === "home") {
    $("facts").innerHTML = P.facts.map(function (f) {
      return "<div><dt>" + esc(f.label) + "</dt><dd>" + esc(f.value) + "</dd></div>";
    }).join("");

    $("about-text").innerHTML = P.about.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");

    $("skills").innerHTML = P.skills.map(function (s) {
      return "<div><h3>" + esc(s.group) + "</h3>" + chips(s.items) + "</div>";
    }).join("");

    $("featured").innerHTML = P.projects.map(function (p, i) {
      if (!p.featured) return "";
      return '<a class="card" href="projects.html#' + esc(p.id) + '">' + figure(p, i) +
        '<div class="card-body"><p class="label">' + esc(p.category) + " · " + esc(p.year) + "</p>" +
        "<h3>" + esc(p.title) + "</h3><p>" + esc(p.summary) + "</p></div></a>";
    }).join("");

    $("timeline").innerHTML = P.experience.map(function (e) {
      return '<li><p class="label">' + esc(e.period) + "</p><div><h3>" + esc(e.title) +
        ' <span class="org">· ' + esc(e.org) + "</span></h3><p>" + esc(e.summary) + "</p></div></li>";
    }).join("");

    var c = P.contact;
    $("contact-body").innerHTML =
      '<p class="lede">' + esc(c.blurb) + "</p>" +
      '<p class="actions"><a class="btn primary" href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>" +
      (c.resumeUrl ? '<a class="btn" href="' + esc(c.resumeUrl) + '">Download résumé</a>' : "") +
      c.links.map(function (l) {
        return '<a class="btn" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + " ↗</a>";
      }).join("") + "</p>";
  }

  if (page === "projects") {
    var cats = [];
    P.projects.forEach(function (p) { if (cats.indexOf(p.category) < 0) cats.push(p.category); });

    $("project-list").innerHTML = P.projects.map(function (p, i) {
      var links = (p.links || []).map(function (l) {
        return '<a href="' + esc(l.url) + '">' + esc(l.label) + " ↗</a>";
      }).join("");
      return '<article class="project" id="' + esc(p.id) + '" data-cat="' + esc(p.category) + '">' +
        figure(p, i) +
        '<div class="project-body">' +
        '<p class="label">' + pad(i + 1) + " · " + esc(p.category) + " · " + esc(p.year) + "</p>" +
        "<h2>" + esc(p.title) + "</h2>" +
        '<p class="lede">' + esc(p.summary) + "</p>" +
        '<dl class="pao">' +
        "<div><dt>Problem</dt><dd>" + esc(p.problem) + "</dd></div>" +
        "<div><dt>Approach</dt><dd>" + esc(p.approach) + "</dd></div>" +
        "<div><dt>Outcome</dt><dd>" + esc(p.outcome) + "</dd></div>" +
        "</dl>" + chips(p.tools) +
        (links ? '<p class="project-links">' + links + "</p>" : "") +
        "</div></article>";
    }).join("");

    function apply(cat) {
      document.querySelectorAll("#filters button").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.cat === cat));
      });
      document.querySelectorAll(".project").forEach(function (a) {
        a.hidden = cat !== "All" && a.dataset.cat !== cat;
      });
    }
    $("filters").innerHTML = ["All"].concat(cats).map(function (c) {
      return '<button type="button" data-cat="' + esc(c) + '">' + esc(c) + "</button>";
    }).join("");
    $("filters").addEventListener("click", function (e) {
      if (e.target.dataset.cat) apply(e.target.dataset.cat);
    });
    apply("All");

    // Content is rendered after load, so honour #project-id links by hand.
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }
})();
