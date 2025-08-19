import React from 'https://esm.sh/react@^19.1.1';

const LoadingBar: React.FC = () => {
  return (
    <div className="w-full bg-red-900/20 rounded-full h-2 mt-3 overflow-hidden">
      <div className="h-full rounded-full animate-loading-bar-shimmer"></div>
    </div>
  );
};

export default LoadingBar;
