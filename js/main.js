// ── USER STORE ──────────────────────────────────────────
const Store = {
  get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  remove(key) { localStorage.removeItem(key); }
};

// ── REFERRAL CODE GENERATOR ──────────────────────────────
function genReferral() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'A1-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ── AUTH HELPERS ─────────────────────────────────────────
function getUser() { return Store.get('a1g_user'); }
function requireAuth() {
  if (!getUser()) { window.location.href = 'signin.html'; }
}
function logout() {
  Store.remove('a1g_user');
  window.location.href = 'index.html';
}

// ── TOAST ────────────────────────────────────────────────
function showToast(msg, duration = 2800) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ── PANEL ────────────────────────────────────────────────
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

// ── INITIALS ─────────────────────────────────────────────
function initials(name) {
  return (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
}

// ── FORMAT CURRENCY ──────────────────────────────────────
function formatMoney(n) {
  return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ── BONUS & GATE CONSTANTS ────────────────────────────────
const WELCOME_BONUS     = 80;   // $80 welcome bonus credited on signup
const BONUS_MATCH_LIMIT = 33;   // welcome bonus covers first 33 matches
const DEPOSIT_REQUIRED  = 50;   // minimum deposit needed to continue after match 33
const MAX_MATCH         = 40;   // total matches per round

// ── CAR DATA ─────────────────────────────────────────────
const CARS = [
  { id:1,  name:'Mercedes-Benz S-Class',     cat:'Luxury Sedan',      img:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80', price:'$142,000', rating:4.9 },
  { id:2,  name:'BMW 7 Series',              cat:'Luxury Sedan',      img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80', price:'$98,000',  rating:4.8 },
  { id:3,  name:'Audi A8',                   cat:'Luxury Sedan',      img:'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=600&q=80', price:'$88,000',  rating:4.7 },
  { id:4,  name:'Lexus LS 500',              cat:'Luxury Sedan',      img:'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80', price:'$78,000',  rating:4.7 },
  { id:5,  name:'Genesis G90',               cat:'Luxury Sedan',      img:'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80', price:'$92,000',  rating:4.6 },
  { id:6,  name:'Porsche Panamera',          cat:'Luxury Sedan',      img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80', price:'$115,000', rating:4.9 },
  { id:7,  name:'Bentley Flying Spur',       cat:'Ultra Luxury',      img:'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&q=80', price:'$220,000', rating:5.0 },
  { id:8,  name:'Rolls-Royce Ghost',         cat:'Ultra Luxury',      img:'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=600&q=80', price:'$350,000', rating:5.0 },
  { id:9,  name:'Range Rover Autobiography', cat:'Luxury SUV',        img:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80', price:'$175,000', rating:4.8 },
  { id:10, name:'Porsche Cayenne Turbo',     cat:'Luxury SUV',        img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80', price:'$135,000', rating:4.9 },
  { id:11, name:'BMW X7',                    cat:'Luxury SUV',        img:'https://images.unsplash.com/photo-1551830820-330a71b99659?w=600&q=80', price:'$108,000', rating:4.7 },
  { id:12, name:'Mercedes GLS 600',          cat:'Luxury SUV',        img:'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&q=80', price:'$165,000', rating:4.8 },
  { id:13, name:'Lamborghini Urus',          cat:'Super SUV',         img:'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80', price:'$228,000', rating:5.0 },
  { id:14, name:'Bentley Bentayga',          cat:'Luxury SUV',        img:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80', price:'$195,000', rating:4.9 },
  { id:15, name:'Ford Bronco',               cat:'Off-Road SUV',      img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80', price:'$48,000',  rating:4.6 },
  { id:16, name:'Jeep Wrangler Rubicon',     cat:'Off-Road SUV',      img:'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80', price:'$52,000',  rating:4.5 },
  { id:17, name:'Toyota Land Cruiser 300',   cat:'Off-Road SUV',      img:'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&q=80', price:'$88,000',  rating:4.8 },
  { id:18, name:'Ferrari Roma',              cat:'Sports Car',        img:'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=600&q=80', price:'$225,000', rating:5.0 },
  { id:19, name:'Lamborghini Huracán',       cat:'Sports Car',        img:'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&q=80', price:'$248,000', rating:5.0 },
  { id:20, name:'Porsche 911 GT3',           cat:'Sports Car',        img:'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&q=80', price:'$175,000', rating:5.0 },
  { id:21, name:'Aston Martin DB12',         cat:'Sports Car',        img:'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80', price:'$245,000', rating:5.0 },
  { id:22, name:'McLaren 720S',              cat:'Supercar',          img:'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=600&q=80', price:'$320,000', rating:5.0 },
  { id:23, name:'Ferrari F8 Tributo',        cat:'Supercar',          img:'https://images.unsplash.com/photo-1493238792000-8113da705763?w=600&q=80', price:'$285,000', rating:5.0 },
  { id:24, name:'Bugatti Chiron',            cat:'Hypercar',          img:'https://images.unsplash.com/photo-1576220258822-7a4a5e0d3e97?w=600&q=80', price:'$3,200,000',rating:5.0 },
  { id:25, name:'Tesla Model S Plaid',       cat:'Electric',          img:'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80', price:'$89,000',  rating:4.8 },
  { id:26, name:'BMW iX M60',               cat:'Electric SUV',      img:'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80', price:'$112,000', rating:4.7 },
  { id:27, name:'Mercedes EQS 580',         cat:'Electric Sedan',    img:'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80', price:'$125,000', rating:4.8 },
  { id:28, name:'Rivian R1T',               cat:'Electric Truck',    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', price:'$73,000',  rating:4.6 },
  { id:29, name:'Ford F-150 Raptor',        cat:'Performance Truck', img:'https://images.unsplash.com/photo-1571987502951-3a98f4e4ca48?w=600&q=80', price:'$68,000',  rating:4.7 },
  { id:30, name:'RAM 1500 TRX',             cat:'Performance Truck', img:'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80', price:'$72,000',  rating:4.7 },
  { id:31, name:'Chevrolet Silverado ZR2',  cat:'Performance Truck', img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80', price:'$64,000',  rating:4.5 },
  { id:32, name:'Cadillac Escalade ESV',    cat:'Full-Size SUV',     img:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80', price:'$98,000',  rating:4.6 },
  { id:33, name:'Lincoln Navigator',        cat:'Full-Size SUV',     img:'https://images.unsplash.com/photo-1551830820-330a71b99659?w=600&q=80', price:'$82,000',  rating:4.5 },
  { id:34, name:'Maserati Quattroporte',    cat:'Italian Luxury',    img:'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=600&q=80', price:'$115,000', rating:4.7 },
  { id:35, name:'Alfa Romeo Giulia QV',     cat:'Italian Sport',     img:'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600&q=80', price:'$82,000',  rating:4.6 },
  { id:36, name:'Jaguar F-Type R',          cat:'British Sport',     img:'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80', price:'$105,000', rating:4.7 },
  { id:37, name:'Volvo XC90 Recharge',      cat:'Luxury SUV',        img:'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&q=80', price:'$78,000',  rating:4.6 },
  { id:38, name:'Infiniti QX80',            cat:'Full-Size SUV',     img:'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=80', price:'$72,000',  rating:4.4 },
  { id:39, name:'Acura NSX Type S',         cat:'Sports Car',        img:'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=600&q=80', price:'$215,000', rating:4.9 },
  { id:40, name:'Koenigsegg Jesko',         cat:'Hypercar',          img:'https://images.unsplash.com/photo-1576220258822-7a4a5e0d3e97?w=600&q=80', price:'$3,000,000',rating:5.0 },
];
