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
  { id:1,  name:'Mercedes-Benz S-Class',     cat:'Luxury Sedan',      img:'https://cdn.pixabay.com/photo/2016/11/18/12/51/automobile-1834286_640.jpg', price:'$142,000', rating:4.9 },
  { id:2,  name:'BMW 7 Series',              cat:'Luxury Sedan',      img:'https://cdn.pixabay.com/photo/2019/07/07/14/03/bmw-4322521_640.jpg', price:'$98,000',  rating:4.8 },
  { id:3,  name:'Audi A8',                   cat:'Luxury Sedan',      img:'https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_640.jpg', price:'$88,000',  rating:4.7 },
  { id:4,  name:'Lexus LS 500',              cat:'Luxury Sedan',      img:'https://cdn.pixabay.com/photo/2020/02/18/10/05/car-4858503_640.jpg', price:'$78,000',  rating:4.7 },
  { id:5,  name:'Genesis G90',               cat:'Luxury Sedan',      img:'https://cdn.pixabay.com/photo/2016/04/01/12/16/car-1300629_640.png', price:'$92,000',  rating:4.6 },
  { id:6,  name:'Porsche Panamera',          cat:'Luxury Sedan',      img:'https://cdn.pixabay.com/photo/2018/02/21/03/15/porsche-3169783_640.jpg', price:'$115,000', rating:4.9 },
  { id:7,  name:'Bentley Flying Spur',       cat:'Ultra Luxury',      img:'https://cdn.pixabay.com/photo/2017/06/15/18/09/bentley-2406277_640.jpg', price:'$220,000', rating:5.0 },
  { id:8,  name:'Rolls-Royce Ghost',         cat:'Ultra Luxury',      img:'https://cdn.pixabay.com/photo/2017/03/27/14/25/rolls-royce-2179079_640.jpg', price:'$350,000', rating:5.0 },
  { id:9,  name:'Range Rover Autobiography', cat:'Luxury SUV',        img:'https://cdn.pixabay.com/photo/2016/09/01/08/49/range-rover-1635086_640.jpg', price:'$175,000', rating:4.8 },
  { id:10, name:'Porsche Cayenne Turbo',     cat:'Luxury SUV',        img:'https://cdn.pixabay.com/photo/2018/09/19/23/17/porsche-3689408_640.jpg', price:'$135,000', rating:4.9 },
  { id:11, name:'BMW X7',                    cat:'Luxury SUV',        img:'https://cdn.pixabay.com/photo/2019/07/08/10/46/bmw-4324734_640.jpg', price:'$108,000', rating:4.7 },
  { id:12, name:'Mercedes GLS 600',          cat:'Luxury SUV',        img:'https://cdn.pixabay.com/photo/2016/11/18/12/51/automobile-1834286_640.jpg', price:'$165,000', rating:4.8 },
  { id:13, name:'Lamborghini Urus',          cat:'Super SUV',         img:'https://cdn.pixabay.com/photo/2019/09/08/09/11/lamborghini-4460820_640.jpg', price:'$228,000', rating:5.0 },
  { id:14, name:'Bentley Bentayga',          cat:'Luxury SUV',        img:'https://cdn.pixabay.com/photo/2017/06/15/18/09/bentley-2406277_640.jpg', price:'$195,000', rating:4.9 },
  { id:15, name:'Ford Bronco',               cat:'Off-Road SUV',      img:'https://cdn.pixabay.com/photo/2021/09/10/18/49/ford-6613718_640.jpg', price:'$48,000',  rating:4.6 },
  { id:16, name:'Jeep Wrangler Rubicon',     cat:'Off-Road SUV',      img:'https://cdn.pixabay.com/photo/2018/07/16/07/30/jeep-3540974_640.jpg', price:'$52,000',  rating:4.5 },
  { id:17, name:'Toyota Land Cruiser',       cat:'Off-Road SUV',      img:'https://cdn.pixabay.com/photo/2018/01/04/21/39/toyota-3060613_640.jpg', price:'$88,000',  rating:4.8 },
  { id:18, name:'Ferrari Roma',              cat:'Sports Car',        img:'https://cdn.pixabay.com/photo/2016/11/18/15/44/ferrari-1834600_640.jpg', price:'$225,000', rating:5.0 },
  { id:19, name:'Lamborghini Huracán',       cat:'Sports Car',        img:'https://cdn.pixabay.com/photo/2017/08/10/08/02/lamborghini-2619160_640.jpg', price:'$248,000', rating:5.0 },
  { id:20, name:'Porsche 911 GT3',           cat:'Sports Car',        img:'https://cdn.pixabay.com/photo/2018/02/21/03/15/porsche-3169783_640.jpg', price:'$175,000', rating:5.0 },
  { id:21, name:'Aston Martin DB12',         cat:'Sports Car',        img:'https://cdn.pixabay.com/photo/2019/10/19/10/30/aston-martin-4561142_640.jpg', price:'$245,000', rating:5.0 },
  { id:22, name:'McLaren 720S',              cat:'Supercar',          img:'https://cdn.pixabay.com/photo/2019/09/29/22/04/mclaren-4513206_640.jpg', price:'$320,000', rating:5.0 },
  { id:23, name:'Ferrari F8 Tributo',        cat:'Supercar',          img:'https://cdn.pixabay.com/photo/2016/11/18/15/44/ferrari-1834600_640.jpg', price:'$285,000', rating:5.0 },
  { id:24, name:'Bugatti Chiron',            cat:'Hypercar',          img:'https://cdn.pixabay.com/photo/2017/11/08/19/40/bugatti-2931084_640.jpg', price:'$3,200,000',rating:5.0 },
  { id:25, name:'Tesla Model S Plaid',       cat:'Electric',          img:'https://cdn.pixabay.com/photo/2020/08/24/21/26/tesla-5515844_640.jpg', price:'$89,000',  rating:4.8 },
  { id:26, name:'BMW iX M60',               cat:'Electric SUV',      img:'https://cdn.pixabay.com/photo/2019/07/08/10/46/bmw-4324734_640.jpg', price:'$112,000', rating:4.7 },
  { id:27, name:'Mercedes EQS 580',         cat:'Electric Sedan',    img:'https://cdn.pixabay.com/photo/2016/11/18/12/51/automobile-1834286_640.jpg', price:'$125,000', rating:4.8 },
  { id:28, name:'Rivian R1T',               cat:'Electric Truck',    img:'https://cdn.pixabay.com/photo/2021/09/10/18/49/ford-6613718_640.jpg', price:'$73,000',  rating:4.6 },
  { id:29, name:'Ford F-150 Raptor',        cat:'Performance Truck', img:'https://cdn.pixabay.com/photo/2017/08/10/02/05/tiles-shapes-2617112_640.jpg', price:'$68,000',  rating:4.7 },
  { id:30, name:'RAM 1500 TRX',             cat:'Performance Truck', img:'https://cdn.pixabay.com/photo/2018/07/16/07/30/jeep-3540974_640.jpg', price:'$72,000',  rating:4.7 },
  { id:31, name:'Chevrolet Silverado ZR2',  cat:'Performance Truck', img:'https://cdn.pixabay.com/photo/2016/04/01/12/16/car-1300629_640.png', price:'$64,000',  rating:4.5 },
  { id:32, name:'Cadillac Escalade ESV',    cat:'Full-Size SUV',     img:'https://cdn.pixabay.com/photo/2016/09/01/08/49/range-rover-1635086_640.jpg', price:'$98,000',  rating:4.6 },
  { id:33, name:'Lincoln Navigator',        cat:'Full-Size SUV',     img:'https://cdn.pixabay.com/photo/2018/01/04/21/39/toyota-3060613_640.jpg', price:'$82,000',  rating:4.5 },
  { id:34, name:'Maserati Quattroporte',    cat:'Italian Luxury',    img:'https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_640.jpg', price:'$115,000', rating:4.7 },
  { id:35, name:'Alfa Romeo Giulia QV',     cat:'Italian Sport',     img:'https://cdn.pixabay.com/photo/2019/10/19/10/30/aston-martin-4561142_640.jpg', price:'$82,000',  rating:4.6 },
  { id:36, name:'Jaguar F-Type R',          cat:'British Sport',     img:'https://cdn.pixabay.com/photo/2019/09/29/22/04/mclaren-4513206_640.jpg', price:'$105,000', rating:4.7 },
  { id:37, name:'Volvo XC90 Recharge',      cat:'Luxury SUV',        img:'https://cdn.pixabay.com/photo/2018/09/19/23/17/porsche-3689408_640.jpg', price:'$78,000',  rating:4.6 },
  { id:38, name:'Infiniti QX80',            cat:'Full-Size SUV',     img:'https://cdn.pixabay.com/photo/2019/09/08/09/11/lamborghini-4460820_640.jpg', price:'$72,000',  rating:4.4 },
  { id:39, name:'Acura NSX Type S',         cat:'Sports Car',        img:'https://cdn.pixabay.com/photo/2017/11/08/19/40/bugatti-2931084_640.jpg', price:'$215,000', rating:4.9 },
  { id:40, name:'Koenigsegg Jesko',         cat:'Hypercar',          img:'https://cdn.pixabay.com/photo/2017/08/10/08/02/lamborghini-2619160_640.jpg', price:'$3,000,000',rating:5.0 },
];
