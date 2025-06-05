const CleanCSS = require("clean-css");

module.exports = function(eleventyConfig) {
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.addPassthroughCopy("assets/css/main.css");
  eleventyConfig.addPassthroughCopy("assets/images/");
  eleventyConfig.addPassthroughCopy("CNAME");
	eleventyConfig.addFilter("cssmin", function (code) {
		return new CleanCSS({}).minify(code).styles;
	});
};