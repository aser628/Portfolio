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
  const prevBtn = slider.querySelector(".prev");
  const nextBtn = slider.querySelector(".next");
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
    dotsContainer.innerHTML = '';
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

// Figma Popup Control (MOA slide only)
(function () {
  const slider = document.querySelector(".project-link.slider");
  const figmaBtn = document.querySelector(".figma-btn");
  const modal = document.querySelector(".figma-modal");
  const backdrop = document.querySelector(".figma-backdrop");
  const closeBtn = document.querySelector(".figma-close");

  if (!slider || !figmaBtn || !modal || !backdrop) return;

  const slidesEl = slider.querySelector(".slides");

  function getCurrentIndex() {
    const transform = slidesEl.style.transform || "translateX(0%)";
    const match = transform.match(/-?\d+/);
    return match ? Math.abs(parseInt(match[0], 10)) / 100 : 0;
  }

  function updateButton() {
    const index = getCurrentIndex();
    figmaBtn.style.display = index === 1 ? "flex" : "none";
  }

  figmaBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    modal.classList.add("active");
    backdrop.classList.add("active");
    // set link inside modal to point to the figma URL from the button (if provided)
    const figmaOpenLink = modal.querySelector('.poster-figma-open-link');
    if (figmaOpenLink && figmaBtn.dataset && figmaBtn.dataset.figmaUrl) {
      figmaOpenLink.href = figmaBtn.dataset.figmaUrl;
    }
  });

  function closeModal() {
    modal.classList.remove("active");
    backdrop.classList.remove("active");
  }

  backdrop.addEventListener("click", closeModal);
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  const observer = new MutationObserver(updateButton);
  observer.observe(slidesEl, {
    attributes: true,
    attributeFilter: ["style"],
  });

  updateButton();
})();

// ===== Artwork Book Flip Effect =====
(function() {
  const slider = document.querySelector(".artwork-slider");
  if (!slider) {
    console.log("artwork-slider를 찾을 수 없습니다!");
    return;
  }

  const slidesContainer = slider.querySelector(".artwork-slides");
  if (!slidesContainer) {
    console.log("artwork-slides를 찾을 수 없습니다!");
    return;
  }

  const slides = Array.from(slidesContainer.querySelectorAll(".artwork-slide"));
  if (slides.length === 0) {
    console.log("artwork-slide를 찾을 수 없습니다!");
    return;
  }

  const clickBubble = slider.querySelector(".click-bubble");
  const resetButton = slider.querySelector(".reset-button");
  console.log(`총 ${slides.length}개의 슬라이드를 찾았습니다!`);
  
  let currentPage = 0;

  // 초기 z-index 설정
  slides.forEach((slide, i) => {
    slide.style.zIndex = slides.length - i;
  });

  function updatePages() {
    slides.forEach((slide, i) => {
      if (i < currentPage) {
        slide.classList.add("flipped");
        slide.style.zIndex = i + 1;
      } else {
        slide.classList.remove("flipped");
        slide.style.zIndex = slides.length - i;
      }
    });

    // 마지막 페이지면 "처음으로" 버튼 표시
    if (currentPage === slides.length) {
      if (resetButton) resetButton.classList.add("show");
    } else {
      if (resetButton) resetButton.classList.remove("show");
    }
  }

  // 슬라이더 클릭
  slider.addEventListener("click", (e) => {
    // 버튼 클릭은 무시
    if (e.target.closest('.reset-button')) return;
    
    console.log("클릭됨! 현재 페이지:", currentPage);
    
    // 첫 클릭 시 말풍선 숨기기
    if (clickBubble && currentPage === 0) {
      clickBubble.classList.add("hidden");
    }
    
    if (currentPage < slides.length) {
      currentPage++;
      updatePages();
    }
  });

  // 처음으로 버튼 클릭
  if (resetButton) {
    resetButton.addEventListener("click", (e) => {
      e.stopPropagation();
      currentPage = 0;
      updatePages();
      // 말풍선 다시 표시
      if (clickBubble) {
        clickBubble.classList.remove("hidden");
      }
    });
  }

  updatePages();
})();

