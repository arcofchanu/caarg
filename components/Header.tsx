import React from 'https://esm.sh/react@^19.1.1';

const Header: React.FC = () => {
  return (
    // Container to center the plaque and keep it sticky
    <header className="w-full p-4 text-center sticky top-0 z-20">
      {/* The plaque itself with animations */}
      <div className="inline-block px-8 py-2 bg-black/70 backdrop-blur-sm rounded-lg animate-pop-in">
        <h1 className="text-3xl md:text-4xl font-bold text-red-100 tracking-widest">
          CAARG <span className="font-light text-gray-400">AI</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
