(function () {
  "use strict";

  var FONT_HREF =
    "https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;500;600;700&family=Fraunces:opsz,wght@32,500;32,600;32,700&family=Noto+Naskh+Arabic:wght@400;600;700&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;1,400&display=swap";

  var NAV = [
    ["home", "index.html", "Home"],
    ["history", "history.html", "History"],
    ["prophets", "prophets.html", "Prophets"],
    ["sahaba", "sahaba.html", "Sahaba"],
    ["places", "places.html", "Places"],
    ["architecture", "architecture.html", "Architecture"],
    ["scholars", "scholars.html", "Scholars"],
    ["quran", "quran.html", "Qur’an"],
    ["learn", "learn.html", "Learn"],
    ["gallery", "gallery.html", "Gallery"]
  ];

  var page = document.body.getAttribute("data-page") || "home";

  function navHtml() {
    return NAV.map(function (n) {
      var active = n[0] === page ? " class=\"active\"" : "";
      return "<li><a href=\"" + n[1] + "\" data-nav=\"" + n[0] + "\"" + active + ">" + n[2] + "</a></li>";
    }).join("");
  }

  function injectFonts() {
    if (document.querySelector("link[data-nur-fonts]")) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONT_HREF;
    l.setAttribute("data-nur-fonts", "1");
    document.head.appendChild(l);
  }

  function injectChrome() {
    injectFonts();
    var headerHost = document.querySelector("[data-site-header]");
    if (headerHost) {
      headerHost.outerHTML =
        '<header class="site-header">' +
        '<a class="skip-link" href="#main">Skip to content</a>' +
        '<div class="container">' +
        '<div class="topbar"><span data-hijri-date></span><span class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span></div>' +
        '<nav class="navbar" aria-label="Main">' +
        '<a class="logo" href="index.html"><span class="logo-mark">ن</span><span class="logo-text">SIRAT AL-AWWALIN<span>Islamic Heritage</span></span></a>' +
        '<ul class="nav-links">' + navHtml() + "</ul>" +
        '<button class="icon-btn" type="button" data-open-search aria-label="Search">⌕</button>' +
        '<button class="nav-toggle" aria-expanded="false" aria-label="Open menu"><span></span><span></span><span></span></button>' +
        "</nav></div></header>";
    }
    var footerHost = document.querySelector("[data-site-footer]");
    if (footerHost) {
      footerHost.outerHTML =
        '<footer class="site-footer"><div class="container footer-grid">' +
        "<div><h3>SIRAT AL-AWWALIN</h3><p>An educational museum of Islamic history and culture. Not a fatwa service. We do not depict the Prophets. Honorifics: ﷺ after Prophet Muhammad, peace be upon him after other Prophets, and رضي الله عنه / عنها after the Companions.</p></div>" +
        "<div><h3>Explore</h3><ul><li><a href=\"history.html\">History</a></li><li><a href=\"prophets.html\">Prophets</a></li><li><a href=\"quran.html\">Qur’an</a></li><li><a href=\"learn.html\">Learn</a></li></ul></div>" +
        "<div><h3>Collections</h3><ul><li><a href=\"places.html\">Places</a></li><li><a href=\"architecture.html\">Architecture</a></li><li><a href=\"sahaba.html\">Sahaba</a></li><li><a href=\"gallery.html\">Gallery</a></li></ul></div>" +
        "</div><p class=\"copyright\">© 2026 SIRAT AL-AWWALIN · Islamic Heritage · Photographs of buildings and landscapes only</p></footer>" +
        '<button class="back-to-top" type="button" aria-label="Back to top">↑</button>';
    }
  }

  injectChrome();

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  var backToTop = document.querySelector(".back-to-top");

  function closeMenu() {
    if (!toggle || !links) return;
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  window.addEventListener("scroll", function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
    if (backToTop) backToTop.classList.toggle("show", window.scrollY > 420);
  });

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );
    reveals.forEach(function (el) { observer.observe(el); });
    setTimeout(function () {
      reveals.forEach(function (el) {
        if (!el.classList.contains("visible")) el.classList.add("visible");
      });
    }, 2500);
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }

  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      img.style.background = "linear-gradient(160deg,#143528,#07140f)";
      img.alt = img.alt || "Heritage photograph";
    });
  });

  function toHijri(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var jd =
      Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
      Math.floor((367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12) -
      Math.floor((3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) / 4) +
      day - 32075;
    var l = jd - 1948440 + 10632;
    var n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    var j =
      Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
      Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
    l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
      Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    var m = Math.floor((24 * l) / 709);
    var d = l - Math.floor((709 * m) / 24);
    var y = 30 * n + j - 30;
    var months = [
      "Muharram", "Safar", "Rabiʿ al-Awwal", "Rabiʿ al-Thani", "Jumada al-Ula", "Jumada al-Thani",
      "Rajab", "Shaʿban", "Ramadan", "Shawwal", "Dhul-Qaʿdah", "Dhul-Hijjah"
    ];
    return d + " " + months[m - 1] + " " + y + " AH";
  }

  var hijriEl = document.querySelector("[data-hijri-date]");
  if (hijriEl) {
    var now = new Date();
    hijriEl.textContent =
      toHijri(now) + "  ·  " +
      now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  var slider = document.querySelector("[data-slider]");
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".slide"));
    var dotsWrap = slider.querySelector("[data-dots]");
    var index = 0;
    var timer;
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Show slide " + (i + 1));
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", function () { go(i); });
      dotsWrap.appendChild(dot);
    });
    function go(i) {
      slides[index].classList.remove("is-active");
      dotsWrap.children[index].classList.remove("active");
      index = (i + slides.length) % slides.length;
      slides[index].classList.add("is-active");
      dotsWrap.children[index].classList.add("active");
      restart();
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { go(index + 1); }, 6500);
    }
    var prev = slider.querySelector("[data-prev]");
    var next = slider.querySelector("[data-next]");
    if (prev) prev.addEventListener("click", function () { go(index - 1); });
    if (next) next.addEventListener("click", function () { go(index + 1); });
    restart();
  }

  var ayahBox = document.querySelector("[data-ayah]");
  var ayahList = [
    { arabic: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ", text: "Indeed, Allah commands justice and excellence.", ref: "An-Nahl 16:90" },
    { arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا", text: "And say: My Lord, increase me in knowledge.", ref: "Ta-Ha 20:114" },
    { arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ", text: "So remember Me; I will remember you.", ref: "Al-Baqarah 2:152" },
    { arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", text: "Surely in the remembrance of Allah do hearts find rest.", ref: "Ar-Raʿd 13:28" },
    { arabic: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ", text: "Cooperate in righteousness and piety.", ref: "Al-Maʾidah 5:2" },
    { arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", text: "Indeed, with hardship comes ease.", ref: "Ash-Sharh 94:6" }
  ];
  function renderAyah(item) {
    if (!ayahBox) return;
    ayahBox.innerHTML =
      '<p class="ayah-arabic">' + item.arabic + "</p>" +
      "<p style='text-align:center;margin-top:.6rem'>" + item.text + "</p>" +
      '<p class="ayah-meta">' + item.ref + "</p>";
  }
  if (ayahBox) {
    var pick = ayahList[new Date().getDate() % ayahList.length];
    renderAyah(pick);
    var dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    var ayahNum = (dayOfYear % 6236) + 1;
    fetch("https://api.alquran.cloud/v1/ayah/" + ayahNum + "/editions/quran-uthmani,en.asad")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !data.data || !data.data[0]) return;
        renderAyah({
          arabic: data.data[0].text,
          text: data.data[1] ? data.data[1].text : pick.text,
          ref: data.data[0].surah.englishName + " " + data.data[0].surah.number + ":" + data.data[0].numberInSurah
        });
      })
      .catch(function () {});
  }

  var prayerBox = document.querySelector("[data-prayer]");
  var citySelect = document.querySelector("[data-city]");
  var cities = {
    Karachi: { city: "Karachi", country: "Pakistan" },   
    Makkah: { city: "Makkah", country: "Saudi Arabia" },
    Madinah: { city: "Madinah", country: "Saudi Arabia" },
    Istanbul: { city: "Istanbul", country: "Turkey" },
    Cairo: { city: "Cairo", country: "Egypt" },
    Lahore: { city: "Lahore", country: "Pakistan" },
    Fez: { city: "Fes", country: "Morocco" },
    Jerusalem: { city: "Jerusalem", country: "Palestine" }
};

  function renderPrayer(timings, label) {
    if (!prayerBox) return;
    var keys = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    prayerBox.innerHTML =
      "<p class='eyebrow' style='color:#2a6b52'>Salah times · " + label + "</p>" +
      '<div class="prayer-grid">' +
      keys.map(function (k) {
        return "<div><span>" + k + "</span><strong>" + (timings[k] || "--").split(" ")[0] + "</strong></div>";
      }).join("") +
      "</div>";
  }

  function loadPrayer(name) {
    var c = cities[name] || cities.Makkah;
    renderPrayer({ Fajr: "--", Dhuhr: "--", Asr: "--", Maghrib: "--", Isha: "--" }, c.city);

    var method = c.method || 1;
    var school = c.school !== undefined ? c.school : 1;

    var url = "https://api.aladhan.com/v1/timingsByCity"
      + "?city=" + encodeURIComponent(c.city)
      + "&country=" + encodeURIComponent(c.country)
      + "&method=" + method
      + "&school=" + school;

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.data && data.data.timings) {
          var t = data.data.timings;
          var clean = {};
          ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].forEach(function (k) {
            var raw = (t[k] || "--").split(" ")[0]; // "(TZ)" hata do
            clean[k] = to12Hour(raw);
          });
          renderPrayer(clean, c.city);
        }
      })
      .catch(function () {
        renderPrayer({ Fajr: "4:50 AM", Dhuhr: "1:00 PM", Asr: "4:30 PM", Maghrib: "7:10 PM", Isha: "9:00 PM" }, c.city + " (sample)");
      });
}

