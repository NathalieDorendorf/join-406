document.addEventListener("DOMContentLoaded", () => setTimeout(paintActiveLink, 0));

function paintActiveLink() {
  // Aktuelle URL abrufen
  const currentUrl = window.location.pathname;
  console.log('Aktuelle URL:', currentUrl);

  // Alle Links in der Sidebar abrufen
  const links = document.querySelectorAll('.links-container a');

  // Durch die Links iterieren
  links.forEach(link => {
    console.log('Vergleich mit:', link.getAttribute('href'));

    if (link.getAttribute('href') === currentUrl) {
      console.log('Aktueller Link gefunden, füge Klasse hinzu');

      link.classList.add('current'); // `current`-Klasse hinzufügen
    }
  });
  console.log('templates.js ausgeführt');
}