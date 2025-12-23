# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deploy to GitHub Pages

This repo is configured to deploy `dist/` to GitHub Pages via GitHub Actions.

- Push to `main` → Actions will run `npm ci` + `npm run build` and deploy automatically.
- In GitHub repo settings: `Settings -> Pages -> Build and deployment` choose **GitHub Actions**.

If you are using a **project pages** repo (URL like `https://<user>.github.io/<repo>/`), you must set Vite `base` to `"/<repo>/"`.

## Beijing card background image

To customize the Beijing location card background, add your preferred image to:

- `public/images/beijing.jpg`

Recommended: Temple of Heaven / Forbidden City / Beijing CBD skyline.
