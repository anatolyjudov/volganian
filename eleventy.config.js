const CleanCSS = require("clean-css");

module.exports = function(eleventyConfig) {
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("GEMINI.md");
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.addPassthroughCopy("assets/css/");
  eleventyConfig.addPassthroughCopy("assets/images/");
  eleventyConfig.addPassthroughCopy("CNAME");
	eleventyConfig.addFilter("cssmin", function (code) {
		return new CleanCSS({}).minify(code).styles;
	});
};