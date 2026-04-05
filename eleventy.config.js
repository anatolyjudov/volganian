const CleanCSS = require("clean-css");

module.exports = function(eleventyConfig) {
  // Don't process or copy README.md into the output.
  eleventyConfig.ignores.add("README.md");

  // In serve mode, passthrough files are served directly from source rather than
  // being copied to _site — faster rebuilds when static assets change.
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  // Copy static assets to _site as-is (no processing).
  // CSS is copied here but also goes through the cssmin filter via css-bundle.njk.
  eleventyConfig.addPassthroughCopy("assets/css/");
  eleventyConfig.addPassthroughCopy("assets/images/");
  eleventyConfig.addPassthroughCopy("assets/js/");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");

  // CNAME tells GitHub Pages which custom domain to serve the site from.
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");

  // Copy source JPGs to _site so they're available as originals if needed.
  // Note: processed/resized images are written directly to _site/img/ by eleventy-img
  // at build time and are not covered by this rule.
  eleventyConfig.addPassthroughCopy("**/*.jpg");

  // Async shortcode for photo galleries: {% photo "filename.jpg" %}
  // Generates thumbnail + full-size variants via eleventy-img and outputs lightbox HTML.
  eleventyConfig.addNunjucksAsyncShortcode("photo", require("./_shortcodes/photo.js"));

  // Nunjucks filter used in css-bundle.njk to minify CSS at build time.
  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });
};
