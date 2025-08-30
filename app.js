/* ====================== DATA: 300 ITEMS (embedded) ====================== */
const DB = { laptops: [], desktops: [], components: [] };

(function generateData(){
  // Laptops (100 total)
  const laptopBrands = ['Dell', 'HP', 'Lenovo', 'Acer', 'Asus', 'MSI', 'Apple', 'Samsung', 'Razer', 'LG'];
  const laptopSectors = ['Budget', 'Gaming', 'Office', 'Workstation', 'Premium'];
  
  // Generate 100 laptops (20 per sector)
  for (let sectorIndex = 0; sectorIndex < laptopSectors.length; sectorIndex++) {
    const sector = laptopSectors[sectorIndex];
    for (let i = 1; i <= 20; i++) {
      const brand = laptopBrands[(i + sectorIndex) % laptopBrands.length];
      const priceBase = {
        Budget: 400, Gaming: 1200, Office: 900, Workstation: 1800, Premium: 1500
      }[sector];
      const price = {
        usd: priceBase + ((i * 17) % 600),
        inr: Math.round((priceBase + ((i * 17) % 600)) * 82.8)
      };
      
      DB.laptops.push({
        id: `laptop-${sector.toLowerCase()}-${i}`,
        type: 'laptop',
        sector,
        name: `${brand} ${sector} ${100 + i}`,
        brand,
        price,
        image: `https://picsum.photos/seed/lap-${sector.toLowerCase()}-${i}/800/520`,
        specs: {
          processor: sector==='Gaming'?'Intel i7 / Ryzen 7' : sector==='Workstation'?'Intel i9 / Ryzen 9' : 'Intel i5 / Ryzen 5',
          ram: sector==='Budget'?'8GB':'16GB',
          storage: sector==='Workstation'?'1TB NVMe SSD':'512GB NVMe SSD',
          display: sector==='Gaming'?'15.6" 165Hz':'15.6" 60Hz',
          graphics: sector==='Gaming'?'NVIDIA RTX 3060' : 'Integrated / Mid-range',
          battery: sector==='Workstation'?'80Wh':'60Wh'
        },
        description: `${sector} laptop tuned for ${sector==='Gaming'?'high-FPS gaming':'daily productivity and reliability'}.`,
      });
    }
  }

  // Desktops (100 total)
  const desktopBrands = ['Alienware', 'HP', 'Dell', 'Corsair', 'MSI', 'NZXT', 'Lenovo', 'Acer', 'Asus', 'CyberPowerPC'];
  const desktopSectors = ['Budget', 'Gaming', 'Office', 'Workstation', 'Premium'];
  
  for (let sectorIndex = 0; sectorIndex < desktopSectors.length; sectorIndex++) {
    const sector = desktopSectors[sectorIndex];
    for (let i = 1; i <= 20; i++) {
      const brand = desktopBrands[(i + sectorIndex) % desktopBrands.length];
      const priceBase = {
        Budget: 500, Gaming: 1500, Office: 800, Workstation: 2200, Premium: 1800
      }[sector];
      const price = {
        usd: priceBase + ((i * 37) % 800),
        inr: Math.round((priceBase + ((i * 37) % 800)) * 82.8)
      };
      
      DB.desktops.push({
        id: `desktop-${sector.toLowerCase()}-${i}`,
        type: 'desktop',
        sector,
        name: `${brand} ${sector} ${200 + i}`,
        brand,
        price,
        image: `https://picsum.photos/seed/desk-${sector.toLowerCase()}-${i}/800/520`,
        specs: {
          processor: (i%2)?'Intel Core i7':'AMD Ryzen 7',
          ram: (i%3)?'16GB DDR5':'32GB DDR5',
          storage: (i%4)?'1TB NVMe SSD':'2TB NVMe SSD',
          graphics: (i%4===0)?'NVIDIA RTX 4070':'NVIDIA RTX 4060',
          psu: (i%3)?'750W Gold':'650W Bronze',
          form:'ATX'
        },
        description: `${sector} desktop build for ${sector==='Gaming'?'gaming':'productivity'}.`
      });
    }
  }

  // Components (100 total)
  const compTypes = ['GPU', 'CPU', 'RAM', 'SSD', 'Motherboard', 'Power Supply', 'Cooling'];
  const compBrands = {
    GPU: ['NVIDIA', 'AMD', 'ASUS', 'MSI', 'Gigabyte'],
    CPU: ['Intel', 'AMD'],
    RAM: ['Corsair', 'G.Skill', 'Kingston', 'Crucial', 'TeamGroup'],
    SSD: ['Samsung', 'Crucial', 'WD', 'Seagate', 'Kingston'],
    Motherboard: ['ASUS', 'MSI', 'Gigabyte', 'ASRock', 'Biostar'],
    'Power Supply': ['Corsair', 'Seasonic', 'EVGA', 'Cooler Master', 'be quiet!'],
    Cooling: ['Noctua', 'Corsair', 'Cooler Master', 'NZXT', 'Arctic']
  };
  
  for (let i = 1; i <= 100; i++) {
    const type = compTypes[i % compTypes.length];
    const brands = compBrands[type];
    const brand = brands[i % brands.length];
    const priceBase = 50 + ((i * 11) % 950);
    const price = {
      usd: priceBase,
      inr: Math.round(priceBase * 82.8)
    };
    
    DB.components.push({
      id: `component-${i}`,
      type: 'component',
      category: type,
      name: `${brand} ${type} ${300 + i}`,
      brand,
      price,
      image: `https://picsum.photos/seed/comp-${i}/800/520`,
      specs: {
        type,
        rating: (Math.round((3 + (i%30)/10)*10)/10)+'★',
        notes: type==='GPU'?'PCIe 4.0, 12GB':'High reliability'
      },
      description: `Quality ${type} suited for mainstream and enthusiast builds.`
    });
  }
})();

