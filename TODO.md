# TODO

## Minify JS during build

Currently `assets/js/` is copied to `_site` as-is via `addPassthroughCopy`. The JS should be minified at build time, the same way CSS is minified via the `cssmin` filter + `css-bundle.njk`.

**Recommended tool: terser**
- Industry standard for JS minification, supports ES6+
- Successor to uglify-js (which is ES5-only and outdated — avoid it)
- Referenced in Eleventy's own docs and community examples

**Implementation sketch:**
1. `npm install terser --save`
2. Add a `jsmin` async filter in `eleventy.config.js` using `addNunjucksAsyncFilter` (terser's API is promise-based, not sync like CleanCSS)
3. Create `js-bundle.njk` with `permalink: assets/js/lightbox.js`, include the source file, pipe through `jsmin`
4. Remove `addPassthroughCopy("assets/js/")` so the raw file isn't copied as-is
