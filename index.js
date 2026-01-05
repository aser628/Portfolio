// 페이지 스크롤 & 점
const container = document.querySelector('.container');
const pages = document.querySelectorAll('.page');
const dots = document.querySelectorAll('.dots-nav span');

container.addEventListener('scroll', () => {
  pages.forEach((page, index) => {
    const rect = page.getBoundingClientRect();
    if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');
    }
  });
});

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    pages[index].scrollIntoView({ behavior: 'smooth' });
  });
});

// fade-in
const fades = document.querySelectorAll('.fade');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });
fades.forEach(el => observer.observe(el));

// 프로젝트 슬라이더
(function() {
  const slider = document.querySelector(".project-link.slider");
  if (!slider) return;

  const slidesContainer = slider.querySelector(".slides");
  const slides = Array.from(slidesContainer.querySelectorAll(".slide"));
  const prevBtn = slider.querySelector(".arrow.prev");
  const nextBtn = slider.querySelector(".arrow.next");
  const dotsContainer = slider.querySelector(".dots");
  let index = 0;
  let intervalId = null;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    slidesContainer.style.transform = `translateX(${-index * 100}%)`;
    updateDots();
  }

  function updateDots() {
    dotsContainer.querySelectorAll(".dot").forEach((d, i) => {
      d.classList.toggle("active", i === index);
    });
  }

  function createDots() {
  dotsContainer.innerHTML = ''; // 여기에 추가!
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.addEventListener("click", () => {
      goTo(i);
      resetAutoplay();
    });
    dotsContainer.appendChild(dot);
  });
}


  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAutoplay() {
    stopAutoplay();
    intervalId = setInterval(next, 4000);
  }

  function stopAutoplay() {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  }

  function resetAutoplay() { startAutoplay(); }

  prevBtn.addEventListener("click", () => { prev(); resetAutoplay(); });
  nextBtn.addEventListener("click", () => { next(); resetAutoplay(); });

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  createDots();
  goTo(0);
  startAutoplay();
})();
// ===== Figma Popup Control (MOA slide only) =====
(function () {
  const slider = document.querySelector(".project-link.slider");
  const figmaBtn = document.querySelector(".figma-btn");
  const modal = document.querySelector(".figma-modal");
  const backdrop = document.querySelector(".figma-backdrop");

  if (!slider || !figmaBtn || !modal || !backdrop) return;

  const slidesEl = slider.querySelector(".slides");

  function getCurrentIndex() {
    const transform = slidesEl.style.transform || "translateX(0%)";
    const match = transform.match(/-?\d+/);
    return match ? Math.abs(parseInt(match[0], 10)) / 100 : 0;
  }

  function updateButton() {
    const index = getCurrentIndex();
    // 🔥 MOA (두 번째 슬라이드)에서만 표시
    figmaBtn.style.display = index === 1 ? "flex" : "none";
  }

  // ===== OPEN =====
  figmaBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    modal.classList.add("active");
    backdrop.classList.add("active");
  });

  // ===== CLOSE =====
  function closeModal() {
    modal.classList.remove("active");
    backdrop.classList.remove("active");
  }

  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // 슬라이드 변경 감지
  const observer = new MutationObserver(updateButton);
  observer.observe(slidesEl, {
    attributes: true,
    attributeFilter: ["style"],
  });

  updateButton(); // 최초 1회
})();

