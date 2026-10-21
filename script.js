/* ==========================================================================
   Portfolio script
   Fill in the CONFIG block below. Anything left empty ("") stays hidden,
   so the site never shows a dead link.
   ========================================================================== */

(function () {
  "use strict";

  var CONFIG = {
    email: "",      // e.g. "name@example.com"
    upwork: "",     // full URL of your Upwork profile
    github: "",     // e.g. "https://github.com/your-username"
    linkedin: "",   // full URL of your LinkedIn profile
    resume: "",     // e.g. "files/resume.pdf" (put the PDF in a files/ folder)

    // Link each project card to its code or live site. Leave "" to hide the link.
    repos: {
      "echo-notes": "",
      "light-novel-to-manga": "",
      "bridgepoint": "",
      "northwind-sql": "",
      "telco-churn": "",
      "sales-dashboard": ""
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

  /* ---------- Project links ---------- */

  document.querySelectorAll("a[data-repo]").forEach(function (a) {
    var url = CONFIG.repos[a.getAttribute("data-repo")];
    if (!url) return;
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.hidden = false;
  });

  /* ---------- Resume buttons ---------- */

  if (CONFIG.resume) {
    document.querySelectorAll("a[data-resume]").forEach(function (a) {
      a.href = CONFIG.resume;
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

    if (CONFIG.email) contacts.push({ label: "Email", value: CONFIG.email, href: "mailto:" + CONFIG.email });
    if (CONFIG.upwork) contacts.push({ label: "Upwork", value: shortUrl(CONFIG.upwork), href: CONFIG.upwork });
    if (CONFIG.github) contacts.push({ label: "GitHub", value: shortUrl(CONFIG.github), href: CONFIG.github });
    if (CONFIG.linkedin) contacts.push({ label: "LinkedIn", value: shortUrl(CONFIG.linkedin), href: CONFIG.linkedin });
    if (CONFIG.resume) contacts.push({ label: "Resume", value: "Download as PDF", href: CONFIG.resume });

    contacts.forEach(function (item) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      var label = document.createElement("span");
      var value = document.createElement("span");

      a.href = item.href;
      if (/^https?:/i.test(item.href)) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }

      label.className = "label";
      label.textContent = item.label;
      value.className = "value";
      value.textContent = item.value;

      a.appendChild(label);
      a.appendChild(value);
      li.appendChild(a);
      contactList.appendChild(li);
    });

    if (setupNote) setupNote.hidden = contacts.length > 0;
  }
})();