// ===== Album Preview Popup =====
(function() {
  const previewBtns = document.querySelectorAll('.album-preview-btn');
  
  previewBtns.forEach(btn => {
    const popup = btn.nextElementSibling;
    
    if (!popup || !popup.classList.contains('album-popup')) return;
    
    // 버튼에 마우스 올리면 팝업 표시
    btn.addEventListener('mouseenter', (e) => {
      e.stopPropagation();
      popup.classList.add('active');
    });
    
    // 버튼에서 마우스 떠나면 팝업 숨김
    btn.addEventListener('mouseleave', (e) => {
      e.stopPropagation();
      popup.classList.remove('active');
    });
    
    // 팝업에 마우스 올려도 유지
    popup.addEventListener('mouseenter', (e) => {
      e.stopPropagation();
      popup.classList.add('active');
    });
    
    // 팝업에서 마우스 떠나면 숨김
    popup.addEventListener('mouseleave', (e) => {
      e.stopPropagation();
      popup.classList.remove('active');
    });
    
    // 버튼/팝업 클릭 시 책넘김 방지
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    popup.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
})();

// ===== Card News Mobile Slider =====
(function() {
  const slider = document.querySelector('.cardnews-slider');
  if (!slider) {
    console.log('cardnews-slider를 찾을 수 없습니다!');
    return;
  }

  const track = slider.querySelector('.cardnews-slider-track');
  const items = Array.from(track.querySelectorAll('.cardnews-slider-item'));
  const prevBtn = slider.querySelector('.cardnews-prev');
  const nextBtn = slider.querySelector('.cardnews-next');
  const dotsContainer = slider.querySelector('.cardnews-dots');
  let index = 0;

  console.log(`카드뉴스 슬라이더: ${items.length}개 아이템 발견`);

  function goTo(i) {
    index = (i + items.length) % items.length;
    track.style.transform = `translateX(${-index * 100}%)`;
    updateDots();
  }

  function prev() {
    goTo(index - 1);
  }

  function next() {
    goTo(index + 1);
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot';
      dot.type = 'button';
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    const dots = Array.from(dotsContainer.children);
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  createDots();
  goTo(0);
})();

// ===== Poster Mobile Slider =====
(function() {
  const slider = document.querySelector('.poster-slider');
  if (!slider) return;

  const track = slider.querySelector('.poster-slider-track');
  const slides = Array.from(track.querySelectorAll('.poster-slide'));
  const prevBtn = slider.querySelector('.poster-prev');
  const nextBtn = slider.querySelector('.poster-next');
  const dotsContainer = slider.querySelector('.poster-dots');
  let index = 0;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(${-index * 100}%)`;
    updateDots();
  }

  function prev() {
    goTo(index - 1);
  }

  function next() {
    goTo(index + 1);
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot';
      dot.type = 'button';
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    const dots = Array.from(dotsContainer.children);
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  createDots();
  goTo(0);
})();

// ===== Poster Figma Popup =====
(function() {
  const figmaBtn = document.querySelector('.poster-figma-btn-top');
  const modal = document.querySelector('.poster-figma-modal');
  const backdrop = document.querySelector('.poster-figma-backdrop');
  const closeBtn = document.querySelector('.poster-figma-close');

  if (!figmaBtn || !modal || !backdrop) return;


  figmaBtn.addEventListener('click', () => {
    // set modal link and optional preview image from data attributes
    const figmaOpenLink = modal.querySelector('.poster-figma-open-link');
    const previewImg = modal.querySelector('.poster-figma-preview');
    if (figmaOpenLink && figmaBtn.dataset && figmaBtn.dataset.figmaUrl) {
      figmaOpenLink.href = figmaBtn.dataset.figmaUrl;
    }
    if (previewImg && figmaBtn.dataset && figmaBtn.dataset.preview) {
      previewImg.src = figmaBtn.dataset.preview;
    }

    modal.classList.add('active');
    backdrop.classList.add('active');
    backdrop.setAttribute('aria-hidden', 'false');
  });

  // Allow clicking individual poster slides to open modal with that slide's image and link
  const posterSliderEl = document.querySelector('.poster-slider');
  if (posterSliderEl) {
    const posterSlides = Array.from(posterSliderEl.querySelectorAll('.poster-slide'));
    posterSlides.forEach(slide => {
      slide.addEventListener('click', (e) => {
        // if the click target is a button inside slide, ignore
        if (e.target.closest('button')) return;

        const previewImg = modal.querySelector('.poster-figma-preview');
        const openLink = modal.querySelector('.poster-figma-open-link');
        const img = slide.querySelector('img');

        if (previewImg && img && img.src) previewImg.src = img.src;

        // slide-specific figma link (data-figma-url) takes precedence
        const slideFigma = slide.dataset && slide.dataset.figmaUrl;
        if (openLink) {
          openLink.href = slideFigma || (figmaBtn.dataset && figmaBtn.dataset.figmaUrl) || '#';
        }

        modal.classList.add('active');
        backdrop.classList.add('active');
        backdrop.setAttribute('aria-hidden', 'false');
      });
    });
  }

  function closeModal() {
    modal.classList.remove('active');
    backdrop.classList.remove('active');
  }

  backdrop.addEventListener('click', closeModal);
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
})();

// ===== Hero 텍스트 애니메이션 (moved from inline) =====
(function() {
  const textWrapper = document.querySelector('.ml1');
  if (!textWrapper) return;
  textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

  if (typeof anime !== 'undefined') {
    anime.timeline({ loop: true }).add({
      targets: '.ml1 .letter',
      translateY: ['1.2em', 0],
      opacity: [0, 1],
      easing: 'easeOutExpo',
      duration: 2000,
      delay: (el, i) => 50 * i,
    });
  }
})();