// Lightbox — photo gallery overlay with keyboard and click navigation.
// Activates only when [data-lightbox] links are present on the page.
// Degrades gracefully: without JS, links navigate to the full image directly.
(function () {

  // Check if there are any gallery links on the page at all; bail if not.
  if (!document.querySelector('figure a[data-lightbox]')) return;

  // Build the overlay element dynamically — no HTML markup needed in the template.
  var overlay = document.createElement('div');
  overlay.id = 'lb';
  overlay.innerHTML = '<img class="lb-img" src="" alt="">';
  document.body.appendChild(overlay);

  // Cache reference to the image element.
  var img = overlay.querySelector('.lb-img');

  // `links` holds the gallery for the currently open figure.
  // It is set each time a new figure is opened.
  var links = [];
  var current = 0;

  // Opens the lightbox at the given index within the current `links` set.
  function open(index) {
    current = index;
    var link = links[index];
    var thumb = link.querySelector('img');

    // Show the low-res thumbnail immediately as a blurred placeholder
    // so the user sees something right away while the full image loads.
    img.src = thumb.src;
    img.classList.add('lb-loading'); // CSS applies blur to signal loading state

    // Make the overlay visible and lock page scroll so the background doesn't drift.
    overlay.classList.add('lb-active');
    document.body.style.overflow = 'hidden';

    // Start loading the full-size image in the background.
    // Using a separate Image object avoids flickering the visible <img> during load.
    var full = new Image();
    full.onload = function () {
      // Guard against a race condition: the user may have navigated to a different
      // image before this one finished loading. Only swap if we're still on this index.
      if (current === index) {
        img.src = full.src;
        img.classList.remove('lb-loading'); // remove blur once full image is ready
      }
    };
    full.src = link.href; // triggers the network request for the full-size image
  }

  // Closes the lightbox and restores normal page state.
  function close() {
    overlay.classList.remove('lb-active');
    document.body.style.overflow = ''; // restore scroll
    img.src = ''; // release the image from memory
  }

  // Apply a random rotation to each photo for a casual, scattered look.
  // Rotating the <a> element tilts the whole "photo" including the white border.
  // Range: -10deg to +10deg.
  document.querySelectorAll('figure a[data-lightbox]').forEach(function (link) {
    var deg = (Math.random() * 12 - 6).toFixed(2);
    link.style.setProperty('--rot', deg + 'deg');
  });

  // Attach click handlers to each gallery link.
  // On click, scope `links` to only the siblings within the same <figure>,
  // so navigation stays within the clicked gallery.
  document.querySelectorAll('figure a[data-lightbox]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      links = Array.from(link.closest('figure').querySelectorAll('a[data-lightbox]'));
      open(links.indexOf(link));
    });
  });

  // Click on the image navigates by half: left half = prev, right half = next.
  // At the boundaries (first/last image), either direction closes the lightbox.
  img.addEventListener('click', function (e) {
    var isLeftHalf = e.offsetX < img.offsetWidth / 2;
    if (isLeftHalf) {
      if (current > 0) open(current - 1); else close();
    } else {
      if (current < links.length - 1) open(current + 1); else close();
    }
  });

  // Click on the backdrop (the overlay itself, not the image) also closes.
  // e.target === overlay is true only when clicking the area around the image.
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  // Keyboard navigation: arrow keys to browse, Escape to close.
  // Guard at the top skips processing when the lightbox isn't open.
  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('lb-active')) return;
    if (e.key === 'ArrowLeft') { if (current > 0) open(current - 1); else close(); }
    if (e.key === 'ArrowRight') { if (current < links.length - 1) open(current + 1); else close(); }
    if (e.key === 'Escape') close();
  });

}());
