// ===== DealBuddy App — Day 8: LocalStorage =====

// Deal data
const dealsData = [
  {
    id: 1,
    title: "Apple AirPods Pro 3",
    price: "$180",
    originalPrice: "$249",
    savings: "Save $69",
    retailer: "Amazon",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=200&fit=crop",
    badge: "Hot Deal"
  },
  {
    id: 2,
    title: "MacBook Air M5",
    price: "$949",
    originalPrice: "$1,099",
    savings: "Save $150",
    retailer: "Amazon",
    category: "computers",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop",
    badge: "Best Seller"
  },
  {
    id: 3,
    title: "Logitech MX Master 3S",
    price: "$89.99",
    originalPrice: "$119.99",
    savings: "Save $30",
    retailer: "Amazon",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop",
    badge: "Top Rated"
  },
  {
    id: 4,
    title: "Samsung 65\" Crystal UHD 4K TV",
    price: "$329.99",
    originalPrice: "$469.99",
    savings: "Save $140",
    retailer: "Best Buy",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&h=200&fit=crop",
    badge: "Doorbuster"
  },
  {
    id: 5,
    title: "Samsung The Frame 65\" TV",
    price: "$1,199.99",
    originalPrice: "$1,599.99",
    savings: "Save $400",
    retailer: "Best Buy",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=300&h=200&fit=crop",
    badge: "Premium"
  },
  {
    id: 6,
    title: "Samsung 65\" QLED 4K Smart TV",
    price: "$599.99",
    originalPrice: "$899.99",
    savings: "Save $300",
    retailer: "Best Buy",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=200&fit=crop",
    badge: "Popular"
  }
];

// ===== LocalStorage Helpers =====
const STORAGE_KEY = 'dealbuddy_data';

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : { favorites: [], newsletter: '', searchHistory: [] };
}

// ===== User Preferences =====
function getPrefs() {
  return loadData();
}

function toggleFavorite(dealId) {
  const data = getPrefs();
  const index = data.favorites.indexOf(dealId);

  if (index > -1) {
    data.favorites.splice(index, 1);
  } else {
    data.favorites.push(dealId);
  }

  saveData(data);
  return data.favorites.includes(dealId);
}

function isFavorite(dealId) {
  return getPrefs().favorites.includes(dealId);
}

function saveNewsletter(email) {
  const data = getPrefs();
  data.newsletter = email;
  saveData(data);
}

function getNewsletter() {
  return getPrefs().newsletter || '';
}

function saveSearch(term) {
  if (!term.trim()) return;
  const data = getPrefs();
  // Keep last 5 searches, no duplicates
  data.searchHistory = [term, ...data.searchHistory.filter(s => s !== term)].slice(0, 5);
  saveData(data);
}

// ===== DOM Elements =====
const searchInput = document.getElementById('search');
const searchForm = document.querySelector('#hero form');
const dealsContainer = document.getElementById('deals');
const categoryLinks = document.querySelectorAll('#categories li a');

// ===== Render Deals with Favorites =====
function renderDeals(deals) {
  const h2 = dealsContainer.querySelector('h2');
  dealsContainer.innerHTML = '';
  if (h2) dealsContainer.appendChild(h2);

  if (deals.length === 0) {
    dealsContainer.innerHTML += '<p style="text-align:center;color:#666;padding:2rem;">No deals found. Try a different search!</p>';
    return;
  }

  deals.forEach((deal, index) => {
    const article = document.createElement('article');
    article.style.animationDelay = `${index * 0.1}s`;
    article.className = 'deal-card';

    const favIcon = isFavorite(deal.id) ? '❤️' : '🤍';
    const favText = isFavorite(deal.id) ? 'Saved' : 'Save';

    article.innerHTML = `
      <div style="position:relative;">
        <img src="${deal.image}" alt="${deal.title}" loading="lazy">
        <span style="position:absolute;top:0.5rem;left:0.5rem;background:#fff;padding:0.25rem 0.5rem;border-radius:6px;font-size:0.75rem;font-weight:700;color:#667eea;">${deal.badge}</span>
        <button onclick="window.toggleFav(${deal.id}, this)" style="position:absolute;top:0.5rem;right:0.5rem;background:#fff;border:none;border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:transform 0.2s;" title="${favText}">${favIcon}</button>
      </div>
      <h3>${deal.title}</h3>
      <p><strong>${deal.price}</strong> <span style="text-decoration:line-through;color:#999;">${deal.originalPrice}</span></p>
      <p style="color:#16a34a;font-weight:600;">${deal.savings} at ${deal.retailer}</p>
      <a href="#" onclick="event.preventDefault(); openDeal(${deal.id})">View Deal →</a>
    `;
    dealsContainer.appendChild(article);
  });
}