// 24-hour "HH:MM" ko 12-hour "H:MM AM/PM" mein convert karta hai
function to12Hour(time24) {
    if (!time24 || time24 === "--") return "--";
    var parts = time24.split(":");
    if (parts.length < 2) return time24;

    var hours = parseInt(parts[0], 10);
    var minutes = parts[1];
    var ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    if (hours === 0) hours = 12; // 0 ya 12 ko "12" dikhana hai

    return hours + ":" + minutes + " " + ampm;
}

  if (prayerBox) {
    loadPrayer(citySelect ? citySelect.value : "Makkah");
    if (citySelect) {
      citySelect.addEventListener("change", function () { loadPrayer(citySelect.value); });
    }
  }

  var searchInput = document.querySelector("[data-search]");
  var chips = document.querySelectorAll("[data-filter]");
  var cards = document.querySelectorAll("[data-item]");
  var emptyState = document.querySelector("[data-empty]");
  var activeFilter = "all";

  function matches(card, query, filter) {
    var haystack = (card.getAttribute("data-item") || "").toLowerCase();
    var category = (card.getAttribute("data-category") || "all").toLowerCase();
    var text = (card.textContent || "").toLowerCase();
    var textMatch = !query || haystack.indexOf(query) !== -1 || text.indexOf(query) !== -1;
    var filterMatch = filter === "all" || category === filter;
    return textMatch && filterMatch;
  }

  function applyFilters() {
    if (!cards.length) return;
    var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var visible = 0;
    cards.forEach(function (card) {
      var show = matches(card, query, activeFilter);
      card.classList.toggle("hidden", !show);
      if (show) visible += 1;
    });
    if (emptyState) emptyState.classList.toggle("hidden", visible !== 0);
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      activeFilter = chip.getAttribute("data-filter") || "all";
      applyFilters();
    });
  });

  var lightbox = document.querySelector(".lightbox");
  var lightboxImg = document.querySelector(".lightbox img");
  var lightboxCaption = document.querySelector(".lightbox p");
  var galleryItems = [];
  var currentIndex = 0;

  function visibleGalleryItems() {
    return Array.prototype.slice.call(document.querySelectorAll(".gallery-item")).filter(function (item) {
      return !item.classList.contains("hidden");
    });
  }

  function openLightbox(i) {
    galleryItems = visibleGalleryItems();
    if (!lightbox || !galleryItems.length || i < 0) return;
    currentIndex = i;
    var item = galleryItems[currentIndex];
    var img = item.querySelector("img");
    lightboxImg.src = img.getAttribute("src");
    lightboxImg.alt = img.getAttribute("alt") || "";
    lightboxCaption.textContent = item.querySelector("figcaption")
      ? item.querySelector("figcaption").textContent : "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  function stepLightbox(dir) {
    if (!galleryItems.length) return;
    currentIndex = (currentIndex + dir + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  }

  document.querySelectorAll(".gallery-item").forEach(function (item) {
    item.addEventListener("click", function () {
      openLightbox(visibleGalleryItems().indexOf(item));
    });
    item.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(visibleGalleryItems().indexOf(item));
      }
    });
  });

  if (lightbox) {
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-nav.prev");
    var nextBtn = lightbox.querySelector(".lightbox-nav.next");
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (prevBtn) prevBtn.addEventListener("click", function () { stepLightbox(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { stepLightbox(1); });
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
      var modal = document.querySelector(".search-modal");
      if (modal) modal.classList.remove("open");
    }
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (event.key === "ArrowLeft") stepLightbox(-1);
    if (event.key === "ArrowRight") stepLightbox(1);
  });

  var catalog = [
    { t: "Makkah and the Kaaba", u: "places.html" },
    { t: "Madinah and Al-Masjid an-Nabawi", u: "places.html" },
    { t: "Masjid al-Aqsa", u: "places.html" },
    { t: "Islamic History Timeline", u: "history.html" },
    { t: "The 25 Prophets named in the Qur’an", u: "prophets.html" },
    { t: "Prophet Muhammad ﷺ", u: "prophets.html" },
    { t: "Ibrahim (peace be upon him)", u: "prophets.html" },
    { t: "Musa (peace be upon him)", u: "prophets.html" },
    { t: "Isa (peace be upon him)", u: "prophets.html" },
    { t: "Sahaba — the Companions", u: "sahaba.html" },
    { t: "Abu Bakr as-Siddiq رضي الله عنه", u: "sahaba.html" },
    { t: "ʿUmar ibn al-Khattab رضي الله عنه", u: "sahaba.html" },
    { t: "Islamic Architecture", u: "architecture.html" },
    { t: "Scholars and sciences", u: "scholars.html" },
    { t: "Imam al-Bukhari", u: "scholars.html" },
    { t: "Read the Qur’an", u: "quran.html" },
    { t: "Heritage Gallery", u: "gallery.html" },
    { t: "Five Pillars, Names, Qibla & Quiz", u: "learn.html" }
  ];

  var openSearch = document.querySelector("[data-open-search]");
  if (openSearch) {
    var modal = document.createElement("div");
    modal.className = "search-modal";
    modal.innerHTML =
      '<input type="search" placeholder="Search: Kaaba, Musa, Bukhari, qibla…" aria-label="Site search">' +
      '<div class="search-results"></div>';
    document.body.appendChild(modal);
    var input = modal.querySelector("input");
    var results = modal.querySelector(".search-results");
    function paint(q) {
      var list = catalog.filter(function (x) {
        return !q || x.t.toLowerCase().indexOf(q) !== -1;
      });
      results.innerHTML = list.map(function (x) {
        return '<a href="' + x.u + '">' + x.t + "</a>";
      }).join("") || "<p class='empty-state'>No matching pages.</p>";
    }
    openSearch.addEventListener("click", function () {
      modal.classList.add("open");
      paint("");
      input.value = "";
      input.focus();
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.classList.remove("open");
    });
    input.addEventListener("input", function () {
      paint(input.value.trim().toLowerCase());
    });
  }

  var pillarCards = document.querySelectorAll("[data-pillar]");
  var pillarDetail = document.querySelector("[data-pillar-detail]");
  var pillarText = {
    shahada: "<strong>Shahadah</strong> — the testimony that there is no god but Allah, and Muhammad ﷺ is His Messenger. It is the door of Islam and the heart of tawhid.",
    salah: "<strong>Salah</strong> — five daily prayers facing the Kaaba in Makkah. It structures the day around remembrance, from Fajr before dawn to ʿIsha at night.",
    zakat: "<strong>Zakat</strong> — a purifying due on wealth given to those eligible. It is worship through justice, not optional charity alone.",
    sawm: "<strong>Sawm</strong> — fasting in Ramadan from dawn to sunset. It trains patience, gratitude, and empathy with the hungry.",
    hajj: "<strong>Hajj</strong> — pilgrimage to Makkah once in a lifetime if able. Ihram, tawaf, saʿi, and ʿArafah gather the ummah around the legacy of Ibrahim (peace be upon him)."
  };
  pillarCards.forEach(function (card) {
    card.addEventListener("click", function () {
      pillarCards.forEach(function (c) { c.classList.remove("active"); });
      card.classList.add("active");
      if (pillarDetail) pillarDetail.innerHTML = pillarText[card.getAttribute("data-pillar")] || "";
    });
  });
  if (pillarCards.length && pillarDetail) {
    pillarCards[0].classList.add("active");
    pillarDetail.innerHTML = pillarText[pillarCards[0].getAttribute("data-pillar")];
  }

  var ASMA = [
    ["الرحمن", "Ar-Rahman", "The Most Merciful"],
    ["الرحيم", "Ar-Rahim", "The Especially Merciful"],
    ["الملك", "Al-Malik", "The King"],
    ["القدوس", "Al-Quddus", "The Holy"],
    ["السلام", "As-Salam", "The Source of Peace"],
    ["المؤمن", "Al-Muʾmin", "The Granter of Security"],
    ["المهيمن", "Al-Muhaymin", "The Guardian"],
    ["العزيز", "Al-ʿAziz", "The Almighty"],
    ["الجبار", "Al-Jabbar", "The Compeller"],
    ["المتكبر", "Al-Mutakabbir", "The Supreme"],
    ["الخالق", "Al-Khaliq", "The Creator"],
    ["البارئ", "Al-Bariʾ", "The Evolver"],
    ["المصور", "Al-Musawwir", "The Fashioner"],
    ["الغفار", "Al-Ghaffar", "The Repeatedly Forgiving"],
    ["القهار", "Al-Qahhar", "The Subduer"],
    ["الوهاب", "Al-Wahhab", "The Bestower"],
    ["الرزاق", "Ar-Razzaq", "The Provider"],
    ["الفتاح", "Al-Fattah", "The Opener"],
    ["العليم", "Al-ʿAlim", "The All-Knowing"],
    ["القابض", "Al-Qabid", "The Withholder"],
    ["الباسط", "Al-Basit", "The Extender"],
    ["الخافض", "Al-Khafid", "The Abaser"],
    ["الرافع", "Ar-Rafiʿ", "The Exalter"],
    ["المعز", "Al-Muʿizz", "The Giver of Honour"],
    ["المذل", "Al-Mudhill", "The Giver of Dishonour"],
    ["السميع", "As-Samiʿ", "The All-Hearing"],
    ["البصير", "Al-Basir", "The All-Seeing"],
    ["الحكم", "Al-Hakam", "The Judge"],
    ["العدل", "Al-ʿAdl", "The Just"],
    ["اللطيف", "Al-Latif", "The Subtle"],
    ["الخبير", "Al-Khabir", "The All-Aware"],
    ["الحليم", "Al-Halim", "The Forbearing"],
    ["العظيم", "Al-ʿAzim", "The Magnificent"],
    ["الغفور", "Al-Ghafur", "The Forgiving"],
    ["الشكور", "Ash-Shakur", "The Appreciative"],
    ["العلي", "Al-ʿAli", "The Most High"],
    ["الكبير", "Al-Kabir", "The Greatest"],
    ["الحفيظ", "Al-Hafiz", "The Preserver"],
    ["المقيت", "Al-Muqit", "The Nourisher"],
    ["الحسيب", "Al-Hasib", "The Reckoner"],
    ["الجليل", "Al-Jalil", "The Majestic"],
    ["الكريم", "Al-Karim", "The Generous"],
    ["الرقيب", "Ar-Raqib", "The Watchful"],
    ["المجيب", "Al-Mujib", "The Responsive"],
    ["الواسع", "Al-Wasiʿ", "The All-Encompassing"],
    ["الحكيم", "Al-Hakim", "The Wise"],
    ["الودود", "Al-Wadud", "The Most Loving"],
    ["المجيد", "Al-Majid", "The Glorious"],
    ["الباعث", "Al-Baʿith", "The Resurrector"],
    ["الشهيد", "Ash-Shahid", "The Witness"],
    ["الحق", "Al-Haqq", "The Truth"],
    ["الوكيل", "Al-Wakil", "The Trustee"],
    ["القوي", "Al-Qawiyy", "The Strong"],
    ["المتين", "Al-Matin", "The Firm"],
    ["الولي", "Al-Waliyy", "The Protecting Friend"],
    ["الحميد", "Al-Hamid", "The Praiseworthy"],
    ["المحصي", "Al-Muhsi", "The Accounter"],
    ["المبدئ", "Al-Mubdiʾ", "The Originator"],
    ["المعيد", "Al-Muʿid", "The Restorer"],
    ["المحيي", "Al-Muhyi", "The Giver of Life"],
    ["المميت", "Al-Mumit", "The Giver of Death"],
    ["الحي", "Al-Hayy", "The Ever-Living"],
    ["القيوم", "Al-Qayyum", "The Self-Subsisting"],
    ["الواجد", "Al-Wajid", "The Finder"],
    ["الماجد", "Al-Majid", "The Noble"],
    ["الواحد", "Al-Wahid", "The One"],
    ["الاحد", "Al-Ahad", "The Unique"],
    ["الصمد", "As-Samad", "The Eternal Refuge"],
    ["القادر", "Al-Qadir", "The Able"],
    ["المقتدر", "Al-Muqtadir", "The Powerful"],
    ["المقدم", "Al-Muqaddim", "The Expediter"],
    ["المؤخر", "Al-Muʾakhkhir", "The Delayer"],
    ["الأول", "Al-Awwal", "The First"],
    ["الآخر", "Al-Akhir", "The Last"],
    ["الظاهر", "Az-Zahir", "The Manifest"],
    ["الباطن", "Al-Batin", "The Hidden"],
    ["الوالي", "Al-Wali", "The Governor"],
    ["المتعالي", "Al-Mutaʿali", "The Most Exalted"],
    ["البر", "Al-Barr", "The Source of Goodness"],
    ["التواب", "At-Tawwab", "The Accepter of Repentance"],
    ["المنتقم", "Al-Muntaqim", "The Avenger"],
    ["العفو", "Al-ʿAfuww", "The Pardoner"],
    ["الرؤوف", "Ar-Raʾuf", "The Kind"],
    ["مالك الملك", "Malik-ul-Mulk", "Owner of Sovereignty"],
    ["ذو الجلال والإكرام", "Dhul-Jalali wal-Ikram", "Lord of Majesty and Honour"],
    ["المقسط", "Al-Muqsit", "The Equitable"],
    ["الجامع", "Al-Jamiʿ", "The Gatherer"],
    ["الغني", "Al-Ghaniyy", "The Self-Sufficient"],
    ["المغني", "Al-Mughni", "The Enricher"],
    ["المانع", "Al-Maniʿ", "The Preventer"],
    ["الضار", "Ad-Darr", "The Distresser"],
    ["النافع", "An-Nafiʿ", "The Benefiter"],
    ["النور", "An-Nur", "The Light"],
    ["الهادي", "Al-Hadi", "The Guide"],
    ["البديع", "Al-Badiʿ", "The Incomparable"],
    ["الباقي", "Al-Baqi", "The Everlasting"],
    ["الوارث", "Al-Warith", "The Inheritor"],
    ["الرشيد", "Ar-Rashid", "The Guide to the Right Path"],
    ["الصبور", "As-Sabur", "The Patient"]
  ];

  var namesBox = document.querySelector("[data-names]");
  if (namesBox) {
    var ni = 0;
    function showName() {
      var n = ASMA[ni];
      namesBox.innerHTML =
        '<p class="names-arabic">' + n[0] + "</p>" +
        "<h3 style='text-align:center'>" + n[1] + "</h3>" +
        "<p style='text-align:center;color:var(--muted)'>" + n[2] + "</p>" +
        "<p class='ayah-meta'>" + (ni + 1) + " / 99</p>";
    }
    showName();
    var nextName = document.querySelector("[data-next-name]");
    var prevName = document.querySelector("[data-prev-name]");
    if (nextName) nextName.addEventListener("click", function () { ni = (ni + 1) % ASMA.length; showName(); });
    if (prevName) prevName.addEventListener("click", function () { ni = (ni - 1 + ASMA.length) % ASMA.length; showName(); });
  }

  var namesGrid = document.querySelector("[data-names-grid]");
  if (namesGrid) {
    namesGrid.innerHTML = ASMA.map(function (n, i) {
      return '<button class="name-chip" type="button" data-name-i="' + i + '"><div class="ar">' + n[0] + "</div><div>" + n[1] + "</div></button>";
    }).join("");
    namesGrid.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-name-i]");
      if (!btn) return;
      namesGrid.querySelectorAll(".name-chip").forEach(function (c) { c.classList.remove("active"); });
      btn.classList.add("active");
      var n = ASMA[Number(btn.getAttribute("data-name-i"))];
      var out = document.querySelector("[data-name-detail]");
      if (out) out.innerHTML = "<p class='names-arabic'>" + n[0] + "</p><h3 style='text-align:center'>" + n[1] + "</h3><p style='text-align:center;color:var(--muted)'>" + n[2] + "</p>";
    });
  }

  var countEl = document.querySelector("[data-tasbih]");
  if (countEl) {
    var count = 0;
    var phrases = [
      ["سُبْحَانَ اللَّهِ", "SubhanAllah — Glory be to Allah"],
      ["الْحَمْدُ لِلَّهِ", "Alhamdulillah — All praise is for Allah"],
      ["اللَّهُ أَكْبَرُ", "Allahu Akbar — Allah is the Greatest"]
    ];
    var pi = 0;
    var tap = document.querySelector("[data-tasbih-tap]");
    var reset = document.querySelector("[data-tasbih-reset]");
    var phraseEl = document.querySelector("[data-tasbih-phrase]");
    function paintCount() {
      countEl.textContent = String(count);
      if (phraseEl) {
        phraseEl.innerHTML = phrases[pi][0] + "<br><span style='font-family:var(--font-body);font-size:.9rem;color:var(--muted)'>" + phrases[pi][1] + "</span>";
      }
    }
    paintCount();
    if (tap) tap.addEventListener("click", function () {
      count += 1;
      if (count % 33 === 0 && count > 0) pi = (pi + 1) % phrases.length;
      paintCount();
    });
    if (reset) reset.addEventListener("click", function () { count = 0; pi = 0; paintCount(); });
  }

  var quizRoot = document.querySelector("[data-quiz]");
  if (quizRoot) {
    var questions = [
      { q: "What is the qiblah of Muslim prayer?", a: ["The Kaaba in Makkah", "The Green Dome", "Al-Aqsa only", "Any mosque"], c: 0 },
      { q: "In which year CE did the Hijrah take place?", a: ["570", "610", "622", "632"], c: 2 },
      { q: "How many prophets are named in the Qur’an?", a: ["12", "25", "40", "99"], c: 1 },
      { q: "Who compiled Sahih al-Bukhari?", a: ["Imam Malik", "Imam al-Bukhari", "Ibn Sina", "Ibn Khaldun"], c: 1 },
      { q: "The third mosque of special merit in a well-known hadith is?", a: ["Blue Mosque", "Badshahi Mosque", "Masjid al-Aqsa", "Quba only"], c: 2 },
      { q: "Who is called Khalil Allah in Islamic tradition?", a: ["Musa (peace be upon him)", "Ibrahim (peace be upon him)", "Yusuf (peace be upon him)", "Nuh (peace be upon him)"], c: 1 },
      { q: "The first caliph after Prophet Muhammad ﷺ was?", a: ["ʿUmar ibn al-Khattab رضي الله عنه", "Abu Bakr as-Siddiq رضي الله عنه", "ʿUthman ibn ʿAffan رضي الله عنه", "ʿAli ibn Abi Talib رضي الله عنه"], c: 1 }
    ];
    var qi = 0;
    var score = 0;
    function draw() {
      if (qi >= questions.length) {
        quizRoot.innerHTML = "<h3>Your score: " + score + " / " + questions.length + "</h3><p>Walk the History, Prophets, and Places pages to go deeper.</p><button class='btn btn-gold' type='button' data-quiz-restart>Try again</button>";
        quizRoot.querySelector("[data-quiz-restart]").addEventListener("click", function () {
          qi = 0; score = 0; draw();
        });
        return;
      }
      var item = questions[qi];
      quizRoot.innerHTML = "<p class='eyebrow' style='color:#2a6b52'>Question " + (qi + 1) + " of " + questions.length + "</p><h3>" + item.q + "</h3>";
      item.a.forEach(function (opt, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "quiz-option";
        b.textContent = opt;
        b.addEventListener("click", function () {
          if (i === item.c) { b.classList.add("correct"); score += 1; }
          else { b.classList.add("wrong"); }
          setTimeout(function () { qi += 1; draw(); }, 650);
        });
        quizRoot.appendChild(b);
      });
    }
    draw();
  }

  function qiblaDeg(lat, lon) {
    var mkLat = 21.422487 * Math.PI / 180;
    var mkLon = 39.826206 * Math.PI / 180;
    var p = lat * Math.PI / 180;
    var l = lon * Math.PI / 180;
    var dL = mkLon - l;
    var y = Math.sin(dL);
    var x = Math.cos(p) * Math.tan(mkLat) - Math.sin(p) * Math.cos(dL);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  }

  var qiblaBox = document.querySelector("[data-qibla]");
  if (qiblaBox) {
    qiblaBox.innerHTML =
      "<p class='eyebrow' style='color:#2a6b52'>Qibla finder</p>" +
      "<div class='qibla-compass'><div class='qibla-needle' data-needle></div><div class='qibla-center'>Kaaba</div></div>" +
      "<p style='text-align:center' data-qibla-text>Allow location to point toward Makkah.</p>" +
      "<div class='hero-actions'><button class='btn btn-gold' type='button' data-qibla-ask>Find my qibla</button></div>";
    var needle = qiblaBox.querySelector("[data-needle]");
    var text = qiblaBox.querySelector("[data-qibla-text]");
    function applyQibla(lat, lon) {
      var deg = qiblaDeg(lat, lon);
      needle.style.transform = "rotate(" + deg + "deg)";
      text.textContent = "Qibla from your location: " + Math.round(deg) + "° from true north (toward the Kaaba in Makkah).";
    }
    qiblaBox.querySelector("[data-qibla-ask]").addEventListener("click", function () {
      if (!navigator.geolocation) {
        applyQibla(31.52, 74.358); // Lahore sample
        text.textContent += " (sample: Lahore)";
        return;
      }
      navigator.geolocation.getCurrentPosition(
        function (pos) { applyQibla(pos.coords.latitude, pos.coords.longitude); },
        function () {
          applyQibla(31.52, 74.358);
          text.textContent = "Location blocked — showing sample qibla for Lahore: " + Math.round(qiblaDeg(31.52, 74.358)) + "° from north.";
        }
      );
    });
  }

  var surahSelect = document.querySelector("[data-surah]");
  var quranOut = document.querySelector("[data-quran]");
  if (surahSelect && quranOut) {
    for (var s = 1; s <= 114; s++) {
      var opt = document.createElement("option");
      opt.value = String(s);
      opt.textContent = "Surah " + s;
      surahSelect.appendChild(opt);
    }
    function loadSurah(num) {
      quranOut.innerHTML = "<p class='empty-state'>Loading the Uthmani text…</p>";
      fetch("https://api.alquran.cloud/v1/surah/" + num + "/editions/quran-uthmani,en.asad")
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data || !data.data) throw new Error("empty");
          var ar = data.data[0];
          var en = data.data[1];
          var title = ar.englishName + " · " + ar.name + " · " + ar.numberOfAyahs + " ayahs";
          var ayahs = ar.ayahs.map(function (a, i) {
            var tr = en && en.ayahs[i] ? en.ayahs[i].text : "";
            return "<article class='quran-ayah'><p class='ar'>" + a.text + " ﴿" + a.numberInSurah + "﴾</p><p class='en'>" + tr + "</p></article>";
          }).join("");
          quranOut.innerHTML = "<h3 style='margin-bottom:1rem;font-family:var(--font-display)'>" + title + "</h3>" + ayahs;
        })
        .catch(function () {
          quranOut.innerHTML = "<p class='note'>Could not load from the Qur’an API. Check your connection and try again. The Arabic text is never invented on this site.</p>";
        });
    }
    surahSelect.addEventListener("change", function () { loadSurah(surahSelect.value); });
    loadSurah(1);
  }

  var convOut = document.querySelector("[data-hijri-convert]");
  var convIn = document.querySelector("[data-gregorian]");
  if (convOut && convIn) {
    function paintConv() {
      var d = new Date(convIn.value);
      if (isNaN(d.getTime())) d = new Date();
      convOut.textContent = toHijri(d);
    }
    if (!convIn.value) {
      var t = new Date();
      convIn.value = t.toISOString().slice(0, 10);
    }
    convIn.addEventListener("change", paintConv);
    paintConv();
  }
})();
