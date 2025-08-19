import React from 'https://esm.sh/react@^19.1.1';
import FireBackground from './FireBackground';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="relative h-screen w-screen bg-black text-white antialiased overflow-hidden">
      <FireBackground />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4 animate-fade-in-slow">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-200 tracking-wider mb-4 animate-pulse">
          CAARG
        </h1>
        <p className="text-gray-400 mb-8 text-lg md:text-xl">Ignite the Conversation</p>
        <button
          onClick={onEnter}
          className="px-8 py-3 bg-transparent border-2 border-gray-600 rounded-lg text-gray-300 font-bold text-xl tracking-widest uppercase transition-all duration-300 hover:border-red-500 hover:text-white hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 glowing-red-border"
        >
          Serve
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
