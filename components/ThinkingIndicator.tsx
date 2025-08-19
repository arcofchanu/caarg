import React from 'https://esm.sh/react@^19.1.1';

const ThinkingIndicator: React.FC = () => {
  // A more visually interesting "forging ember" effect
  const sparks = [
    { tx: '25px', ty: '-25px', delay: '0s' },
    { tx: '30px', ty: '10px', delay: '0.2s' },
    { tx: '-20px', ty: '20px', delay: '0.4s' },
    { tx: '-30px', ty: '-15px', delay: '0.6s' },
  ];

  return (
    <div className="relative w-8 h-8 flex items-center justify-center py-1">
      {/* Central pulsing core */}
      <div className="w-4 h-4 bg-red-500 rounded-full animate-ember-pulse"></div>
      
      {/* Sparks flying outwards */}
      {sparks.map((spark, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-orange-300 rounded-full animate-spark"
          style={{ 
            '--tx': spark.tx, 
            '--ty': spark.ty,
            animationDelay: spark.delay,
          } as React.CSSProperties}
        ></div>
      ))}
    </div>
  );
};

export default ThinkingIndicator;
