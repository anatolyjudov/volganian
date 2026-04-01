// Nunjucks async shortcode: {% photo "filename.jpg" %}
// Generates a thumbnail + full-size image pair and outputs a lightbox-ready <a><img></a>.
// Used in travel journal pages (templateEngineOverride: njk,html required in frontmatter).

const Image = require("@11ty/eleventy-img");
const path = require("path");
const sharp = require("sharp");

module.exports = async function(src) {
  // Resolve the image path relative to the calling page's directory.
  // this.page.inputPath is e.g. "./travel/saigon-kiss/index.html"
  const pageDir = path.dirname(this.page.inputPath).replace(/^\.\//, "");
  const fullSrc = `${pageDir}/${src}`;

  // Read the original image dimensions to determine orientation.
  // eleventy-img only resizes by width, so for portrait images we calculate
  // the width that results in an 800px-tall thumbnail (longer side = 800px).
  const { width, height } = await sharp(fullSrc).metadata();
  const isPortrait = height > width;
  const ratio = width / height; // width-to-height ratio, < 1 for portraits

  // For landscape: thumbnail is 800px wide.
  // For portrait: thumbnail width is calculated so that height comes out to 800px.
  const thumbWidth = isPortrait ? Math.round(800 * ratio) : 800;

  // Generate two versions: the thumbnail and the original full-resolution copy.
  // `null` in widths tells eleventy-img to output the image at its original size.
  // Output goes to _site/img/<pageDir>/ and is not committed to source control.
  const metadata = await Image(fullSrc, {
    widths: [thumbWidth, null],
    formats: ["jpeg"],
    outputDir: `./_site/img/${pageDir}/`,
    urlPath: `/img/${pageDir}/`,
    filenameFormat: function(id, src, width, format) {
      // e.g. "10-800w.jpeg", "10-3200w.jpeg"
      const name = src.split("/").pop().replace(/\.[^.]+$/, "");
      return `${name}-${width}w.${format}`;
    }
  });

  const thumb = metadata.jpeg[0]; // 800px thumbnail
  const large = metadata.jpeg[1]; // original resolution

  // The thumbnail is generated at 2x display resolution (800px for a ~400px display size).
  // srcset="... 2x" hints this to the browser; width/height attributes reflect actual file
  // dimensions so the browser can reserve the right layout space before the image loads.
  // data-lightbox marks the link for the lightbox script to intercept.
  return `<a href="${large.url}" data-lightbox target="_blank"><img src="${thumb.url}" srcset="${thumb.url} 2x" width="${thumb.width}" height="${thumb.height}" loading="lazy" alt=""></a>`;
};
