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

// Wikimedia Commons direct file URLs - permanently hosted, no hotlink protection
const CARS = [
  { id:1,  name:'Mercedes-Benz S-Class',    cat:'Luxury Sedan',      img:'https://upload.wikimedia.org/wikipedia/commons/7/79/2021_Mercedes-Benz_S580_4Matic_%28facelift%2C_black%29%2C_front_8.2.21.jpg', price:'$142,000', rating:4.9 },
  { id:2,  name:'BMW 7 Series',             cat:'Luxury Sedan',      img:'https://upload.wikimedia.org/wikipedia/commons/5/5c/2023_BMW_760i_xDrive%2C_front_5.27.22.jpg', price:'$98,000',  rating:4.8 },
  { id:3,  name:'Audi A8',                  cat:'Luxury Sedan',      img:'https://upload.wikimedia.org/wikipedia/commons/9/97/2022_Audi_A8_L_60_TFSI_e_quattro_automatic%2C_front_6.18.22.jpg', price:'$88,000',  rating:4.7 },
  { id:4,  name:'Porsche Panamera',         cat:'Luxury Sedan',      img:'https://upload.wikimedia.org/wikipedia/commons/6/6d/2021_Porsche_Panamera_4_E-Hybrid%2C_front_8.6.21.jpg', price:'$115,000', rating:4.9 },
  { id:5,  name:'Bentley Continental GT',   cat:'Ultra Luxury',      img:'https://upload.wikimedia.org/wikipedia/commons/c/c4/2020_Bentley_Continental_GT_V8%2C_front_8.26.19.jpg', price:'$220,000', rating:5.0 },
  { id:6,  name:'Rolls-Royce Ghost',        cat:'Ultra Luxury',      img:'https://upload.wikimedia.org/wikipedia/commons/1/10/2021_Rolls-Royce_Ghost_%28facelift%2C_black%29%2C_front_8.23.21.jpg', price:'$350,000', rating:5.0 },
  { id:7,  name:'Range Rover Autobiography',cat:'Luxury SUV',        img:'https://upload.wikimedia.org/wikipedia/commons/9/9d/2022_Range_Rover_Autobiography_P530_Automatic%2C_front_6.24.22.jpg', price:'$175,000', rating:4.8 },
  { id:8,  name:'Porsche Cayenne Turbo',    cat:'Luxury SUV',        img:'https://upload.wikimedia.org/wikipedia/commons/9/96/2019_Porsche_Cayenne_Turbo_AWD%2C_front_9.16.19.jpg', price:'$135,000', rating:4.9 },
  { id:9,  name:'BMW X7',                   cat:'Luxury SUV',        img:'https://upload.wikimedia.org/wikipedia/commons/a/af/2019_BMW_X7_xDrive40i%2C_front_9.16.19.jpg', price:'$108,000', rating:4.7 },
  { id:10, name:'Lamborghini Urus',         cat:'Super SUV',         img:'https://upload.wikimedia.org/wikipedia/commons/2/21/2019_Lamborghini_Urus_AWD%2C_front_9.16.19.jpg', price:'$228,000', rating:5.0 },
  { id:11, name:'Ferrari 488 GTB',          cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/1/1c/Ferrari_488_GTB.jpg', price:'$280,000', rating:5.0 },
  { id:12, name:'Lamborghini Huracán EVO',  cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/6/69/2019_Lamborghini_Huracan_EVO%2C_front_9.16.19.jpg', price:'$248,000', rating:5.0 },
  { id:13, name:'Porsche 911 GT3',          cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/a/a0/2022_Porsche_911_GT3_%28992%29%2C_front_5.2.22.jpg', price:'$175,000', rating:5.0 },
  { id:14, name:'McLaren 720S',             cat:'Supercar',          img:'https://upload.wikimedia.org/wikipedia/commons/4/42/2019_McLaren_720S_Performance%2C_front_9.16.19.jpg', price:'$320,000', rating:5.0 },
  { id:15, name:'Bugatti Chiron Sport',     cat:'Hypercar',          img:'https://upload.wikimedia.org/wikipedia/commons/9/95/2019_Bugatti_Chiron_Sport_%2C_front_9.17.19.jpg', price:'$3,200,000', rating:5.0 },
  { id:16, name:'Tesla Model S Plaid',      cat:'Electric',          img:'https://upload.wikimedia.org/wikipedia/commons/4/4c/2021_Tesla_Model_S_Plaid%2C_front_7.28.21.jpg', price:'$89,000',  rating:4.8 },
  { id:17, name:'Tesla Model X',            cat:'Electric SUV',      img:'https://upload.wikimedia.org/wikipedia/commons/8/8c/2022_Tesla_Model_X_Long_Range%2C_front_10.24.22.jpg', price:'$99,000',  rating:4.7 },
  { id:18, name:'Aston Martin Vantage',     cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/c/ca/2019_Aston_Martin_Vantage%2C_front_9.15.19.jpg', price:'$145,000', rating:4.9 },
  { id:19, name:'Mercedes AMG GT',          cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/4/4c/2020_Mercedes-AMG_GT_C%2C_front_9.7.19.jpg', price:'$118,000', rating:4.8 },
  { id:20, name:'BMW M4 Competition',       cat:'Sports Sedan',      img:'https://upload.wikimedia.org/wikipedia/commons/5/5f/2022_BMW_M4_Competition_xDrive%2C_front_5.22.22.jpg', price:'$75,000',  rating:4.7 },
  { id:21, name:'Audi R8 V10',             cat:'Supercar',          img:'https://upload.wikimedia.org/wikipedia/commons/9/9d/2020_Audi_R8_V10_Performance%2C_front_1.24.20.jpg', price:'$165,000', rating:4.9 },
  { id:22, name:'Jaguar F-Type R',          cat:'British Sport',     img:'https://upload.wikimedia.org/wikipedia/commons/d/d8/2021_Jaguar_F-Type_R_AWD%2C_front_7.19.20.jpg', price:'$105,000', rating:4.7 },
  { id:23, name:'Alfa Romeo Giulia QV',     cat:'Italian Sport',     img:'https://upload.wikimedia.org/wikipedia/commons/3/31/2017_Alfa_Romeo_Giulia_Quadrifoglio%2C_front_4.17.18.jpg', price:'$82,000',  rating:4.6 },
  { id:24, name:'Maserati GranTurismo',     cat:'Italian Luxury',    img:'https://upload.wikimedia.org/wikipedia/commons/0/01/2023_Maserati_GranTurismo_Modena%2C_front_6.9.23.jpg', price:'$175,000', rating:4.7 },
  { id:25, name:'Cadillac Escalade',        cat:'Full-Size SUV',     img:'https://upload.wikimedia.org/wikipedia/commons/1/1d/2021_Cadillac_Escalade_Sport%2C_front_10.26.20.jpg', price:'$98,000',  rating:4.6 },
  { id:26, name:'Ford F-150 Raptor',        cat:'Performance Truck', img:'https://upload.wikimedia.org/wikipedia/commons/b/b7/2021_Ford_F-150_Raptor%2C_front_2.17.21.jpg', price:'$68,000',  rating:4.7 },
  { id:27, name:'Chevrolet Corvette C8',    cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/5/5e/2020_Chevrolet_Corvette_C8_Stingray%2C_front_10.22.19.jpg', price:'$68,000',  rating:4.8 },
  { id:28, name:'Dodge Challenger SRT',     cat:'Muscle Car',        img:'https://upload.wikimedia.org/wikipedia/commons/e/ef/2018_Dodge_Challenger_SRT_Hellcat_Widebody%2C_front_4.20.18.jpg', price:'$72,000',  rating:4.6 },
  { id:29, name:'Toyota GR Supra',          cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/d/d4/2020_Toyota_GR_Supra_%28A90%29%2C_front_9.17.19.jpg', price:'$56,000',  rating:4.6 },
  { id:30, name:'Nissan GT-R',              cat:'Sports Car',        img:'https://upload.wikimedia.org/wikipedia/commons/5/55/2017_Nissan_GT-R_Premium_%28R35%29%2C_front_4.21.18.jpg', price:'$115,000', rating:4.8 },
  { id:31, name:'Honda NSX',               cat:'Hybrid Supercar',   img:'https://upload.wikimedia.org/wikipedia/commons/b/b1/2017_Acura_NSX%2C_front_9.8.17.jpg', price:'$157,000', rating:4.8 },
  { id:32, name:'Bentley Bentayga',         cat:'Luxury SUV',        img:'https://upload.wikimedia.org/wikipedia/commons/7/70/2021_Bentley_Bentayga_V8%2C_front_7.19.20.jpg', price:'$195,000', rating:4.9 },
  { id:33, name:'Rolls-Royce Cullinan',     cat:'Luxury SUV',        img:'https://upload.wikimedia.org/wikipedia/commons/8/8a/2019_Rolls-Royce_Cullinan%2C_front_9.16.19.jpg', price:'$330,000', rating:5.0 },
  { id:34, name:'Ferrari Portofino',        cat:'Grand Tourer',      img:'https://upload.wikimedia.org/wikipedia/commons/b/b3/2019_Ferrari_Portofino%2C_front_9.15.19.jpg', price:'$215,000', rating:4.9 },
  { id:35, name:'Genesis GV80',             cat:'Luxury SUV',        img:'https://upload.wikimedia.org/wikipedia/commons/3/37/2021_Genesis_GV80_2.5T_AWD%2C_front_10.26.20.jpg', price:'$57,000',  rating:4.7 },
  { id:36, name:'Volvo XC90',              cat:'Luxury SUV',        img:'https://upload.wikimedia.org/wikipedia/commons/5/56/Volvo_XC90_II_%28facelift%2C_silver%29%2C_front_8.10.19.jpg', price:'$78,000',  rating:4.6 },
  { id:37, name:'Lincoln Navigator',        cat:'Full-Size SUV',     img:'https://upload.wikimedia.org/wikipedia/commons/9/99/2018_Lincoln_Navigator_Select%2C_front_10.30.17.jpg', price:'$82,000',  rating:4.5 },
  { id:38, name:'Ford Bronco',              cat:'Off-Road SUV',      img:'https://upload.wikimedia.org/wikipedia/commons/9/93/2021_Ford_Bronco_Wildtrak_4-Door%2C_front_7.20.20.jpg', price:'$48,000',  rating:4.6 },
  { id:39, name:'Jeep Wrangler Rubicon',    cat:'Off-Road SUV',      img:'https://upload.wikimedia.org/wikipedia/commons/0/00/2018_Jeep_Wrangler_Rubicon_%28JL%29%2C_front_4.10.18.jpg', price:'$52,000',  rating:4.5 },
  { id:40, name:'Lexus LC 500',             cat:'Luxury Coupe',      img:'https://upload.wikimedia.org/wikipedia/commons/6/60/2018_Lexus_LC_500%2C_front_4.9.18.jpg', price:'$93,000',  rating:4.8 },
];
