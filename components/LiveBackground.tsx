import React, { useRef, useEffect } from 'https://esm.sh/react@^19.1.1';

const FireBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120 // Radius of mouse influence
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      hue: number;
      canvasHeight: number;
      canvasWidth: number;
      opacity: number;
      life: number;
      maxLife: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset();
        // Start particles at random points in their lifecycle and position
        this.y = Math.random() * this.canvasHeight;
        this.x = Math.random() * this.canvasWidth;
        this.life = Math.random() * this.maxLife;
      }
      
      reset() {
        this.x = Math.random() * this.canvasWidth;
        this.y = this.canvasHeight + Math.random() * 50; // Start below the screen
        this.size = Math.random() * 2.5 + 1; // Small embers
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.maxLife = Math.random() * 200 + 300;
        this.life = this.maxLife;
        this.opacity = 0;
        // Forge colors: yellow, orange, red
        this.hue = Math.random() * 30 + 20; // HSL Hue: 20 (orange-yellow) to 50 (orange-red)
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        
        // Mouse interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            // Gently push particles away from the cursor
            this.x -= dx * force * 0.1;
            this.y -= dy * force * 0.1;
        }

        // Fade in and out using a sine wave based on life for a gentle pulse
        this.opacity = Math.sin((1 - this.life / this.maxLife) * Math.PI) * 0.9;
        
        this.life--;
        
        // Reset particle if it's off-screen or its life ends
        if (this.y < -this.size || this.life <= 0) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        // Use HSLA for easy color and opacity manipulation
        ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
        // Add a glow effect for aesthetics
        ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Responsive particle count for an ambient, non-crowded feel
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 10000); 
      
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      if (!ctx) return;
      // Clearing the canvas each frame prevents trails, making it look lighter
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 'lighter' composite operation makes overlapping particles glow brightly
      ctx.globalCompositeOperation = 'lighter'; 

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Reset shadowBlur for the next frame's clear operation
      ctx.shadowBlur = 0; 

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 bg-black" />;
};

export default FireBackground;
