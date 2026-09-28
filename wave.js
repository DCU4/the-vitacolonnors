// Create the canvas that the waves will be drawn on and attach it to the .pool section
const canvas = document.createElement('canvas');
canvas.classList = 'wave';
const c = canvas.getContext('2d');
const pool = document.querySelector('.pool');
pool.append(canvas);

// Canvas is sized to the full viewport width so lines can travel left to right,
// and to twice the viewport height to cover the scrollable .pool area
canvas.width = 750;
canvas.height = 500;

// Available shades of blue so each line can have its own tone.
const blueShades = ['#419BC7', '#1B5E8C', '#7EC8E3', '#0A3D62', '#5DADE2', '#2E86C1'];

// Each wave stores its own base position, motion speed, color, and bobbing behavior.
const waves = Array.from({ length: 8 }, () => ({
  baseY: Math.random() * canvas.height, // Starting vertical anchor for this wave.
  length: Math.random() * 0.02 + 0.05, // How tight the wave pattern is along the x-axis.
  amplitude: Math.random() * 8 + 10, // How far the wave moves up and down.
  frequency: 0.015, // How quickly the phase of the sine wave advances.
  bobAmplitude: Math.random() * 1 + 5, // How much the whole wave drifts up and down each frame.
  color: blueShades[Math.floor(Math.random() * blueShades.length)], // Random blue shade for this line.
  shadowColor: blueShades[Math.floor(Math.random() * blueShades.length)] // Slightly tinted shadow for depth.
}));

// Set stroke thickness so the lines feel more substantial without being too heavy.
const lineWidth = 100;

// Background fill keeps the canvas visually clean before each wave is redrawn.
c.fillStyle = '#419BC7';
c.fillRect(0, 0, canvas.width, canvas.height);

// Pool floaties are drawn after the waves so they sit above the animated lines.
const floaties = [
  { id: 'welcome', baseX: 150, baseY: 150, x: 150, y: 150, radius: 80, color: '#FFFFFF' },
  { id: 'hotels', baseX: 600, baseY: 200, x: 600, y: 200, radius: 80, color: '#FFFFFF' },
  { id: 'faq', baseX: 400, baseY: 400, x: 400, y: 400, radius: 80, color: '#FFFFFF' }
];

// Cache the actual DOM links once so we do not re-query the page every animation frame.
const floatieLinks = new Map(
  Array.from(document.querySelectorAll('.floatie-link')).map(link => [
    link.getAttribute('href')?.replace('#', '') || '',
    link
  ])
);

// Tracks each wave's animation phase so the sine wave keeps moving forward over time.
const increments = waves.map(wave => wave.frequency);

function drawBackground() {
  // Clear the canvas and redraw the background each frame so the wave layer stays fresh.
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = '#419BC7';
  c.fillRect(0, 0, canvas.width, canvas.height);
}

function drawWaves() {
  // Reset the canvas style for each pass.
  c.lineWidth = lineWidth;
  c.lineJoin = 'round';
  c.lineCap = 'round';

  waves.forEach((wave, index) => {
    c.beginPath();

    const width = canvas.width;
    const { length, amplitude, color, shadowColor, bobAmplitude } = wave;
    let increment = increments[index];

    // The whole wave has a gentle bobbing offset so it moves up and down over time.
    const bobOffset = Math.sin((Date.now() * 0.001) + index * 0.9) * bobAmplitude;
    const startY = wave.baseY + bobOffset;

    // Draw the line from left to right, with the y-position calculated from a sine wave.
    for (let x = 0; x < width; x++) {
      const y = startY + Math.sin(x * length + increment) * amplitude;
      if (x === 0) {
        c.moveTo(x, y);
      } else {
        c.lineTo(x, y);
      }
    }

    // A subtle shadow behind the stroke helps each line feel slightly lifted from the canvas.
    c.save();
    c.strokeStyle = color;
    c.shadowColor = shadowColor;
    c.shadowBlur = 2;
    c.shadowOffsetY = 0.2;
    c.stroke();
    c.restore();

    // Advance the phase so the wave keeps moving forward each animation frame.
    increments[index] += wave.frequency;
  });
}

function drawFloaties() {
  // Draw the pool floaties last so they sit above the waves on the canvas.
  floaties.forEach(floaty => {
    const driftX = Math.sin(Date.now() * 0.0005 + floaty.baseX * 0.01) * 10;
    // const driftY = Math.cos(Date.now() * 0.0015 + floaty.baseY * 0.02) * 8;

    // Update the floatie's live position from a stable base so it drifts smoothly.
    floaty.x = floaty.baseX + driftX;
    // floaty.y = floaty.baseY + driftY;

    c.fillStyle = floaty.color;
    c.beginPath();
    c.arc(floaty.x, floaty.y, floaty.radius, 0, Math.PI * 2);
    c.fill();

    // Add a transparent center cutout so the floatie looks like a ring instead of a solid circle.
    c.save();
    c.globalCompositeOperation = 'destination-out';
    c.beginPath();
    c.arc(floaty.x, floaty.y, floaty.radius * 0.45, 0, Math.PI * 2);
    c.fill();
    c.restore();

    // Update the matching DOM link using a single transform property instead of re-querying the DOM.
    const floatieLink = floatieLinks.get(floaty.id);
    if (floatieLink) {
      floatieLink.style.transform = `translate(${floaty.x}px, ${floaty.y}px)`;
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  drawBackground();
  drawWaves();
  drawFloaties();
}

animate();