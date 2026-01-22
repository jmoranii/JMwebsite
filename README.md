# James Moran - Personal Professional Website

A minimalist, modern single-page professional website serving as an online resume. Built with semantic HTML5, CSS3, and vanilla JavaScript.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 🎯 Purpose

This website serves as a streamlined online resume and professional portfolio, showcasing:
- Professional experience and career progression
- Technical skills and expertise
- Education and volunteer work
- Personal interests and community involvement

## 📁 File Structure

```
project-root/
├── index.html          # Main HTML file with semantic structure
├── styles.css          # All CSS styling with custom properties
├── app.js              # Minimal JavaScript for enhancements
├── README.md           # This documentation file
├── assets/             # Media files
│   ├── headshot.jpg    # Profile photo (replace with your own)
│   └── favicon.ico     # Browser tab icon
└── .gitignore          # Git ignore file
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup with proper heading hierarchy and ARIA labels
- **CSS3** - Custom properties, flexbox, grid, animations, and responsive design
- **Vanilla JavaScript** - Intersection Observer API for scroll animations
- **Google Fonts** - Outfit (display) and Source Serif 4 (body)

## ✨ Features

- **Responsive Design** - Mobile-first approach with tablet and desktop breakpoints
- **Accessibility** - WCAG AA compliant color contrast, semantic HTML, ARIA labels
- **Performance** - Minimal JavaScript, efficient CSS, optimized loading
- **SEO Ready** - Meta tags, Open Graph tags, semantic structure
- **Smooth Animations** - Scroll-triggered fade-ins using Intersection Observer
- **Print Styles** - Optimized for printing as a resume

## 🚀 Getting Started

### View Locally

1. Clone or download this repository
2. Open `index.html` in your web browser

That's it! No build process or dependencies required.

### Development

For development with live reload, you can use any simple HTTP server:

**Using Python (if installed):**
```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000
```

**Using Node.js (if installed):**
```bash
# Install live-server globally (one time)
npm install -g live-server

# Run from project directory
live-server
```

**Using VS Code:**
Install the "Live Server" extension, then right-click `index.html` and select "Open with Live Server"

## 📦 Deployment to GitHub Pages

1. **Create a GitHub repository**
   - Name it `yourusername.github.io` for a user site, or any name for a project site

2. **Push your code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Under "Source", select "Deploy from a branch"
   - Select `main` branch and `/ (root)` folder
   - Click Save

4. **Access your site**
   - Your site will be live at `https://yourusername.github.io` (user site)
   - Or `https://yourusername.github.io/repo-name` (project site)

## 🎨 Customization

### Colors

Edit the CSS custom properties in `styles.css`:

```css
:root {
    --color-navy: #1a2f4e;        /* Primary color */
    --color-accent: #3b82f6;       /* Accent color */
    /* ... other colors */
}
```

### Fonts

The site uses Google Fonts. To change fonts:

1. Update the `<link>` tag in `index.html`
2. Update `--font-display` and `--font-body` in `styles.css`

### Content

All content is in `index.html`. Update:
- Personal information in the hero section
- About me text
- Skills list
- Work experience entries
- Education details
- Highlights section

### Profile Photo

Replace `assets/headshot.jpg` with your own photo. Recommended:
- Square aspect ratio
- At least 400x400 pixels
- Professional appearance

## 🔮 Future Enhancement Ideas

- [ ] Dark mode toggle with `prefers-color-scheme` detection
- [ ] Contact form with Formspree or Netlify Forms
- [ ] Blog section using static site generator
- [ ] Downloadable PDF resume generation
- [ ] Language localization support
- [ ] Project portfolio section with screenshots
- [ ] Testimonials/recommendations carousel
- [ ] Interactive skills chart with D3.js or Chart.js

## 📝 License

This project is open source and available for personal use and learning purposes.

## 🤝 Acknowledgments

- [Google Fonts](https://fonts.google.com/) for typography
- Icons created inline as SVGs (no external dependencies)
- Design inspired by modern resume best practices

---

Built with curiosity and attention to detail.
