const Store = {
  get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  remove(key) { localStorage.removeItem(key); }
};

function genReferral() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'A1-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function getUser() { return Store.get('a1g_user'); }
function requireAuth() { if (!getUser()) { window.location.href = 'signin.html'; } }
function logout() { Store.remove('a1g_user'); window.location.href = 'index.html'; }

function showToast(msg, duration = 2800) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function openPanel(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closePanel(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
}
document.addEventListener('click', e => {
  if (e.target.classList.contains('panel-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

function initials(name) {
  return (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
}

function formatMoney(n) {
  return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const WELCOME_BONUS     = 80;
const BONUS_MATCH_LIMIT = 33;
const DEPOSIT_REQUIRED  = 50;
const MAX_MATCH         = 40;

const CARS = [
  { id:1,  name:'Mercedes-Benz C-Class',    cat:'Luxury Sedan',      img:'/auto1groupoe/images/cars/car1.jpg',  price:'$55,000',   rating:4.9 },
  { id:2,  name:'Mercedes-Benz A-Class',    cat:'Luxury Hatchback',  img:'/auto1groupoe/images/cars/car2.jpg',  price:'$38,000',   rating:4.7 },
  { id:3,  name:'Toyota Auris',             cat:'Compact Car',       img:'/auto1groupoe/images/cars/car3.jpg',  price:'$22,000',   rating:4.4 },
  { id:4,  name:'Toyota Land Cruiser',      cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car4.jpg',  price:'$88,000',   rating:4.9 },
  { id:5,  name:'Toyota Yaris Sedan',       cat:'Sedan',             img:'/auto1groupoe/images/cars/car5.jpg',  price:'$19,000',   rating:4.3 },
  { id:6,  name:'Toyota Yaris',             cat:'Compact',           img:'/auto1groupoe/images/cars/car6.jpg',  price:'$18,500',   rating:4.3 },
  { id:7,  name:'Nissan GT-R White',        cat:'Sports Car',        img:'/auto1groupoe/images/cars/car7.jpg',  price:'$115,000',  rating:4.9 },
  { id:8,  name:'Nissan GT-R Stealth',      cat:'Sports Car',        img:'/auto1groupoe/images/cars/car8.jpg',  price:'$118,000',  rating:5.0 },
  { id:9,  name:'Nissan GT-R Orange',       cat:'Sports Car',        img:'/auto1groupoe/images/cars/car9.jpg',  price:'$112,000',  rating:4.9 },
  { id:10, name:'Nissan GT-R Nismo White',  cat:'Supercar',          img:'/auto1groupoe/images/cars/car10.jpg', price:'$210,000',  rating:5.0 },
  { id:11, name:'Nissan GT-R Nismo Black',  cat:'Supercar',          img:'/auto1groupoe/images/cars/car11.jpg', price:'$215,000',  rating:5.0 },
  { id:12, name:'Bugatti Chiron Red',       cat:'Hypercar',          img:'/auto1groupoe/images/cars/car12.jpg', price:'$3,200,000',rating:5.0 },
  { id:13, name:'Bugatti Chiron Sport',     cat:'Hypercar',          img:'/auto1groupoe/images/cars/car13.jpg', price:'$3,500,000',rating:5.0 },
  { id:14, name:'Mercedes GLE AMG Black',   cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car14.jpg', price:'$95,000',   rating:4.8 },
  { id:15, name:'Mercedes GLE AMG Street',  cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car15.jpg', price:'$92,000',   rating:4.8 },
  { id:16, name:'Mercedes GLC Matte',       cat:'Luxury SUV Coupe',  img:'/auto1groupoe/images/cars/car16.jpg', price:'$72,000',   rating:4.8 },
  { id:17, name:'Mercedes GLE LA',          cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car17.jpg', price:'$88,000',   rating:4.7 },
  { id:18, name:'Mercedes GLC Matte 2',     cat:'Luxury SUV Coupe',  img:'/auto1groupoe/images/cars/car18.jpg', price:'$74,000',   rating:4.8 },
  { id:19, name:'Mercedes GLE 580',         cat:'Full-Size SUV',     img:'/auto1groupoe/images/cars/car19.jpg', price:'$105,000',  rating:4.9 },
  { id:20, name:'Mercedes GLE 450',         cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car20.jpg', price:'$78,000',   rating:4.8 },
  { id:21, name:'Mercedes GLE Front',       cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car21.jpg', price:'$80,000',   rating:4.8 },
  { id:22, name:'Mercedes GLE Grille',      cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car22.jpg', price:'$82,000',   rating:4.8 },
  { id:23, name:'Mercedes GLE Side',        cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car23.jpg', price:'$84,000',   rating:4.8 },
  { id:24, name:'Night Drive',              cat:'Supercar',          img:'/auto1groupoe/images/cars/car24.jpg', price:'$220,000',  rating:5.0 },
  { id:25, name:'Cadillac XT4',             cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car25.jpg', price:'$48,000',   rating:4.6 },
  { id:26, name:'BMW 3 Series',             cat:'Luxury Sedan',      img:'/auto1groupoe/images/cars/car26.jpg', price:'$44,000',   rating:4.7 },
  { id:27, name:'BMW X3 Black',             cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car27.jpg', price:'$55,000',   rating:4.7 },
  { id:28, name:'BMW 7 Series',             cat:'Ultra Luxury Sedan', img:'/auto1groupoe/images/cars/car28.jpg', price:'$98,000',  rating:4.9 },
  { id:29, name:'BMW X3 Front',             cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car29.jpg', price:'$56,000',   rating:4.7 },
  { id:30, name:'BMW X6 M',                 cat:'Sports SUV',        img:'/auto1groupoe/images/cars/car30.jpg', price:'$108,000',  rating:4.9 },
  { id:31, name:'BMW X3 Rear',              cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car31.jpg', price:'$54,000',   rating:4.6 },
  { id:32, name:'BMW M3 Black',             cat:'Sports Sedan',      img:'/auto1groupoe/images/cars/car32.jpg', price:'$76,000',   rating:4.8 },
  { id:33, name:'Range Rover Sport Black',  cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car33.jpg', price:'$125,000',  rating:4.9 },
  { id:34, name:'Range Rover Sport Front',  cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car34.jpg', price:'$122,000',  rating:4.9 },
  { id:35, name:'Range Rover Sport Road',   cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car35.jpg', price:'$120,000',  rating:4.9 },
  { id:36, name:'Range Rover Sport Low',    cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car36.jpg', price:'$118,000',  rating:4.8 },
  { id:37, name:'Range Rover Evoque Red',   cat:'Compact Luxury SUV',img:'/auto1groupoe/images/cars/car37.jpg', price:'$55,000',   rating:4.7 },
  { id:38, name:'Range Rover Sport Side',   cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car38.jpg', price:'$116,000',  rating:4.8 },
  { id:39, name:'Range Rover Sport Drive',  cat:'Luxury SUV',        img:'/auto1groupoe/images/cars/car39.jpg', price:'$115,000',  rating:4.8 },
  { id:40, name:'BMW 4 Series NYC',         cat:'Sports Coupe',      img:'/auto1groupoe/images/cars/car40.jpg', price:'$58,000',   rating:4.8 },
];
/* updated */
