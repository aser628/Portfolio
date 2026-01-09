/* ===================================
   PAGE SCROLL & NAVIGATION DOTS
   =================================== */
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

/* ===================================
   FADE-IN ANIMATION
   =================================== */
const fades = document.querySelectorAll('.fade');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });
fades.forEach(el => observer.observe(el));

/* ===================================
   HERO TEXT ANIMATION
   =================================== */
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

/* ===================================
   PAGE 3: WEB PROJECT - PROJECT SLIDER
   =================================== */
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
    try {
      const evt = new CustomEvent('projectSlideChange', { detail: { index } });
      document.dispatchEvent(evt);
    } catch (err) {
      console.warn('CustomEvent dispatch failed', err);
    }
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

/* ===================================
   PAGE 3: WEB PROJECT - FIGMA POPUP
   =================================== */
(function () {
  const projectSlider = document.querySelector('.project-link.slider');
  const figmaBtn = document.querySelector('.figma-btn');
  const modal = document.querySelector('.figma-modal');
  const backdrop = document.querySelector('.figma-backdrop');
  const closeBtn = document.querySelector('.figma-close');

  if (!projectSlider || !figmaBtn || !modal || !backdrop) return;

  let currentIndex = 0;

  function handleProjectSlideChange(e) {
    const idx = e && e.detail ? e.detail.index : 0;
    currentIndex = idx;
    if (idx === 1) {
      figmaBtn.classList.add('show');
    } else {
      figmaBtn.classList.remove('show');
    }
  }

  document.addEventListener('projectSlideChange', handleProjectSlideChange);
  handleProjectSlideChange({ detail: { index: 0 } });

  function openModal() {
    const modalImg = modal.querySelector('img');
    if (modalImg) {
      modalImg.src = './Components.jpg';
    }
    
    modal.classList.add('active');
    backdrop.classList.add('active');
    backdrop.setAttribute('aria-hidden', 'false');
  }

  figmaBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal();
  });

  const modalImg = modal.querySelector('img');
  if (modalImg) {
    modalImg.style.cursor = 'default';
  }

  function closeModal() {
    modal.classList.remove('active');
    backdrop.classList.remove('active');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

})();

/* ===================================
   PAGE 4: ARTWORK - BOOK PAGE FLIP
   =================================== */
(function() {
  const slider = document.querySelector('.artwork-slider');
  if (!slider) return;

  const slidesContainer = slider.querySelector('.artwork-slides');
  if (!slidesContainer) return;

  const slides = Array.from(slidesContainer.querySelectorAll('.artwork-slide'));
  const clickBubble = slider.querySelector('.click-bubble');
  const resetButton = slider.querySelector('.reset-button');

  let currentPage = 0;

  slides.forEach((slide, i) => {
    slide.style.zIndex = slides.length - i;
  });

  function updatePages() {
    slides.forEach((slide, i) => {
      if (i < currentPage) {
        slide.classList.add('flipped');
        slide.style.zIndex = i + 1;
      } else {
        slide.classList.remove('flipped');
        slide.style.zIndex = slides.length - i;
      }
    });

    if (currentPage === slides.length) {
      if (resetButton) resetButton.classList.add('show');
    } else {
      if (resetButton) resetButton.classList.remove('show');
    }
  }

  slider.addEventListener('click', (e) => {
    if (e.target.closest('.reset-button')) return;
    if (e.target.closest('.album-preview-btn')) return;

    const rect = slider.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeftHalf = clickX < rect.width / 2;

    if (clickBubble && currentPage === 0) {
      clickBubble.classList.add('hidden');
    }

    if (isLeftHalf) {
      if (currentPage > 0) {
        currentPage--;
        updatePages();
      }
    } else {
      if (currentPage < slides.length) {
        currentPage++;
        updatePages();
      }
    }
  });

  if (resetButton) {
    resetButton.addEventListener('click', (e) => {
      e.stopPropagation();
      currentPage = 0;
      updatePages();
      if (clickBubble) clickBubble.classList.remove('hidden');
    });
  }

  updatePages();
})();

/* ===================================
   PAGE 4: ALBUM PREVIEW POPUP
   =================================== */
