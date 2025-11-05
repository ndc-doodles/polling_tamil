const navbar = document.getElementById('navbar');
const mobileBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const overlay = document.getElementById('overlay');
let menuOpen = false;

// Navbar scroll effect
function handleScroll() {
  if (window.scrollY > 50) {
    // Add a strong blue background (visible even with blur)
    navbar.classList.add('bg-blue-900', 'bg-opacity-80');
  } else {
    // Remove when scrolled to top
    navbar.classList.remove('bg-blue-900', 'bg-opacity-80');
  }
}

handleScroll();
window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleScroll);

// Mobile menu toggle
mobileBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  menuOpen = !menuOpen;
  mobileMenu.style.right = menuOpen ? '0' : '-70%';
  overlay.classList.toggle('hidden', !menuOpen);
});

document.addEventListener('click', (e) => {
  if (menuOpen && !mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
    closeMenu();
  }
});

overlay.addEventListener('click', closeMenu);
function closeMenu() {
  menuOpen = false;
  mobileMenu.style.right = '-70%';
  overlay.classList.add('hidden');
}


document.addEventListener('click', (e) => {
  if (menuOpen && !mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
    closeMenu();
  }
});

overlay.addEventListener('click', closeMenu);
function closeMenu() {
  menuOpen = false;
  mobileMenu.style.right = '-70%';
  overlay.classList.add('hidden');
}











