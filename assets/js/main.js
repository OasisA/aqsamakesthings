// Small progressive enhancements. The site works fully without this file.
(function () {
  var doc = document.documentElement;

  // Mobile navigation toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        toggle.focus();
      }
    });
  }

  // Making page: stagger gallery photos into view
  document.querySelectorAll(".gallery figure").forEach(function (fig, i) {
    fig.classList.add("reveal");
    fig.style.transitionDelay = (i % 3) * 90 + "ms";
  });

  // Making page: tap a photo to view it larger
  var galleryImgs = Array.prototype.slice.call(document.querySelectorAll(".gallery img"));
  if (galleryImgs.length && typeof HTMLDialogElement === "function") {
    var dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.setAttribute("aria-label", "Photo viewer");
    dlg.innerHTML =
      '<figure class="lightbox-figure"><img alt=""><figcaption></figcaption></figure>' +
      '<p class="lightbox-count"></p>' +
      '<button type="button" class="lightbox-btn lightbox-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous photo">&larr;</button>' +
      '<button type="button" class="lightbox-btn lightbox-next" aria-label="Next photo">&rarr;</button>';
    document.body.appendChild(dlg);
    var lbImg = dlg.querySelector("img"), lbCap = dlg.querySelector("figcaption"), lbCount = dlg.querySelector(".lightbox-count");
    var current = 0, lastTrigger = null, currentGallery = null;
    function visibleImgs() {
      return galleryImgs.filter(function (im) { return im.closest(".gallery") === currentGallery && !im.closest("figure").hidden; });
    }
    function show(img) {
      currentGallery = img.closest(".gallery");
      var list = visibleImgs();
      current = list.indexOf(img);
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      var cap = img.closest("figure").querySelector("figcaption");
      lbCap.textContent = cap ? cap.textContent : "";
      lbCount.textContent = (current + 1) + " / " + list.length;
    }
    function step(d) { var list = visibleImgs(); show(list[(current + d + list.length) % list.length]); }
    galleryImgs.forEach(function (img) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "zoom-btn";
      btn.setAttribute("aria-label", "View larger: " + (img.closest("figure").querySelector("figcaption") || {}).textContent);
      img.parentNode.insertBefore(btn, img);
      btn.appendChild(img);
      btn.addEventListener("click", function () { lastTrigger = btn; show(img); dlg.showModal(); });
    });
    dlg.querySelector(".lightbox-close").addEventListener("click", function () { dlg.close(); });
    dlg.querySelector(".lightbox-prev").addEventListener("click", function () { step(-1); });
    dlg.querySelector(".lightbox-next").addEventListener("click", function () { step(1); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    });
    var touchX = null;
    dlg.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
      touchX = null;
    });
    dlg.addEventListener("close", function () { if (lastTrigger) lastTrigger.focus(); });
  }

  // Gentle reveal on scroll (CSS only animates when reduced motion is not requested)
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    doc.classList.add("motion");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Logo bar: pause / play button
  var mq = document.getElementById("logo-marquee");
  var mqBtn = document.querySelector(".marquee-toggle");
  if (mq && mqBtn) {
    mqBtn.addEventListener("click", function () {
      var paused = mq.classList.toggle("is-paused");
      mqBtn.setAttribute("aria-pressed", paused ? "true" : "false");
      mqBtn.textContent = paused ? "Play" : "Pause";
    });
  }

  // Case-study table of contents: highlight the section in view
  var tocLinks = document.querySelectorAll(".toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove("is-active"); a.removeAttribute("aria-current"); });
          var link = map[entry.target.id];
          if (link) { link.classList.add("is-active"); link.setAttribute("aria-current", "true"); }
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) so.observe(el);
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