(function() {
  const previewBtns = document.querySelectorAll('.album-preview-btn');
  
  previewBtns.forEach(btn => {
    const popup = btn.nextElementSibling;
    
    if (!popup || !popup.classList.contains('album-popup')) return;
    
    btn.addEventListener('mouseenter', (e) => {
      e.stopPropagation();
      popup.classList.add('active');
    });
    
    btn.addEventListener('mouseleave', (e) => {
      e.stopPropagation();
      popup.classList.remove('active');
    });
    
    popup.addEventListener('mouseenter', (e) => {
      e.stopPropagation();
      popup.classList.add('active');
    });
    
    popup.addEventListener('mouseleave', (e) => {
      e.stopPropagation();
      popup.classList.remove('active');
    });
    
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    
    popup.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
})();

/* ===================================
   PAGE 5: CARD NEWS - SLIDER FUNCTIONALITY
   =================================== */
(function() {
  function initSlider(sliderName) {
    const wrapper = document.querySelector(`[data-slider="${sliderName}"]`);
    if (!wrapper) return;

    const track = wrapper.querySelector('.cardnews-slider-track');
    const items = Array.from(wrapper.querySelectorAll('.cardnews-slider-item'));
    const prevBtn = wrapper.querySelector('.cardnews-prev');
    const nextBtn = wrapper.querySelector('.cardnews-next');
    const dotsContainer = document.querySelector(`[data-slider="${sliderName}"] ~ .cardnews-dots`);
    
    if (!track || items.length === 0) return;

    let currentIndex = 0;
    const totalSlides = items.length;

    if (totalSlides > 1 && dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = i === 0 ? 'dot active' : 'dot';
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateSlider() {
      const offset = -currentIndex * 100;
      track.style.transform = `translateX(${offset}%)`;

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
        });
      }
    }

    function goToSlide(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      updateSlider();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    updateSlider();
  }

  initSlider('all');
  initSlider('2020');
  initSlider('2026');
})();

/* ===================================
   PAGE 6: POSTER - MOBILE SLIDER
   =================================== */
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

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      prev();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      next();
    });
  }

  createDots();
  goTo(0);
})();

/* ===================================
   PAGE 6: POSTER - FIGMA POPUP
   =================================== */
(function() {
  const figmaBtn = document.querySelector('.poster-figma-btn-top');
  const modal = document.querySelector('.poster-figma-modal');
  const backdrop = document.querySelector('.poster-figma-backdrop');
  const closeBtn = document.querySelector('.poster-figma-close');

  if (!figmaBtn || !modal || !backdrop) return;

  figmaBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const figmaUrl = figmaBtn.dataset.figmaUrl || 'https://www.figma.com/design/UGEDd2dMAPXuONyX6ObmhG/POSTER?node-id=1-3&t=jGiGocWJB19UGhji-1';
    const previewSrc = figmaBtn.dataset.preview || './poster/Preview.jpg';
    
    openModal(figmaUrl, previewSrc, true);
  });

  const posterSlides = document.querySelectorAll('.poster-slide');
  posterSlides.forEach(slide => {
    const img = slide.querySelector('img');
    if (img) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const previewSrc = img.src;
        
        openModal(null, previewSrc, false);
      });
    }
  });

  function openModal(figmaUrl, previewSrc, showLink) {
    const figmaOpenLink = modal.querySelector('.poster-figma-open-link');
    const previewImg = modal.querySelector('.poster-figma-preview');
    const actionsDiv = modal.querySelector('.poster-figma-actions');
    
    if (previewImg && previewSrc) {
      previewImg.src = previewSrc;
    }

    if (showLink && figmaOpenLink && figmaUrl) {
      figmaOpenLink.href = figmaUrl;
      figmaOpenLink.textContent = 'Figma에서 보기';
      if (actionsDiv) actionsDiv.style.display = 'block';
      
      if (previewImg) {
        previewImg.style.cursor = 'pointer';
        previewImg.onclick = (e) => {
          e.stopPropagation();
          window.open(figmaUrl, '_blank');
        };
      }
    } else {
      if (actionsDiv) actionsDiv.style.display = 'none';
      if (previewImg) {
        previewImg.style.cursor = 'default';
        previewImg.onclick = null;
      }
    }

    modal.classList.add('active');
    backdrop.classList.add('active');
    backdrop.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('active');
    backdrop.classList.remove('active');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
})();
