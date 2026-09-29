(() => {
  const pool = document.querySelector('.pool');
  if (!pool) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'wave';
  const ctx = canvas.getContext('2d');
  pool.appendChild(canvas);

  const blobDefs = [
    { x: 50, y: 90, rx: 40, ry: 30, rot: -0.35, phase: 0 },
    // { x: 120, y: 120, rx: 56, ry: 42, rot: 0.25, phase: 0.25 },
    // { x: 205, y: 88, rx: 52, ry: 40, rot: -0.45, phase: 0.5 },
    // { x: 300, y: 118, rx: 58, ry: 44, rot: 0.35, phase: 0.75 },
    // { x: 395, y: 96, rx: 54, ry: 41, rot: -0.2, phase: 1 },
    // { x: 500, y: 122, rx: 62, ry: 46, rot: 0.3, phase: 1.25 },
    // { x: 595, y: 92, rx: 58, ry: 43, rot: -0.28, phase: 1.5 },
    // { x: 675, y: 110, rx: 50, ry: 38, rot: 0.2, phase: 1.75 },
    // { x: 70, y: 220, rx: 58, ry: 42, rot: 0.15, phase: 2 },
    // { x: 180, y: 260, rx: 68, ry: 48, rot: -0.25, phase: 2.25 },
    // { x: 285, y: 235, rx: 60, ry: 44, rot: 0.4, phase: 2.5 },
    // { x: 390, y: 270, rx: 70, ry: 50, rot: -0.18, phase: 2.75 },
    // { x: 495, y: 236, rx: 64, ry: 46, rot: 0.3, phase: 3 },
    // { x: 605, y: 258, rx: 66, ry: 47, rot: -0.35, phase: 3.25 },
    // { x: 520, y: 180, rx: 52, ry: 38, rot: 0.2, phase: 3.5 },
    // { x: 250, y: 310, rx: 62, ry: 44, rot: -0.15, phase: 3.75 }
  ];

  function resizeCanvas() {
    const rect = pool.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawBlobs(time) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#419BC7';

    const waveSpeed = 0.007;

    blobDefs.forEach((blob) => {
      const phase = time * waveSpeed + blob.phase;
      // const horizontalWave = Math.sin(phase) * 12;
      // const verticalWave = Math.cos(phase * 1.35) * 10;
      const x = blob.x;
      const y = blob.y + Math.sin(phase) * 2;

      // const rx = blob.rx + Math.sin(phase + 1.2) * 10;
      // const ry = blob.ry + Math.cos(phase * 1.8) * 7;
      const rx = blob.rx;
      const ry = blob.ry;

      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      // ctx.bezierCurveTo(x, y, rx, ry, x, y)

      // const steps = 0;
      // for (let i = 0; i <= steps; i += 1) {
      //   const t = i / steps;
      //   // const x = blob.x - blob.rx + t * (blob.rx * 2);
      //   const horizontalScalingFactor = 1;
      //   const x = blob.x + t * (blob.rx * horizontalScalingFactor);
      //   const wave = Math.sin(t * Math.PI * 2 + phase) * blob.ry * 0.5;
      //   const y = blob.y + wave;

      //   if (i === 0) {
      //     // ctx.moveTo(x, y);
      //     ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);

      // // ctx.arc(x, y, 50, wave, wave + Math.PI * 2);
      //     // ctx.bezierCurveTo(x, y, rx, ry, x, y)
      //   } else {
      //     // ctx.lineTo(x, y);
      //     ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      // // ctx.arc(x, y, 50, wave, wave + Math.PI * 2);
      //     // ctx.bezierCurveTo(x, y, rx, ry, x, y)
      //   }
      // }
      ctx.fill();
    });


    ctx.strokeStyle = 'rgba(120, 120, 120, 0.9)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);
  }

  function animate(time) {
    resizeCanvas();
    drawBlobs(time);
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  requestAnimationFrame(animate);
  window.addEventListener('resize', resizeCanvas);
})();
