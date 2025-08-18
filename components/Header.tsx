import React from 'https://esm.sh/react@^19.1.1';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold text-gray-200 tracking-wider">
          CAARG <span className="font-light text-gray-400">AI</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
