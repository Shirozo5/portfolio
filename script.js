/* ==========================================================================
   Portfolio script
   Fill in the CONFIG block below. Anything left empty ("") stays hidden,
   so the site never shows a dead link.
   ========================================================================== */

(function () {
  "use strict";

  var CONFIG = {
    email: "abdul_lord@hotmail.com",
    phone: "+90 582 204 8398",
    upwork: "",     // full URL of your Upwork profile
    github: "https://github.com/Shirozo5",
    linkedin: "https://www.linkedin.com/in/muhammad-abdullah-2a390b3a3/",
    cv: "files/Muhammad-Abdullah-CV.pdf",

    // Link each project card to its code or live site. Leave "" to hide the link.
    repos: {
      "echo-notes": "https://shirozo5.github.io/Echo-Notes/",
      "light-novel-to-manga": "",
      "bridgepoint": "",
      "northwind-sql": "https://github.com/Shirozo5/SQL-Pipeline",
      "telco-churn": "https://github.com/Shirozo5/telco_churn_analysis",
      "sales-dashboard": "https://github.com/Shirozo5/sales_dashboard"
    }
  };

  var root = document.documentElement;

  /* ---------- Safe storage (it can be blocked or throw) ---------- */

  function storeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function storeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  /* ---------- Theme toggle ---------- */

  var themeBtn = document.getElementById("theme-toggle");
  var colorQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function isDark() {
    var chosen = root.getAttribute("data-theme");
    if (chosen) return chosen === "dark";
    return !!(colorQuery && colorQuery.matches);
  }

  function syncThemeBtn() {
    if (themeBtn) themeBtn.setAttribute("aria-pressed", String(isDark()));
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      storeSet("theme", next);
      syncThemeBtn();
    });
  }

  if (colorQuery && colorQuery.addEventListener) {
    colorQuery.addEventListener("change", syncThemeBtn);
  }

  syncThemeBtn();

  /* ---------- Mobile menu ---------- */

  var menuBtn = document.getElementById("menu-btn");
  var nav = document.getElementById("site-nav");

  function setMenu(open) {
    if (!menuBtn || !nav) return;
    nav.setAttribute("data-open", String(open));
    menuBtn.setAttribute("aria-expanded", String(open));
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      setMenu(nav.getAttribute("data-open") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.getAttribute("data-open") === "true") {
        setMenu(false);
        menuBtn.focus();
      }
    });
  }

  /* ---------- Highlight the current section in the nav ---------- */

  if (nav && "IntersectionObserver" in window) {
    var links = {};
    nav.querySelectorAll('a[href^="#"]').forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (id) {
          if (id === entry.target.id) {
            links[id].setAttribute("aria-current", "true");
          } else {
            links[id].removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });

    Object.keys(links).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* ---------- Hero demo: clean a messy table, one step at a time ---------- */

  var demoBody = document.getElementById("demo-body");
  var demoBtn = document.getElementById("demo-btn");
  var demoStatus = document.getElementById("demo-status");

  if (demoBody && demoBtn && demoStatus) {
    // Each field is [raw value, cleaned value]
    var rows = [
      { id: "1001", name: ["  ayesha KHAN", "Ayesha Khan"], date: ["03/14/2026", "2026-03-14"], amount: ["1,250", "1250"] },
      { id: "1002", name: ["Bilal Ahmed ", "Bilal Ahmed"], date: ["2026-03-15", "2026-03-15"], amount: ["980", "980"] },
      { id: "1003", name: ["sara  malik", "Sara Malik"], date: ["15 Mar 2026", "2026-03-15"], amount: ["PKR 2,400", "2400"] },
      { id: "1004", name: ["USMAN tariq", "Usman Tariq"], date: ["2026-03-16", "2026-03-16"], amount: ["", ""] },
      { id: "1005", name: ["zain  ali ", "Zain Ali"], date: ["March 17, 2026", "2026-03-17"], amount: ["3,100", "3100"] }
    ];

    // Step 0 is the raw table. Steps 1 to 3 clean one column each. Step 4 flags the gap.
    var steps = [
      { button: "Fix customer names", status: "Five rows, four kinds of mess. Fix them one step at a time." },
      { button: "Fix dates", status: "Trimmed extra spaces and fixed capitalisation in customer names." },
      { button: "Fix amounts", status: "Rewrote dates in three different formats as YYYY-MM-DD." },
      { button: "Check for gaps", status: "Removed the currency text and commas, so amounts are numbers you can add up." },
      { button: "Start over", status: "Row 1004 has no amount. I flag it for you to confirm rather than guess a value." }
    ];

    var step = 0;

    var cell = function (text, className) {
      var td = document.createElement("td");
      td.textContent = text;
      if (className) td.className = className;
      return td;
    };

    var render = function () {
      demoBody.textContent = "";

      rows.forEach(function (row) {
        var tr = document.createElement("tr");

        tr.appendChild(cell(row.id));
        tr.appendChild(cell(row.name[step >= 1 ? 1 : 0], step === 1 ? "just-cleaned" : ""));
        tr.appendChild(cell(row.date[step >= 2 ? 1 : 0], step === 2 ? "just-cleaned" : ""));

        var amount = row.amount[step >= 3 ? 1 : 0];
        var amountClass = step === 3 ? "just-cleaned" : "";

        if (step >= 4 && amount === "") {
          amount = "missing";
          amountClass = "is-flag";
        }

        tr.appendChild(cell(amount, amountClass));
        demoBody.appendChild(tr);
      });

      demoStatus.textContent = steps[step].status;
      demoBtn.textContent = steps[step].button;
    };

    demoBtn.addEventListener("click", function () {
      step = step >= steps.length - 1 ? 0 : step + 1;
      render();
    });

    demoBtn.hidden = false;
    render();
  }

  /* ---------- Hero: rotate what I do ---------- */

  var swap = document.getElementById("swap");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (swap && !reduceMotion) {
    var phrases = [
      "cleaning messy spreadsheets",
      "analysing sales and customer data",
      "writing queries in SQL",
      "reporting what the numbers say"
    ];
    var current = 0;

    setInterval(function () {
      swap.classList.add("is-leaving");
      setTimeout(function () {
        current = (current + 1) % phrases.length;
        swap.textContent = phrases[current];
        swap.classList.remove("is-leaving");
      }, 260);
    }, 3200);
  }

  /* ---------- Services tabs ---------- */

  var svc = document.querySelector(".svc");

  if (svc) {
    var tabList = svc.querySelector('[role="tablist"]');
    var tabs = Array.prototype.slice.call(svc.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(svc.querySelectorAll('[role="tabpanel"]'));

    var selectTab = function (index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) tabs[index].focus();
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { selectTab(i, false); });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        if (next !== null) {
          event.preventDefault();
          selectTab(next, true);
        }
      });
    });

    tabList.hidden = false;
    svc.classList.add("is-tabs");
    selectTab(0, false);
  }

  /* ---------- Skills: show where each skill is used ---------- */

  var skillsSection = document.getElementById("skills");
  var usedBox = document.getElementById("skill-used");

  if (skillsSection && usedBox) {
    var projectData = Array.prototype.map.call(document.querySelectorAll("#projects .project"), function (card) {
      return {
        id: card.id,
        title: card.querySelector("h3").textContent,
        tags: Array.prototype.map.call(card.querySelectorAll(".cells li"), function (li) {
          return li.textContent.trim().toLowerCase();
        })
      };
    });

    var defaultMsg = "Skills with a number are used in my projects. Select one to see where.";
    var pressed = null;

    var showDefault = function () {
      usedBox.textContent = "";
      var p = document.createElement("p");
      p.textContent = defaultMsg;
      usedBox.appendChild(p);
    };

    var showUsed = function (name, matches) {
      usedBox.textContent = "";
      var p = document.createElement("p");
      var strong = document.createElement("strong");
      strong.textContent = name;
      p.appendChild(strong);
      p.appendChild(document.createTextNode(matches.length === 1 ? " is used in one project:" : " is used in " + matches.length + " projects:"));
      usedBox.appendChild(p);

      var wrap = document.createElement("div");
      wrap.className = "chip-links";
      matches.forEach(function (m) {
        var a = document.createElement("a");
        a.className = "chip-link";
        a.href = "#" + m.id;
        a.textContent = m.title;
        wrap.appendChild(a);
      });
      usedBox.appendChild(wrap);
    };

    skillsSection.querySelectorAll(".cells li").forEach(function (li) {
      var name = li.textContent.trim();
      var key = (li.getAttribute("data-tag") || name).toLowerCase();
      var matches = projectData.filter(function (p) { return p.tags.indexOf(key) > -1; });
      if (!matches.length) return;

      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-pressed", "false");
      btn.appendChild(document.createTextNode(name));
      var count = document.createElement("span");
      count.className = "count";
      count.textContent = String(matches.length);
      btn.appendChild(count);

      btn.addEventListener("click", function () {
        if (pressed === btn) {
          btn.setAttribute("aria-pressed", "false");
          pressed = null;
          showDefault();
          return;
        }
        if (pressed) pressed.setAttribute("aria-pressed", "false");
        btn.setAttribute("aria-pressed", "true");
        pressed = btn;
        showUsed(name, matches);
      });

      li.textContent = "";
      li.appendChild(btn);
    });

    showDefault();
  }

  /* ---------- Project links ---------- */

  document.querySelectorAll("a[data-repo]").forEach(function (a) {
    var url = CONFIG.repos[a.getAttribute("data-repo")];
    if (!url) return;
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.hidden = false;
  });

  /* ---------- GitHub link to all repositories ---------- */

  if (CONFIG.github) {
    document.querySelectorAll("a[data-github]").forEach(function (a) {
      a.href = CONFIG.github.replace(/\/$/, "") + "?tab=repositories";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.hidden = false;
    });
  }

  /* ---------- Social links in the About card ---------- */

  document.querySelectorAll("a[data-social]").forEach(function (a) {
    var url = CONFIG[a.getAttribute("data-social")];
    if (!url) return;
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.hidden = false;
  });

  /* ---------- CV download buttons ---------- */

  if (CONFIG.cv) {
    document.querySelectorAll("a[data-cv]").forEach(function (a) {
      a.href = CONFIG.cv;
      a.setAttribute("download", "");
      a.hidden = false;
    });
  }

  /* ---------- Contact list ---------- */

  var contactList = document.getElementById("contact-list");
  var setupNote = document.getElementById("setup-note");

  function shortUrl(url) {
    return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  }

  if (contactList) {
    var contacts = [];

    if (CONFIG.email) contacts.push({ label: "Email", value: CONFIG.email, copy: CONFIG.email });
    if (CONFIG.phone) contacts.push({ label: "Phone", value: CONFIG.phone, copy: CONFIG.phone });
    if (CONFIG.upwork) contacts.push({ label: "Upwork", value: shortUrl(CONFIG.upwork), href: CONFIG.upwork });
    if (CONFIG.github) contacts.push({ label: "GitHub", value: shortUrl(CONFIG.github), href: CONFIG.github });
    if (CONFIG.linkedin) contacts.push({ label: "LinkedIn", value: "View profile", href: CONFIG.linkedin });
    if (CONFIG.cv) contacts.push({ label: "CV", value: "Download as PDF", href: CONFIG.cv, download: true });

    var copyStatus = document.getElementById("copy-status");

    var copyText = function (text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return legacyCopy(text); });
      }
      return Promise.resolve(legacyCopy(text));
    };

    var legacyCopy = function (text) {
      try {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(area);
        return ok;
      } catch (e) {
        return false;
      }
    };

    contacts.forEach(function (item) {
      var li = document.createElement("li");
      var el;
      var label = document.createElement("span");
      var value = document.createElement("span");

      label.className = "label";
      label.textContent = item.label;
      value.className = "value";
      value.textContent = item.value;

      if (item.copy) {
        el = document.createElement("button");
        el.type = "button";
        el.className = "is-copy";
        el.setAttribute("aria-label", "Copy " + item.label.toLowerCase() + ": " + item.copy);

        var timer = null;
        el.addEventListener("click", function () {
          copyText(item.copy).then(function (ok) {
            clearTimeout(timer);
            value.textContent = ok ? "Copied to clipboard" : "Copy failed, select and copy it manually";
            el.classList.toggle("is-copied", ok);
            if (copyStatus) copyStatus.textContent = ok ? item.label + " copied to clipboard" : "Copy failed";
            timer = setTimeout(function () {
              value.textContent = item.value;
              el.classList.remove("is-copied");
            }, 2000);
          });
        });
      } else {
        el = document.createElement("a");
        el.href = item.href;
        if (item.download) el.setAttribute("download", "");
        if (/^https?:/i.test(item.href)) {
          el.target = "_blank";
          el.rel = "noopener noreferrer";
        }
      }

      var text = document.createElement("span");
      text.appendChild(label);
      text.appendChild(value);
      el.appendChild(text);
      li.appendChild(el);
      contactList.appendChild(li);
    });

    if (setupNote) setupNote.hidden = contacts.length > 0;
  }
})();
