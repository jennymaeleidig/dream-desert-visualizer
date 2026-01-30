Dream Desert Visualizer - p5.js Port

Scaffolded with Vite + p5.js. Important notes:

- Run `npm install` then `npm run dev` to work locally.
- Audio lazy-loads on first Play; audio URLs are cloudinary links provided by the user.
- Shaders live in `public/assets/shaders/` and will be adapted as needed.

Responsive Canvas:

- The canvas is now centered and mobile responsive using CSS only. It keeps its original p5.js size and aspect ratio, but scales down to fit smaller screens. See [index.html](index.html:1) for CSS details.

Next steps:

- Port visuals and interaction code from Processing PDEs
- Hook up shader uniforms per-frame
- Implement pyramid texture generation
- Add Vercel deployment configuration and CI
