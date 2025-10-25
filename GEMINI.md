
# Project Overview

This project is a personal page. The main goal is to publish my short stories and creative photos. I want it to be aesthetically pleasing and minimalistic, both visually and technically. It uses a static web page generator because it's fast, secure, and simple.

# Tech Stack

This project uses Eleventy, a static site generator.

## Key Eleventy Concepts:

### Templates:
- Permalinks: Control the output location of files.
- Layouts: Wrap content in a parent template.
- Collections: Group content together (e.g., for a blog).
- Pagination: Generate multiple pages from a single data source.

### Data:
- Data Cascade: Eleventy merges data from various sources in a specific order of precedence.
- Data Sources:
  - Eleventy-supplied data.
  - Front matter in templates.
  - Template-specific data files.
  - Directory-specific data files.
  - Global data files (in the `_data` directory).
- JavaScript Data Files: Can be used for more complex data processing.

## Nunjucks Template Engine:
- Supports standard features like `include`, `extends`, and `import` with relative paths.
- Allows for custom filters and shortcodes, including asynchronous versions.
- Nunjucks-only named argument syntax for shortcodes provides more flexibility for optional parameters.
- Macros are not async-friendly, but Eleventy provides a `{% setAsync %}` tag to capture output from asynchronous shortcodes.
