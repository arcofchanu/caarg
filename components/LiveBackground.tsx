import React, { useRef, useEffect } from 'https://esm.sh/react@^19.1.1';

const LiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const interactionRadius = 120;

    const mouse = {
      x: -1000,
      y: -1000,
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      velocityY: number;
      baseAlpha: number;
      targetAlpha: number;
      currentAlpha: number;
      color: string;
      canvasWidth: number;
      canvasHeight: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 1.5 + 0.5; // Raindrop size
        this.velocityY = Math.random() * 2.5 + 1; // Downward speed
        this.baseAlpha = Math.random() * 0.3 + 0.1;
        this.targetAlpha = this.baseAlpha;
        this.currentAlpha = this.baseAlpha;
        this.color = `rgba(200, 200, 200, ${this.currentAlpha})`;
      }
      
      reset() {
        this.y = -10; // Start just above the screen
        this.x = Math.random() * this.canvasWidth;
        this.size = Math.random() * 1.5 + 0.5;
        this.velocityY = Math.random() * 2.5 + 1;
        this.baseAlpha = Math.random() * 0.3 + 0.1;
      }

      update() {
        // Move particle downwards
        this.y += this.velocityY;

        // Reset particle if it goes off the bottom of the screen
        if (this.y > this.canvasHeight) {
          this.reset();
        }

        // Mouse interaction effect
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        this.targetAlpha = this.baseAlpha;
        if (distance < interactionRadius) {
          const proximity = 1 - (distance / interactionRadius);
          this.targetAlpha = this.baseAlpha + proximity * 0.7;
        }
        
        if (this.targetAlpha > 1) this.targetAlpha = 1;

        // Ease alpha to target for smooth transitions
        this.currentAlpha += (this.targetAlpha - this.currentAlpha) * 0.1;
        this.color = `rgba(200, 200, 200, ${this.currentAlpha})`;
      }

      draw() {
        if (!ctx) return;
        // Draw a short line to simulate a rain streak
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.size * 3); // The length of the streak
        ctx.stroke();
      }
    }

    const init = () => {
      particles = [];
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Adjust particle count based on screen size
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 12000);
      
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      if (!ctx) return;
      // Use a semi-transparent fill to create a motion blur/trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

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

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 bg-black" />;
};

export default LiveBackground;
