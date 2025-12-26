
import React from 'react';
import { Instagram, Twitter, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-12 px-4 relative z-10 border-t-4 border-white w-full">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
              <div>
                  <h3 className="text-3xl font-black uppercase pixel-font mb-4 text-nounYellow">BeeNouns</h3>
                  <p className="text-sm font-medium text-gray-400">Un experimento de gobernanza descentralizada para empoderar a la apicultura latinoamericana.</p>
                  <p className="mt-4 text-xs font-mono text-gray-600">CC0 {new Date().getFullYear()} BeeNouns.</p>
              </div>
              <div className="flex flex-col items-center md:items-start">
                  <h4 className="text-xl font-bold uppercase mb-4 text-white">SÍGUENOS</h4>
                  <div className="flex gap-4">
                      <a href="https://instagram.com/beenouns" target="_blank" className="bg-white text-black p-2 shadow-hard-sm"><Instagram size={24} /></a>
                      <a href="https://x.com/beenouns" target="_blank" className="bg-white text-black p-2 shadow-hard-sm"><Twitter size={24} /></a>
                  </div>
              </div>
              <div className="flex flex-col items-center md:items-start">
                  <h4 className="text-xl font-bold uppercase mb-4 text-white">COMUNIDAD</h4>
                  <div className="flex flex-col gap-2 font-bold text-gray-300">
                      <a href="https://www.nounsamigos.com/" target="_blank" className="flex items-center gap-2"><ExternalLink size={16} /> Nouns Amigos</a>
                      <a href="https://nouns.wtf" target="_blank" className="flex items-center gap-2"><div className="w-4 h-4 bg-nounRed rounded-sm"></div> Nouns.wtf</a>
                  </div>
              </div>
          </div>
      </footer>
  );
};
