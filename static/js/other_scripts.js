document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('overlay');
  let menuOpen = false;

  // === Mobile Sidebar Toggle ===
  mobileBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.style.right = menuOpen ? '0' : '-70%';
    overlay.classList.toggle('hidden', !menuOpen);
  });

  overlay.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.style.right = '-70%';
    overlay.classList.add('hidden');
  });

  // === Language Toggles (Desktop & Mobile) ===
  const langToggle = document.getElementById('lang-toggle');
  const langLabel = document.getElementById('lang-label');
  const mobileLangToggle = document.getElementById('mobile-lang-toggle');
  const mobileLangLabel = document.getElementById('mobile-lang-label');

  // Sync UI updates
  function updateLanguage(isEnglish) {
    langLabel.textContent = isEnglish ? 'ENG' : 'TAMIL';
    mobileLangLabel.textContent = isEnglish ? 'ENG' : 'TAMIL';
    langToggle.checked = isEnglish;
    mobileLangToggle.checked = isEnglish;
  }

  // === Event Listeners ===
  langToggle.addEventListener('change', () => {
    updateLanguage(langToggle.checked);
  });

  mobileLangToggle.addEventListener('change', () => {
    updateLanguage(mobileLangToggle.checked);
  });

  // === Default Language: Tamil (gray switch) ===
  updateLanguage(false);
});


document.addEventListener("DOMContentLoaded", () => {
  // ==============================
  // 🌐 LANGUAGE TOGGLE SCRIPT
  // ==============================
  const desktopToggle = document.getElementById("lang-toggle");
  const desktopLabel  = document.getElementById("lang-label");
  const mobileToggle  = document.getElementById("mobile-lang-toggle");
  const mobileLabel   = document.getElementById("mobile-lang-label");

  // ✅ Load preference or default to Tamil
  let currentLang = localStorage.getItem("lang") || "ta";
  if (desktopToggle && mobileToggle) {
    if (currentLang === "en") {
      desktopToggle.checked = true;
      mobileToggle.checked = true;
    }

    updateLanguage(currentLang);

    function updateLanguage(lang) {
      document.querySelectorAll("[data-en]").forEach(el => {
        el.textContent = lang === "en" ? el.dataset.en : el.dataset.ta;
      });
      if (desktopLabel) desktopLabel.textContent = lang === "en" ? "ENG" : "தமிழ்";
      if (mobileLabel) mobileLabel.textContent = lang === "en" ? "ENG" : "தமிழ்";
      localStorage.setItem("lang", lang);
    }

    // 🔄 Sync both toggles
    desktopToggle.addEventListener("change", e => {
      const lang = e.target.checked ? "en" : "ta";
      mobileToggle.checked = e.target.checked;
      updateLanguage(lang);
    });

    mobileToggle.addEventListener("change", e => {
      const lang = e.target.checked ? "en" : "ta";
      desktopToggle.checked = e.target.checked;
      updateLanguage(lang);
    });
  }


});





// blog page js