/* ====================== UI state & helpers ====================== */
let activeCategory = null;
let currentSector = 'All';
let currentSearch = '';
let currentPage = 1;
let perPage = 12;
let currentSort = 'relevance';
const productGrid = document.getElementById('productGrid');
const productModal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const suggestList = document.getElementById('suggestList');
const mainSuggestList = document.getElementById('mainSuggestList');
const searchInput = document.getElementById('searchInput');
const mainSearch = document.getElementById('mainSearch');
const controlsWrap = document.getElementById('controlsWrap');
const sectorSeg = document.getElementById('sectorSeg');
const paginationWrap = document.getElementById('pagination');
const resultsLabel = document.getElementById('resultsLabel');
const perPageSel = document.getElementById('perPageSel');
const sortSel = document.getElementById('sortSel');
const uiTone = document.getElementById('uiTone');
const contentDiv = document.querySelector('.content');

/* helpers: debounce + safe text */
function debounce(fn, ms=220){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; }
function safe(txt){ return String(txt || ''); }
function capitalize(str) { 
  if (!str) return '';
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); 
}

/* ====================== Liquid hover effect ====================== */
document.querySelectorAll('.glass-effect').forEach(el=>{
  let ticking=false;
  el.addEventListener('mousemove', e=>{
    if(!ticking){
      window.requestAnimationFrame(()=>{ const r=el.getBoundingClientRect(); const x=e.clientX - r.left; const y=e.clientY - r.top; el.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,.12) 0%, var(--card-bg) 55%)`; ticking=false; });
      ticking=true;
    }
  });
  el.addEventListener('mouseleave', ()=> el.style.background = 'var(--card-bg)');
});

/* ====================== Theme Toggling ====================== */
document.getElementById('clearModeBtn').addEventListener('click', () => {
  setTheme('clear');
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('clearModeBtn').classList.add('active');
});

document.getElementById('sunModeBtn').addEventListener('click', () => {
  setTheme('light');
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('sunModeBtn').classList.add('active');
});

document.getElementById('moonModeBtn').addEventListener('click', () => {
  setTheme('dark');
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('moonModeBtn').classList.add('active');
});

function setTheme(theme) {
  document.body.classList.remove('light-theme', 'dark-theme');
  if (theme === 'light') {
    document.body.classList.add('light-theme');
  } else if (theme === 'dark') {
    document.body.classList.add('dark-theme');
  }
}

/* ====================== Home: handle category clicks ====================== */
document.querySelectorAll('.app-card').forEach(card=>{
  card.addEventListener('click', ()=>{
    const cat = card.getAttribute('data-category');
    openCategory(cat);
  });
});

document.getElementById('backHome').addEventListener('click', () => {
  hideCategory();
});

function hideCategory() {
  controlsWrap.style.display = 'none';
  contentDiv.style.display = 'grid';
  activeCategory = null;
  currentSearch = '';
  searchInput.value = '';
  resultsLabel.textContent = '';
  productGrid.innerHTML = '';
  paginationWrap.innerHTML = '';
}

/* open category */
function openCategory(cat){
  activeCategory = cat;
  currentPage = 1;
  currentSearch = '';
  searchInput.value = '';
  suggestList.style.display = 'none';
  
  // Reset sector when switching categories
  currentSector = 'All';
  
  // show sector selector only for laptops
  if(cat === 'laptops'){ 
    sectorSeg.style.display = 'flex'; 
    document.querySelectorAll('#sectorSeg button').forEach(b=>b.classList.remove('active')); 
    document.querySelector('#sectorSeg button[data-sector="All"]').classList.add('active'); 
  } else {
    sectorSeg.style.display = 'none';
  }
  controlsWrap.style.display = 'block';
  contentDiv.style.display = 'none';
  document.getElementById('productGrid').scrollIntoView({behavior:'smooth'});
  renderProducts();
  // update results label
  resultsLabel.textContent = `${capitalize(cat)} • browse`;
}

/* ====================== Search functionality ====================== */
function getAllItems(){
  return [...DB.laptops, ...DB.desktops, ...DB.components];
}

function searchMatches(q, limit=6, category=null){
  if(!q) return [];
  q = q.trim().toLowerCase();
  let arr = category ? DB[category] : getAllItems();
  return arr.filter(it => 
    `${it.name} ${it.brand} ${JSON.stringify(it.specs)}`.toLowerCase().includes(q)
  ).slice(0, limit);
}

// Main search bar functionality
mainSearch.addEventListener('input', debounce(() => {
  const q = mainSearch.value.trim();
  if (q.length >= 2) {
    const matches = searchMatches(q, 8);
    showSuggestions(matches, mainSuggestList, mainSearch);
  } else {
    mainSuggestList.style.display = 'none';
  }
}));

// Category search functionality
searchInput.addEventListener('input', debounce(() => {
  const q = searchInput.value.trim();
  currentSearch = q;
  currentPage = 1;
  
  if (q.length >= 2) {
    const matches = searchMatches(q, 8, activeCategory);
    showSuggestions(matches, suggestList, searchInput);
  } else {
    suggestList.style.display = 'none';
    renderProducts();
  }
}));

function showSuggestions(items, listElement, inputElement) {
  if (!items.length) {
    listElement.style.display = 'none';
  }
  
  listElement.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'suggest-item';
    div.innerHTML = `
      <div style="font-weight:600">${item.name}</div>
      <div style="font-size:.9rem;opacity:.8">${item.brand} • ${formatPrice(item.price)}</div>
    `;
    div.addEventListener('click', () => {
      inputElement.value = item.name;
      listElement.style.display = 'none';
      if (inputElement === mainSearch) {
        openProductModal(item);
      } else {
        currentSearch = item.name;
        renderProducts();
      }
    });
    listElement.appendChild(div);
  });
  
  listElement.style.display = 'block';
}

function hideSuggestions() {
  suggestList.style.display = 'none';
  mainSuggestList.style.display = 'none';
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.suggest-box') && !e.target.closest('.search-bar')) {
    hideSuggestions();
  }
});

/* ====================== Product rendering ====================== */
function getCurrentProducts() {
  let products = [];
  if (activeCategory) {
    products = DB[activeCategory];
    
    if (activeCategory === 'laptops' && currentSector !== 'All') {
      products = products.filter(p => p.sector === currentSector);
    }
    
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        JSON.stringify(p.specs).toLowerCase().includes(q)
      );
    }
    
    switch(currentSort) {
      case 'priceAsc':
        products.sort((a, b) => a.price.usd - b.price.usd);
        break;
      case 'priceDesc':
        products.sort((a, b) => b.price.usd - a.price.usd);
        break;
      case 'nameAsc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        if (currentSearch) {
          const q = currentSearch.toLowerCase();
          products.sort((a, b) => {
            const aMatch = a.name.toLowerCase().includes(q);
            const bMatch = b.name.toLowerCase().includes(q);
            if (aMatch && !bMatch) return -1;
            if (!aMatch && bMatch) return 1;
            return 0;
          });
        }
    }
  }
  return products;
}

function renderProducts() {
  const products = getCurrentProducts();
  const totalPages = Math.ceil(products.length / perPage);
  const startIdx = (currentPage - 1) * perPage;
  const pageProducts = products.slice(startIdx, startIdx + perPage);
  
  // Update results label
  resultsLabel.textContent = `${products.length} products found`;
  
  // Render products
  productGrid.innerHTML = '';
  pageProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card glass-effect';
    card.innerHTML = `
      <div class="product-card-img">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-card-info">
        <div class="product-card-title">${product.name}</div>
        <div class="product-card-spec">${getShortSpecs(product)}</div>
        <div class="product-card-price">${formatPrice(product.price)}</div>
      </div>
    `;
    card.addEventListener('click', () => openProductModal(product));
    productGrid.appendChild(card);
  });
  
  // Render pagination
  renderPagination(totalPages);
}

function getShortSpecs(product) {
  if (product.type === 'laptop') {
    return `${product.specs?.processor?.split(' ')[0] || ''} • ${product.specs?.ram || ''} • ${product.specs?.storage || ''}`;
  } else if (product.type === 'desktop') {
    return `${product.specs?.processor?.split(' ')[0] || ''} • ${product.specs?.ram || ''} • ${product.specs?.graphics || ''}`;
  } else {
    return `${product.specs?.type || ''} • ${Object.values(product.specs || {})[1] || ''}`;
  }
}

function formatPrice(price) {
  return `₹${price.inr.toLocaleString('en-IN')}`;
}

function renderPagination(totalPages) {
  paginationWrap.innerHTML = '';
  
  if (totalPages <= 1) return;
  
  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.innerHTML = '&laquo; Prev';
  prevBtn.disabled = currentPage === 1;
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
      window.scrollTo({ top: productGrid.offsetTop - 100, behavior: 'smooth' });
    }
  });
  paginationWrap.appendChild(prevBtn);
  
  // Page buttons
  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const endPage = Math.min(totalPages, startPage + 4);
  
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderProducts();
      window.scrollTo({ top: productGrid.offsetTop - 100, behavior: 'smooth' });
    });
    paginationWrap.appendChild(pageBtn);
  }
  
  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.innerHTML = 'Next &raquo;';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts();
      window.scrollTo({ top: productGrid.offsetTop - 100, behavior: 'smooth' });
    }
  });
  paginationWrap.appendChild(nextBtn);
}

/* ====================== Product Modal ====================== */
function openProductModal(product) {
  // Play UI sound
  if (uiTone) {
    uiTone.currentTime = 0;
    uiTone.play().catch(e => {
      console.log("Audio play failed, using fallback:", e);
    });
  }
  
  // Show modal
  productModal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Build modal content
  modalBody.innerHTML = `
    <div class="product-details">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h2>${product.name}</h2>
        <div class="badges">
          <div class="badge">${product.brand}</div>
          ${product.sector ? `<div class="badge">${product.sector}</div>` : ''}
          ${product.category ? `<div class="badge">${product.category}</div>` : ''}
        </div>
        <div class="product-price">${formatPrice(product.price)}</div>
        <p>${product.description}</p>
        
        <div class="product-specs">
          <h3>Specifications</h3>
          ${renderSpecs(product.specs)}
        </div>
        
        <div class="action-buttons">
          <button class="control"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
          <button class="control"><i class="fas fa-heart"></i> Wishlist</button>
        </div>
      </div>
    </div>
  `;
  
  // Trigger animations after a short delay
  setTimeout(() => {
    const img = modalBody.querySelector('.product-image img');
    if (img) {
      img.style.opacity = '1';
      img.classList.add('swing-in');
    }
    
    // Animate the specs with sequential delays
    const elementsToAnimate = [
      modalBody.querySelector('h2'),
      ...modalBody.querySelectorAll('.badge'),
      modalBody.querySelector('.product-price'),
      modalBody.querySelector('p'),
      modalBody.querySelector('h3')
    ];
    
    elementsToAnimate.forEach((el, index) => {
      if (el) {
        el.style.animationDelay = `${0.2 + (index * 0.1)}s`;
        el.classList.add('iron-assemble');
      }
    });
    
    // Animate spec items
    const specItems = modalBody.querySelectorAll('.spec-item');
    specItems.forEach((item, index) => {
      item.style.animationDelay = `${0.5 + (index * 0.1)}s`;
      item.classList.add('iron-assemble');
    });
    
    // Animate action buttons
    const actionButtons = modalBody.querySelectorAll('.action-buttons button');
    actionButtons.forEach((button, index) => {
      button.style.animationDelay = `${0.8 + (index * 0.1)}s`;
      button.classList.add('iron-assemble');
    });
  }, 100);
}

function renderSpecs(specs) {
  let html = '';
  for (const [key, value] of Object.entries(specs || {})) {
    html += `
      <div class="spec-item">
        <span>${capitalize(key)}</span>
        <span>${value}</span>
      </div>
    `;
  }
  return html;
}

// Close modal
document.getElementById('closeModal').addEventListener('click', () => {
  productModal.classList.remove('show');
  document.body.style.overflow = 'auto';
  
  // Reset modal image opacity for next open
  const modalImg = document.querySelector('.product-image img');
  if (modalImg) {
    modalImg.style.opacity = '0';
    modalImg.classList.remove('swing-in');
  }
});

// Close modal when clicking outside
productModal.addEventListener('click', (e) => {
  if (e.target === productModal) {
    productModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Reset modal image opacity for next open
    const modalImg = document.querySelector('.product-image img');
    if (modalImg) {
      modalImg.style.opacity = '0';
      modalImg.classList.remove('swing-in');
    }
  }
});

/* ====================== Event Listeners ====================== */
// Sector segment buttons
document.querySelectorAll('#sectorSeg button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#sectorSeg button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSector = btn.getAttribute('data-sector');
    currentPage = 1;
    renderProducts();
  });
});

// Sort select
sortSel.addEventListener('change', () => {
  currentSort = sortSel.value;
  currentPage = 1;
  renderProducts();
});

// Per page select
perPageSel.addEventListener('change', () => {
  perPage = parseInt(perPageSel.value);
  currentPage = 1;
  renderProducts();
});

// Initialize top devices list
function initTopDevices() {
  const topList = document.getElementById('topList');
  // Show only laptops and desktops in top devices, not components
  const topProducts = [...DB.laptops, ...DB.desktops]
    .sort((a, b) => b.price.usd - a.price.usd)
    .slice(0, 5);
  
  topList.innerHTML = '';
  topProducts.forEach((product, index) => {
    const div = document.createElement('div');
    div.style.padding = '8px 0';
    div.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    div.style.cursor = 'pointer';
    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;">
        <span>${index + 1}. ${product.name}</span>
        <span style="color:#64d2ff;font-weight:600">${formatPrice(product.price)}</span>
      </div>
    `;
    div.addEventListener('click', () => openProductModal(product));
    topList.appendChild(div);
  });
}

// Initialize the page
initTopDevices();