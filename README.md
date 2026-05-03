# Auto1 Group — Premium Automotive Advertising Platform

A multi-page HTML/CSS/JS website for an automotive advertising and promotion platform.

## Pages

| File | Description |
|------|-------------|
| `index.html` | Landing page with hero, how it works, car listings |
| `signup.html` | Registration page with referral code |
| `signin.html` | Login page with password reset |
| `home.html` | Dashboard — car slideshow, MATCH, wallet stats |
| `wallet.html` | Deposit & withdrawal management |
| `incentives.html` | Promoter tiers & referral program |
| `profile.html` | Account, FAQs, certificate, settings |

## Features

- 🚗 40 premium car listings with auto-advancing slideshow
- 💰 Wallet system (deposit, withdraw, commission tracking)
- 🎁 3-level referral commission system (20% / 10% / 5%)
- 🔑 Unique referral code generated per user
- 📱 Mobile-first responsive design
- 🌙 Premium navy & gold theme
- 💾 localStorage-based data persistence

## Deploy to GitHub Pages

1. Push all files to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to **main branch / root**
4. Your site will be live at `https://yourusername.github.io/repo-name/`

## Tech Stack

- Pure HTML5, CSS3, JavaScript (no frameworks needed)
- Google Fonts: Playfair Display + Outfit
- Unsplash for car images (free, no attribution required)

## Customisation

- **Colors:** Edit CSS variables in `css/style.css` (`:root` block)
- **Cars:** Edit the `CARS` array in `js/main.js`
- **Commission rates:** Edit `incentives.html` level cards
- **Currency:** Search & replace `$` with your preferred symbol
