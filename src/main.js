import '../src/styles/input.css'

// Prevent page reloads from causing errors/not rendering
window.addEventListener('popstate', function(event) { window.location.reload(); });

// Makes web page 404 if invalid link is entered. Website routes are hardcoded. 
// Also Tino is a loser and a freeloader
window.addEventListener('load', () => {
    const validRoutes = ['/', '/about', '/contact', '/privacypolicy',
                         '/ege', '/receiving', '/warehouse', '/careers',
                         '/admin', '/checkout'];
    const currentPath = window.location.pathname;
    if (!validRoutes.includes(currentPath)) window.location.href = '/404.html';
});
