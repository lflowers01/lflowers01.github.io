
Welcome to the repository for my personal website! This is where I showcase my projects, certifications, leadership roles, and activities. I built this site using modern web technologies and host it on GitHub Pages.

## Features

- **Portfolio**: A collection of my projects with descriptions and images.
- **Certifications**: A display of my professional certifications with links.
- **Leadership & Activities**: Highlights of my leadership roles and extracurricular activities.
- **Dark Mode**: A toggle to switch between light and dark themes.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Winamp Player**: A retro music player for a nostalgic touch.
- **Image Optimization**: Automatically optimizes images for better performance.

## Technologies I Used

- **Frontend**: HTML, SCSS, JavaScript
- **Build Tools**: Vite, Rollup
- **Image Processing**: Sharp
- **Plugins**: Handlebars, 98.css
- **Deployment**: GitHub Pages

## How to Set It Up

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/lflowers01/lflowers01.github.io.git
   cd lflowers01.github.io
   ```

2. **Install Dependencies**:
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Build the Project**:
   ```bash
   npm run build
   ```

5. **Optimize Images**:
   Run the image optimization script:
   ```bash
   node optimize-images.js
   ```

## How I Deploy It

### Using Bash Script
I use the `deploy.sh` script to build and deploy the site:
```bash
./deploy.sh
```

### Using Windows Command Script
For Windows, I use the `deploy.cmd` script:
```cmd
deploy.cmd
```

Both scripts:
- Build the project.
- Copy the `CNAME` file to the `dist` folder.
- Push the contents of the `dist` folder to the `deployment` branch on GitHub.

## File Structure

```
/src
  ├── assets/          # Images, fonts, and other static assets
  ├── js/              # JavaScript files
  ├── scss/            # SCSS stylesheets
  ├── partials/        # Handlebars partials
  ├── index.html       # Main HTML file
  ├── portfolio.html   # Portfolio page
  └── sadgrl.online.html # Sadgrl-themed page

/optimized-assets       # Optimized images
/dist                   # Build output (generated)
```

## My TODO List

- Add screenshots to the projects section.
- Implement a music player with curated tracks.
- Add a portfolio section for drawings and designs.
- Explore navigation improvements and easter eggs.

## License

This project is licensed under the [ISC License](LICENSE).

## Contact Me

Feel free to reach out at [contact@lucasflowers.net](mailto:contact@lucasflowers.net).
