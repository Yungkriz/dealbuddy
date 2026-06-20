// ===== DealBuddy App — Day 11: ES6+ Refactored =====

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

// ===== LocalStorage Module =====
const Storage = {
  KEY: 'dealbuddy_data',

  save(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },

  load() {
    const raw = localStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : { favorites: [], newsletter: '', searchHistory: [] };
  },

  getFavorites() {
    return this.load().favorites;
  },

  toggleFavorite(dealId) {
    const data = this.load();
    const index = data.favorites.indexOf(dealId);

    if (index > -1) {
      data.favorites.splice(index, 1);
    } else {
      data.favorites.push(dealId);
    }

    this.save(data);
    return data.favorites.includes(dealId);
  },

  isFavorite(dealId) {
    return this.getFavorites().includes(dealId);
  },

  saveEmail(email) {
    const data = this.load();
    data.newsletter = email;
    this.save(data);
  },

  getEmail() {
    return this.load().newsletter || '';
  },

  saveSearch(term) {
    if (!term?.trim()) return;
    const data = this.load();
    data.searchHistory = [term, ...data.searchHistory.filter(s => s !== term)].slice(0, 5);
    this.save(data);
  }
};

// ===== DOM Elements =====
const getElement = (id) => document.getElementById(id);
const querySelector = (sel) => document.querySelector(sel);
const querySelectorAll = (sel) => document.querySelectorAll(sel);

const searchInput = getElement('search');
const searchForm = querySelector('#hero form');
const dealsContainer = getElement('deals');
const categoryLinks = querySelectorAll('#categories li a');

// ===== Render a Single Deal Card =====
const createDealCard = (deal, index) => {
  const { id, title, price, originalPrice, savings, retailer, image, badge } = deal;
  const isFav = Storage.isFavorite(id);
  const favIcon = isFav ? '❤️' : '🤍';
  const favText = isFav ? 'Saved' : 'Save';

  const article = document.createElement('article');
  article.style.animationDelay = `${index * 0.1}s`;
  article.className = 'deal-card';
  article.innerHTML = `
    <div style="position:relative;">
      <img src="${image}" alt="${title}" loading="lazy">
      <span style="position:absolute;top:0.5rem;left:0.5rem;background:#fff;padding:0.25rem 0.5rem;border-radius:6px;font-size:0.75rem;font-weight:700;color:#667eea;">${badge}</span>
      <button onclick="window.toggleFav(${id}, this)" style="position:absolute;top:0.5rem;right:0.5rem;background:#fff;border:none;border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:transform 0.2s;" title="${favText}">${favIcon}</button>
    </div>
    <h3>${title}</h3>
    <p><strong>${price}</strong> <span style="text-decoration:line-through;color:#999;">${originalPrice}</span></p>
    <p style="color:#16a34a;font-weight:600;">${savings} at ${retailer}</p>
    <a href="#" onclick="event.preventDefault(); window.openDeal(${id})">View Deal →</a>
  `;
  return article;
};

// ===== Render All Deals =====
const renderDeals = (deals) => {
  const h2 = dealsContainer.querySelector('h2');
  dealsContainer.innerHTML = '';
  if (h2) dealsContainer.appendChild(h2);

  if (deals.length === 0) {
    dealsContainer.innerHTML += '<p style="text-align:center;color:#666;padding:2rem;">No deals found. Try a different search!</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  deals.forEach((deal, index) => {
    fragment.appendChild(createDealCard(deal, index));
  });
  dealsContainer.appendChild(fragment);
};

// ===== Filter Deals =====
const filterDeals = (searchTerm) => {
  const term = searchTerm.toLowerCase().trim();

  const filtered = dealsData.filter(({ title, savings, retailer }) => {
    const desc = `${savings} ${retailer}`.toLowerCase();
    return title.toLowerCase().includes(term) || desc.includes(term) || term === '';
  });

  renderDeals(filtered);
};

// ===== Fetch Deals (simulated API) =====
const fetchDeals = async () => {
  dealsContainer.innerHTML = '<p style="text-align:center;padding:3rem;color:#666;">🔄 Loading deals...</p>';

  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    renderDeals(dealsData);
    console.log(`✅ Loaded ${dealsData.length} deals`);
  } catch (error) {
    console.error('Error fetching deals:', error);
    dealsContainer.innerHTML = '<p style="text-align:center;padding:3rem;color:#dc2626;">❌ Error loading deals. Please try again later.</p>';
  }
};

// ===== Open Deal =====
const openDeal = (id) => {
  const deal = dealsData.find(d => d.id === id);
  if (deal) {
    const { title, price, retailer, savings } = deal;
    alert(`🎉 ${title}\n\n💰 Price: ${price}\n🏪 Retailer: ${retailer}\n${savings}\n\n(Click "OK" to visit ${retailer})`);
  }
};

// ===== Toggle Favorite (global for onclick) =====
window.toggleFav = (dealId, btn) => {
  const isNowFav = Storage.toggleFavorite(dealId);
  btn.innerHTML = isNowFav ? '❤️' : '🤍';
  btn.title = isNowFav ? 'Saved' : 'Save';
  btn.style.transform = 'scale(1.2)';
  setTimeout(() => btn.style.transform = 'scale(1)', 200);
};

// ===== Category Mapping =====
const categoryMap = {
  '📱 Electronics': 'electronics',
  '👗 Fashion': 'fashion',
  '🏠 Home & Living': 'home',
  '🍎 Groceries': 'grocery',
  '⚽️ Sports': 'sports',
  '💻 Computers & Tech': 'computers',
  '🤖 AI & Software': 'electronics'
};

// ===== Smooth Scroll =====
const smoothScrollTo = (selector) => {
  const target = querySelector(selector);
  target?.scrollIntoView({ behavior: 'smooth' });
};

// ===== Update Favorites Counter =====
const updateFavCount = () => {
  const { length } = Storage.getFavorites();
  const headerNav = querySelector('header nav');

  headerNav.querySelector('.fav-count')?.remove();

  if (length > 0) {
    const span = document.createElement('span');
    span.className = 'fav-count';
    span.style.cssText = 'margin-left:auto;background:#ef4444;color:#fff;padding:0.25rem 0.625rem;border-radius:50px;font-size:0.8rem;font-weight:700;';
    span.textContent = `❤️ ${length} saved`;
    headerNav.appendChild(span);
  }
};

// ===== Event Listeners =====

// Search
searchInput?.addEventListener('input', (e) => filterDeals(e.target.value));
searchForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  Storage.saveSearch(searchInput.value);
  filterDeals(searchInput.value);
});

// Category filter
categoryLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const term = categoryMap[link.textContent.trim()] || '';
    searchInput.value = term;
    filterDeals(term);
    smoothScrollTo('#deals');
  });
});

// Nav links
querySelectorAll('header nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      smoothScrollTo(href);
    }
  });
});

// Newsletter
const newsletterForm = querySelector('#newsletter form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = getElement('email').value;
    if (email) {
      Storage.saveEmail(email);
      alert('🎉 Thanks for subscribing! Your email has been saved.');
      getElement('email').value = '';
    }
  });

  // Pre-fill saved email
  const savedEmail = Storage.getEmail();
  if (savedEmail) getElement('email').value = savedEmail;
}

// Scroll to top
const scrollTopBtn = querySelector('.scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  fetchDeals();
  updateFavCount();
  console.log('DealBuddy v2.0 loaded! 🛍️');
  console.log('Saved data:', Storage.load());
});