// ===== Toggle Favorite (global for onclick) =====
window.toggleFav = function(dealId, btn) {
  const isNowFav = toggleFavorite(dealId);
  btn.innerHTML = isNowFav ? '❤️' : '🤍';
  btn.title = isNowFav ? 'Saved' : 'Save';
  btn.style.transform = 'scale(1.2)';
  setTimeout(() => btn.style.transform = 'scale(1)', 200);
};

// ===== Fetch Deals =====
async function fetchDeals() {
  dealsContainer.innerHTML = '<p style="text-align:center;padding:3rem;color:#666;">🔄 Loading deals...</p>';

  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    renderDeals(dealsData);
    console.log(`✅ Loaded ${dealsData.length} deals`);
  } catch (error) {
    console.error('Error fetching deals:', error);
    dealsContainer.innerHTML = '<p style="text-align:center;padding:3rem;color:#dc2626;">❌ Error loading deals. Please try again later.</p>';
  }
}

// ===== Filter Deals =====
function filterDeals(searchTerm) {
  const term = searchTerm.toLowerCase().trim();

  const filtered = dealsData.filter(deal => {
    const title = deal.title.toLowerCase();
    const desc = `${deal.savings} ${deal.retailer}`.toLowerCase();
    return title.includes(term) || desc.includes(term) || term === '';
  });

  renderDeals(filtered);
}

// ===== Open Deal =====
function openDeal(id) {
  const deal = dealsData.find(d => d.id === id);
  if (deal) {
    alert(`🎉 ${deal.title}\n\n💰 Price: ${deal.price}\n🏪 Retailer: ${deal.retailer}\n${deal.savings}\n\n(Click "OK" to visit ${deal.retailer})`);
  }
}

// ===== Event Listeners =====

// Search input
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    filterDeals(e.target.value);
  });
}

// Search form submit
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveSearch(searchInput.value);
    filterDeals(searchInput.value);
  });
}

// Category filter
categoryLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const category = link.textContent.trim();
    const catMap = {
      '📱 Electronics': 'electronics',
      '👗 Fashion': 'fashion',
      '🏠 Home & Living': 'home',
      '🍎 Groceries': 'grocery',
      '⚽️ Sports': 'sports',
      '💻 Computers & Tech': 'computers',
      '🤖 AI & Software': 'electronics'
    };
    const term = catMap[category] || '';
    searchInput.value = term;
    filterDeals(term);
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
      saveNewsletter(email);
      alert('🎉 Thanks for subscribing! Your email has been saved.');
      document.getElementById('email').value = '';
    }
  });

  // Pre-fill saved email
  const savedEmail = getNewsletter();
  if (savedEmail) {
    document.getElementById('email').value = savedEmail;
  }
}

// Scroll to top button
const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
}

// ===== Favorites Counter in Header =====
function updateFavCount() {
  const data = getPrefs();
  const count = data.favorites.length;
  const headerNav = document.querySelector('header nav');

  // Remove existing counter if any
  const existing = headerNav.querySelector('.fav-count');
  if (existing) existing.remove();

  if (count > 0) {
    const span = document.createElement('span');
    span.className = 'fav-count';
    span.style.cssText = 'margin-left:auto;background:#ef4444;color:#fff;padding:0.25rem 0.625rem;border-radius:50px;font-size:0.8rem;font-weight:700;';
    span.textContent = `❤️ ${count} saved`;
    headerNav.appendChild(span);
  }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  fetchDeals();
  updateFavCount();
  console.log('DealBuddy is loaded! 🛍️');
  console.log('Saved data:', getPrefs());
});