document.addEventListener("DOMContentLoaded", () => {
  // ================================
  // 1️⃣ SLIDER LOGIC
  // ================================
  const slides = [
    document.getElementById("slide1"),
    document.getElementById("slide2"),
    document.getElementById("slide3")
  ];

  const progressBars = [
    document.getElementById("progress1"),
    document.getElementById("progress2"),
    document.getElementById("progress3")
  ];

  const progressContainers = Array.from(document.querySelectorAll("[data-index]"));

  if (slides.some(s => s === null) || progressBars.some(b => b === null) || progressContainers.length === 0) {
    console.warn("Slider: missing required DOM elements (slide/progress). Check IDs and data-index attributes.");
    return;
  }

  let current = 0;
  let autoSlideTimer = null;
  let progressTimer = null;

  function resetProgressBars() {
    progressBars.forEach(bar => bar && (bar.style.width = "0%"));
  }

  function clearTimers() {
    if (progressTimer) clearInterval(progressTimer);
    if (autoSlideTimer) clearTimeout(autoSlideTimer);
  }

  function showSlide(index) {
    index = ((index % slides.length) + slides.length) % slides.length;
    clearTimers();

    slides.forEach((slide, i) => {
      if (!slide) return;
      slide.style.opacity = i === index ? "1" : "0";
      slide.style.pointerEvents = i === index ? "auto" : "none";
    });

    resetProgressBars();

    const durationMs = 5000;
    const tickMs = 50;
    const step = 100 / (durationMs / tickMs);
    let width = 0;

    progressTimer = setInterval(() => {
      width += step;
      const pct = Math.min(100, width);
      if (progressBars[index]) progressBars[index].style.width = pct + "%";
      if (pct >= 100) clearInterval(progressTimer);
    }, tickMs);

    autoSlideTimer = setTimeout(() => {
      current = (index + 1) % slides.length;
      showSlide(current);
    }, durationMs);
  }

  progressContainers.forEach(container => {
    container.addEventListener("click", () => {
      const idx = parseInt(container.dataset.index, 10);
      if (!Number.isNaN(idx)) {
        current = idx;
        showSlide(current);
      }
    });
  });

  showSlide(current);

  // ================================
  // 2️⃣ SHARE POPUP LOGIC
  // ================================
  document.querySelectorAll(".share-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const popup = btn.nextElementSibling;
      document.querySelectorAll(".share-popup").forEach(p => {
        if (p !== popup) p.classList.add("hidden");
      });
      popup.classList.toggle("hidden");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".share-popup").forEach(p => p.classList.add("hidden"));
  });

  document.querySelectorAll(".share-popup button[data-platform]").forEach(opt => {
    opt.addEventListener("click", e => {
      e.stopPropagation();
      const container = opt.closest(".news-card, [data-title]");
      const title = container?.dataset.title || "Latest News";
      const description = container?.dataset.description?.slice(0, 120) || "";
      const detailPage = `${window.location.origin}blog_detail.html`;
      const message = `**${title}**\n\n${description}...\n\nRead more: ${detailPage}`;
      const encodedMessage = encodeURIComponent(message);
      let shareUrl = "";

      switch (opt.dataset.platform) {
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(detailPage)}&quote=${encodedMessage}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
          break;
        case "whatsapp":
          shareUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
          break;
        case "linkedin":
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(detailPage)}`;
          break;
        default:
          navigator.clipboard.writeText(message).then(() => alert("✅ Copied to clipboard"));
          return;
      }

      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");
      opt.closest(".share-popup")?.classList.add("hidden");
    });
  });

  // ================================
  // 3️⃣ OPEN DETAIL PAGE ON CLICK
  // ================================
  document.querySelectorAll(".news-card, article[data-title], [id^='slide']").forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.closest(".share-btn") || e.target.closest(".share-popup")) return;

      const title = card.dataset.title || "Untitled";
      const date = card.dataset.date || "";
      const image = card.dataset.image || "";
      const description = card.dataset.description || "";
      const category = card.dataset.category || "General";

      const content = `
        <p>${description}</p>
        <p class="mt-4">Stay tuned for more in-depth analysis and updates on this topic.</p>
      `;

      localStorage.setItem("selectedNews", JSON.stringify({ title, date, image, description, category, content }));
      window.location.href = "blog_detail.html";
    });
  });

  // ================================
  // 4️⃣ DETAIL PAGE LOADER
  // ================================
  const selectedNews = JSON.parse(localStorage.getItem("selectedNews"));
  if (selectedNews) {
    const titleEl = document.getElementById("news-title");
    const dateEl = document.getElementById("news-date");
    const descEl = document.getElementById("news-description");
    const imgEl = document.getElementById("news-image");
    const catEl = document.getElementById("news-category");
    const contentEl = document.getElementById("news-content");

    if (titleEl) titleEl.textContent = selectedNews.title;
    if (dateEl) dateEl.textContent = "Published: " + (selectedNews.date || "");
    if (descEl) descEl.textContent = selectedNews.description || "";
if (imgEl) {
  const imgPath = selectedNews.image;
  if (imgPath.startsWith("http")) {
    imgEl.src = imgPath;
  } else if (imgPath.startsWith("./") || imgPath.startsWith("static")) {
    imgEl.src = imgPath;
  } else {
    imgEl.src = "./" + imgPath.replace(/^\/+/, "");
  }
}

    if (catEl) catEl.innerHTML = 'Category: <span class="font-medium text-blue-600">' + (selectedNews.category || "General") + "</span>";
    if (contentEl) contentEl.innerHTML = selectedNews.content || "";

    // Detail page share buttons
    const detailUrl = window.location.href;
    const message = `**${selectedNews.title}**\n\n${(selectedNews.description || "").slice(0, 120)}...\n\nRead more: ${detailUrl}`;
    const encodedMessage = encodeURIComponent(message);

    document.querySelectorAll("button[data-platform]").forEach(btn => {
      btn.addEventListener("click", () => {
        let shareUrl = "";
        switch (btn.dataset.platform) {
          case "facebook":
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(detailUrl)}&quote=${encodedMessage}`;
            break;
          case "twitter":
            shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
            break;
          case "whatsapp":
            shareUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
            break;
          case "linkedin":
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(detailUrl)}`;
            break;
        }
        if (shareUrl) window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=500");
      });
    });
  }
});


// blog detail page js
document.addEventListener("DOMContentLoaded", function () {
  // 1️⃣ Get selected news data from localStorage
  const selectedNews = JSON.parse(localStorage.getItem("selectedNews"));

  // Default fallback (if nothing in localStorage)
  const defaultData = {
    title: "News Title Goes Here",
    description: "No description available",
    category: "General",
    date: "",
    image: "./static/images/default-news.jpg"
  };

  const news = selectedNews || defaultData;

  // 2️⃣ Fill detail page
  document.getElementById("news-title").textContent = news.title;
  document.getElementById("news-description").textContent = news.description;
  document.getElementById("news-date").textContent = news.date ? `Published: ${news.date}` : "";
  document.getElementById("news-category").innerHTML = `Category: <span class="font-medium text-blue-600">${news.category}</span>`;

  const imgEl = document.getElementById("news-image");
  imgEl.src = news.image || defaultData.image;
  imgEl.alt = news.title;

  // 3️⃣ SHARE BUTTONS
  const pageUrl = window.location.href;
  const shortDesc = news.description ? news.description.slice(0, 120) + "..." : "";

  // ✅ WhatsApp uses clean format (bold + line breaks)
  const whatsappMsg = `*${news.title}*\n\n${shortDesc}\n\nRead more: ${pageUrl}`;

  document.querySelectorAll("[data-platform]").forEach(btn => {
    btn.addEventListener("click", () => {
      const platform = btn.getAttribute("data-platform");
      const title = news.title;
      const desc = shortDesc;
      let shareUrl = "";

      if (platform === "facebook") {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(title + " - " + desc)}`;
      } else if (platform === "twitter") {
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title + " - " + desc)}&url=${encodeURIComponent(pageUrl)}`;
      } else if (platform === "whatsapp") {
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMsg)}`;
      } else if (platform === "linkedin") {
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(desc)}`;
      }

      window.open(shareUrl, "_blank", "width=600,height=500");
    });
  });
});


