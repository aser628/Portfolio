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

const fades = document.querySelectorAll('.fade');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });

fades.forEach(el => observer.observe(el));