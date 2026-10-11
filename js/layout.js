/*
  The top bar and the footer are written ONCE, here, and shared by every page.
  To add a page or change a link, edit the lists below. You don't need to touch the HTML files.
*/
(function () {
  var GITHUB = 'https://github.com/piitex/RenGL';

  // [label, file]. The page you are on is highlighted automatically.
  var PAGES = [
    ['Features', 'features.html'],
    ['Code', 'code.html'],
    ['Products', 'products.html'],
    ['Get started', 'index.html#start']
  ];

  var FOOTER_LINKS = [
    ['GitHub', GITHUB],
    ['Documentation', GITHUB + '/tree/main/docs'],
    ['Report an issue', GITHUB + '/issues']
  ];

  var here = location.pathname.split('/').pop() || 'index.html';

  var links = PAGES.map(function (p) {
    var current = p[1] === here ? ' aria-current="page"' : '';
    return '<a href="' + p[1] + '"' + current + '>' + p[0] + '</a>';
  }).join('');

  var header =
    '<header class="nav" id="top">' +
      '<div class="wrap nav-inner">' +
        '<a href="index.html" class="brand" aria-label="RenGL home">' +
          '<img src="assets/favicon.svg" alt="" width="28" height="28"><span>RenGL</span>' +
        '</a>' +
        '<button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav-links"><span></span><span></span></button>' +
        '<nav id="nav-links" class="nav-links">' + links +
          '<a class="btn btn-small btn-ghost" href="' + GITHUB + '" target="_blank" rel="noopener">GitHub ↗</a>' +
        '</nav>' +
      '</div>' +
    '</header>';

  var footerLinks = FOOTER_LINKS.map(function (l) {
    return '<a href="' + l[1] + '" target="_blank" rel="noopener">' + l[0] + '</a>';
  }).join('');

  var footer =
    '<div class="wrap footer-inner">' +
      '<div>' +
        '<a href="index.html" class="brand"><img src="assets/favicon.svg" alt="" width="24" height="24"><span>RenGL</span></a>' +
        '<p class="small">Built on Java.</p>' +
      '</div>' +
      '<nav class="footer-links" aria-label="Footer">' +
        '<a href="features.html">Features</a><a href="code.html">Code</a><a href="products.html">Products</a>' + footerLinks +
      '</nav>' +
    '</div>';

  // This script sits at the top of <body>, so the bar appears with the first paint.
  document.body.insertAdjacentHTML('afterbegin', header);
  document.addEventListener('DOMContentLoaded', function () {
    var f = document.getElementById('site-footer');
    if (f) f.innerHTML = footer;
  });
})();
