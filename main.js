// Clicking a floatie reveals its matching section while closing any other open sections.
document.querySelectorAll('.floatie-link').forEach(link => {
  link.addEventListener('click', event => {
    // desktop only
    if (!window.matchMedia('(min-width: 768px)').matches) return;

    event.preventDefault();

    const targetId = link.getAttribute('href')?.replace('#', '');
    if (!targetId) return;

    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    document.querySelectorAll('.info.revealed').forEach(section => {
      if (section !== targetSection) {
        section.classList.remove('revealed');
        section.classList.remove('delay-2');
      }
    });

    targetSection.classList.add('revealed');
    targetSection.classList.add('delay-2');
  });
});