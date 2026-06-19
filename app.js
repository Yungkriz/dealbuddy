// ===== DealBuddy App =====

// Get DOM elements
const searchInput = document.getElementById('search');
const searchForm = document.querySelector('#hero form');
const dealArticles = document.querySelectorAll('#deals article');
const categoryLinks = document.querySelectorAll('#categories li a');

// Search functionality
function filterDeals(searchTerm) {
  const term = searchTerm.toLowerCase().trim();

  dealArticles.forEach(article => {
    const title = article.querySelector('h3').textContent.toLowerCase();
    const description = article.querySelector('p').textContent.toLowerCase();

    if (title.includes(term) || description.includes(term) || term === '') {
      article.style.display = '';
    } else {
      article.style.display = 'none';
    }
  });
}

// Listen for search input
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    filterDeals(e.target.value);
  });
}

// Prevent form submission (no backend yet)
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    filterDeals(searchInput.value);
  });
}

// Category filter (filters deals by category keyword)
categoryLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const category = link.textContent.trim();

    // Map categories to search terms
    const categoryMap = {
      '📱 Electronics': 'apple',
      '👗 Fashion': 'fashion',
      '🏠 Home & Living': 'home',
      '🍎 Groceries': 'grocery',
      '⚽️ Sports': 'sports',
      '💻 Computers & Tech': 'macbook',
      '🤖 AI & Software': 'logitech'
    };

    const term = categoryMap[category] || '';
    searchInput.value = term;
    filterDeals(term);

    // Scroll to deals section
    document.getElementById('deals').scrollIntoView({ behavior: 'smooth' });
  });
});

// Smooth scroll for nav links
document.querySelectorAll('header nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Newsletter form
const newsletterForm = document.querySelector('#newsletter form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    if (email) {
      alert('🎉 Thanks for subscribing! You\'ll receive weekly deals at ' + email);
      document.getElementById('email').value = '';
    }
  });
}

console.log('DealBuddy is loaded! 🛍️');
