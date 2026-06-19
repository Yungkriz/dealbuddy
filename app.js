// ===== DealBuddy App — Day 7: Fetch API =====

// Deal data (simulated API — in a real app this would come from a server)
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

// Category mapping
const categoryMap = {
  '📱 Electronics': 'electronics',
  '👗 Fashion': 'fashion',
  '🏠 Home & Living': 'home',
  '🍎 Groceries': 'grocery',
  '⚽️ Sports': 'sports',
  '💻 Computers & Tech': 'computers',
  '🤖 AI & Software': 'electronics'
};

// ===== DOM Elements =====
const searchInput = document.getElementById('search');
const searchForm = document.querySelector('#hero form');
const dealsContainer = document.getElementById('deals');
const categoryLinks = document.querySelectorAll('#categories li a');

// ===== Render Deals to DOM =====
function renderDeals(deals) {
  // Clear existing deals (keep the h2)
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
    article.innerHTML = `
      <img src="${deal.image}" alt="${deal.title}" loading="lazy">
      <h3>${deal.title}</h3>
      <p><strong>${deal.price}</strong> <span style="text-decoration:line-through;color:#999;">${deal.originalPrice}</span></p>
      <p style="color:#16a34a;font-weight:600;">${deal.savings} at ${deal.retailer}</p>
      <a href="#" onclick="event.preventDefault(); openDeal(${deal.id})">View Deal →</a>
    `;
    dealsContainer.appendChild(article);
  });
}

// ===== Fetch Deals (simulated API call) =====
async function fetchDeals() {
  // Show loading state
  dealsContainer.innerHTML = '<p style="text-align:center;padding:3rem;color:#666;">🔄 Loading deals...</p>';

  try {
    // Simulate API delay (1 second)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, this would be:
    // const response = await fetch('https://api.example.com/deals');
    // const data = await response.json();

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

// ===== Open Deal (placeholder) =====
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
    filterDeals(searchInput.value);
  });
}

// Category filter
categoryLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const category = categoryMap[link.textContent.trim()] || '';
    searchInput.value = category;
    filterDeals(category);
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

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  fetchDeals();
  console.log('DealBuddy is loaded! 🛍️');
});
