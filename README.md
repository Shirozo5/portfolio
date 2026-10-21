# Portfolio

A static site (HTML, CSS, JavaScript). No build step, so it works on GitHub Pages as is.

## 1. Fill in your details

Open `script.js` and edit the `CONFIG` block at the top:

- `email`, `upwork`, `github`, `linkedin`: your contact links. Anything left empty stays hidden.
- `resume`: put your PDF in a `files/` folder and set this to `"files/resume.pdf"`. The resume buttons appear automatically.
- `repos`: a link for each project card. Add the GitHub or live-site URL when a project is ready.

To change text, edit `index.html`. To change colors or fonts, edit the two `:root` blocks at the top of `style.css`.

## 2. Publish on GitHub Pages

1. On GitHub, create a new public repository. Name it `portfolio`, or `your-username.github.io` if you want the shorter address `https://your-username.github.io/`.
2. Upload `index.html`, `style.css` and `script.js` (plus the `files/` folder if you added a resume) to the root of the repository.
3. Go to the repository's Settings, then Pages. Under "Build and deployment", set Source to "Deploy from a branch", choose the `main` branch and the `/ (root)` folder, and save.
4. After a minute or two the site is live at `https://your-username.github.io/portfolio/`.

Every time you commit a change, GitHub Pages republishes the site.
