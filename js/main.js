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
  { id:1,  name:'Mercedes-Benz S-Class',     cat:'Luxury Sedan',      img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/2021_Mercedes-Benz_S580_4Matic_in_Mojave_Silver%2C_front_8.28.21.jpg/640px-2021_Mercedes-Benz_S580_4Matic_in_Mojave_Silver%2C_front_8.28.21.jpg', price:'$142,000', rating:4.9 },
  { id:2,  name:'BMW 7 Series',              cat:'Luxury Sedan',      img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/BMW_7_series_G11_silver.jpg/640px-BMW_7_series_G11_silver.jpg', price:'$98,000',  rating:4.8 },
  { id:3,  name:'Audi A8',                   cat:'Luxury Sedan',      img:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/2018_Audi_A8_L_%28D5%29_quattro_automatic%2C_front_8.27.18.jpg/640px-2018_Audi_A8_L_%28D5%29_quattro_automatic%2C_front_8.27.18.jpg', price:'$88,000',  rating:4.7 },
  { id:4,  name:'Lexus LS 500',              cat:'Luxury Sedan',      img:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/2018_Lexus_LS_500_AWD%2C_front_5.14.18.jpg/640px-2018_Lexus_LS_500_AWD%2C_front_5.14.18.jpg', price:'$78,000',  rating:4.7 },
  { id:5,  name:'Porsche Panamera',          cat:'Luxury Sedan',      img:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/2021_Porsche_Panamera_4_E-Hybrid%2C_front_8.6.21.jpg/640px-2021_Porsche_Panamera_4_E-Hybrid%2C_front_8.6.21.jpg', price:'$115,000', rating:4.9 },
  { id:6,  name:'Bentley Continental GT',    cat:'Ultra Luxury',      img:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/2020_Bentley_Continental_GT_V8%2C_front_8.26.19.jpg/640px-2020_Bentley_Continental_GT_V8%2C_front_8.26.19.jpg', price:'$220,000', rating:5.0 },
  { id:7,  name:'Rolls-Royce Ghost',         cat:'Ultra Luxury',      img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/2021_Rolls-Royce_Ghost_%28facelift%2C_black%29%2C_front_8.23.21.jpg/640px-2021_Rolls-Royce_Ghost_%28facelift%2C_black%29%2C_front_8.23.21.jpg', price:'$350,000', rating:5.0 },
  { id:8,  name:'Range Rover Autobiography', cat:'Luxury SUV',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/2022_Range_Rover_Autobiography_P530_Automatic%2C_front_6.24.22.jpg/640px-2022_Range_Rover_Autobiography_P530_Automatic%2C_front_6.24.22.jpg', price:'$175,000', rating:4.8 },
  { id:9,  name:'Porsche Cayenne Turbo',     cat:'Luxury SUV',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/2019_Porsche_Cayenne_Turbo_AWD%2C_front_9.16.19.jpg/640px-2019_Porsche_Cayenne_Turbo_AWD%2C_front_9.16.19.jpg', price:'$135,000', rating:4.9 },
  { id:10, name:'BMW X7',                    cat:'Luxury SUV',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/2019_BMW_X7_xDrive40i%2C_front_9.16.19.jpg/640px-2019_BMW_X7_xDrive40i%2C_front_9.16.19.jpg', price:'$108,000', rating:4.7 },
  { id:11, name:'Lamborghini Urus',          cat:'Super SUV',         img:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/2019_Lamborghini_Urus_AWD%2C_front_9.16.19.jpg/640px-2019_Lamborghini_Urus_AWD%2C_front_9.16.19.jpg', price:'$228,000', rating:5.0 },
  { id:12, name:'Ford Bronco',               cat:'Off-Road SUV',      img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/2021_Ford_Bronco_Wildtrak_4-Door%2C_front_7.20.20.jpg/640px-2021_Ford_Bronco_Wildtrak_4-Door%2C_front_7.20.20.jpg', price:'$48,000',  rating:4.6 },
  { id:13, name:'Jeep Wrangler Rubicon',     cat:'Off-Road SUV',      img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/2018_Jeep_Wrangler_Rubicon_%28JL%29%2C_front_4.10.18.jpg/640px-2018_Jeep_Wrangler_Rubicon_%28JL%29%2C_front_4.10.18.jpg', price:'$52,000',  rating:4.5 },
  { id:14, name:'Ferrari 488 GTB',           cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Ferrari_488_GTB.jpg/640px-Ferrari_488_GTB.jpg', price:'$280,000', rating:5.0 },
  { id:15, name:'Lamborghini Huracán',       cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/2019_Lamborghini_Huracan_EVO%2C_front_9.16.19.jpg/640px-2019_Lamborghini_Huracan_EVO%2C_front_9.16.19.jpg', price:'$248,000', rating:5.0 },
  { id:16, name:'Porsche 911 GT3',           cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/2022_Porsche_911_GT3_%28992%29%2C_front_5.2.22.jpg/640px-2022_Porsche_911_GT3_%28992%29%2C_front_5.2.22.jpg', price:'$175,000', rating:5.0 },
  { id:17, name:'McLaren 720S',              cat:'Supercar',          img:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/2019_McLaren_720S_Performance%2C_front_9.16.19.jpg/640px-2019_McLaren_720S_Performance%2C_front_9.16.19.jpg', price:'$320,000', rating:5.0 },
  { id:18, name:'Bugatti Chiron',            cat:'Hypercar',          img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/2019_Bugatti_Chiron_Sport_%2C_front_9.17.19.jpg/640px-2019_Bugatti_Chiron_Sport_%2C_front_9.17.19.jpg', price:'$3,200,000',rating:5.0 },
  { id:19, name:'Tesla Model S Plaid',       cat:'Electric',          img:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/2021_Tesla_Model_S_Plaid%2C_front_7.28.21.jpg/640px-2021_Tesla_Model_S_Plaid%2C_front_7.28.21.jpg', price:'$89,000',  rating:4.8 },
  { id:20, name:'Tesla Model X',             cat:'Electric SUV',      img:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/2022_Tesla_Model_X_Long_Range%2C_front_10.24.22.jpg/640px-2022_Tesla_Model_X_Long_Range%2C_front_10.24.22.jpg', price:'$99,000',  rating:4.7 },
  { id:21, name:'Aston Martin Vantage',      cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/2019_Aston_Martin_Vantage%2C_front_9.15.19.jpg/640px-2019_Aston_Martin_Vantage%2C_front_9.15.19.jpg', price:'$145,000', rating:4.9 },
  { id:22, name:'Maserati GranTurismo',      cat:'Italian Luxury',    img:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/2023_Maserati_GranTurismo_Modena%2C_front_6.9.23.jpg/640px-2023_Maserati_GranTurismo_Modena%2C_front_6.9.23.jpg', price:'$175,000', rating:4.7 },
  { id:23, name:'Cadillac Escalade',         cat:'Full-Size SUV',     img:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/2021_Cadillac_Escalade_Sport%2C_front_10.26.20.jpg/640px-2021_Cadillac_Escalade_Sport%2C_front_10.26.20.jpg', price:'$98,000',  rating:4.6 },
  { id:24, name:'Ford F-150 Raptor',         cat:'Performance Truck', img:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/2021_Ford_F-150_Raptor%2C_front_2.17.21.jpg/640px-2021_Ford_F-150_Raptor%2C_front_2.17.21.jpg', price:'$68,000',  rating:4.7 },
  { id:25, name:'Chevrolet Corvette C8',     cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/2020_Chevrolet_Corvette_C8_Stingray%2C_front_10.22.19.jpg/640px-2020_Chevrolet_Corvette_C8_Stingray%2C_front_10.22.19.jpg', price:'$68,000',  rating:4.8 },
  { id:26, name:'Dodge Challenger SRT',      cat:'Muscle Car',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/2018_Dodge_Challenger_SRT_Hellcat_Widebody%2C_front_4.20.18.jpg/640px-2018_Dodge_Challenger_SRT_Hellcat_Widebody%2C_front_4.20.18.jpg', price:'$72,000',  rating:4.6 },
  { id:27, name:'Mercedes AMG GT',           cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/2020_Mercedes-AMG_GT_C%2C_front_9.7.19.jpg/640px-2020_Mercedes-AMG_GT_C%2C_front_9.7.19.jpg', price:'$118,000', rating:4.8 },
  { id:28, name:'BMW M4 Competition',        cat:'Sports Sedan',      img:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/2022_BMW_M4_Competition_xDrive%2C_front_5.22.22.jpg/640px-2022_BMW_M4_Competition_xDrive%2C_front_5.22.22.jpg', price:'$75,000',  rating:4.7 },
  { id:29, name:'Audi R8 V10',               cat:'Supercar',          img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/2020_Audi_R8_V10_Performance%2C_front_1.24.20.jpg/640px-2020_Audi_R8_V10_Performance%2C_front_1.24.20.jpg', price:'$165,000', rating:4.9 },
  { id:30, name:'Jaguar F-Type R',           cat:'British Sport',     img:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/2021_Jaguar_F-Type_R_AWD%2C_front_7.19.20.jpg/640px-2021_Jaguar_F-Type_R_AWD%2C_front_7.19.20.jpg', price:'$105,000', rating:4.7 },
  { id:31, name:'Alfa Romeo Giulia QV',      cat:'Italian Sport',     img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/2017_Alfa_Romeo_Giulia_Quadrifoglio%2C_front_4.17.18.jpg/640px-2017_Alfa_Romeo_Giulia_Quadrifoglio%2C_front_4.17.18.jpg', price:'$82,000',  rating:4.6 },
  { id:32, name:'Volvo XC90',               cat:'Luxury SUV',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Volvo_XC90_II_%28facelift%2C_silver%29%2C_front_8.10.19.jpg/640px-Volvo_XC90_II_%28facelift%2C_silver%29%2C_front_8.10.19.jpg', price:'$78,000',  rating:4.6 },
  { id:33, name:'Lincoln Navigator',         cat:'Full-Size SUV',     img:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/2018_Lincoln_Navigator_Select%2C_front_10.30.17.jpg/640px-2018_Lincoln_Navigator_Select%2C_front_10.30.17.jpg', price:'$82,000',  rating:4.5 },
  { id:34, name:'Genesis GV80',              cat:'Luxury SUV',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/2021_Genesis_GV80_2.5T_AWD%2C_front_10.26.20.jpg/640px-2021_Genesis_GV80_2.5T_AWD%2C_front_10.26.20.jpg', price:'$57,000',  rating:4.7 },
  { id:35, name:'Toyota GR Supra',           cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/2020_Toyota_GR_Supra_%28A90%29%2C_front_9.17.19.jpg/640px-2020_Toyota_GR_Supra_%28A90%29%2C_front_9.17.19.jpg', price:'$56,000',  rating:4.6 },
  { id:36, name:'Nissan GT-R',               cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/2017_Nissan_GT-R_Premium_%28R35%29%2C_front_4.21.18.jpg/640px-2017_Nissan_GT-R_Premium_%28R35%29%2C_front_4.21.18.jpg', price:'$115,000', rating:4.8 },
  { id:37, name:'Honda NSX',                 cat:'Hybrid Supercar',   img:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/2017_Acura_NSX%2C_front_9.8.17.jpg/640px-2017_Acura_NSX%2C_front_9.8.17.jpg', price:'$157,000', rating:4.8 },
  { id:38, name:'Bentley Bentayga',          cat:'Luxury SUV',        img:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/2021_Bentley_Bentayga_V8%2C_front_7.19.20.jpg/640px-2021_Bentley_Bentayga_V8%2C_front_7.19.20.jpg', price:'$195,000', rating:4.9 },
  { id:39, name:'Ferrari Portofino',         cat:'Grand Tourer',      img:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/2019_Ferrari_Portofino%2C_front_9.15.19.jpg/640px-2019_Ferrari_Portofino%2C_front_9.15.19.jpg', price:'$215,000', rating:4.9 },
  { id:40, name:'Koenigsegg Agera',          cat:'Hypercar',          img:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Koenigsegg_Agera_RS_-_Goodwood_Festival_of_Speed_2018_%2842898664740%29.jpg/640px-Koenigsegg_Agera_RS_-_Goodwood_Festival_of_Speed_2018_%2842898664740%29.jpg', price:'$2,500,000',rating:5.0 },
];
