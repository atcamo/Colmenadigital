
import React, { useState, useEffect } from 'react';
import { GeneratedWebProfile, BeekeeperInput } from '../types';
import { BlockCard } from './BlockCard';
import { Button } from './Button';
import { Edit2, Save, RotateCcw, MapPin, Share2, Hexagon, Globe, Sparkles } from 'lucide-react';

interface Props {
  profile: GeneratedWebProfile;
  inputData: BeekeeperInput;
  onEditInputs: () => void;
  onUpdateProfile: (p: GeneratedWebProfile) => void;
  onResetProfile: () => void;
  isModified: boolean;
}

export const WebPreview: React.FC<Props> = ({ 
    profile, inputData, onUpdateProfile, onResetProfile, isModified 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<GeneratedWebProfile>(profile);

  useEffect(() => { setTempProfile(profile); }, [profile]);

  const handleSave = () => { onUpdateProfile(tempProfile); setIsEditing(false); };

  const handleChange = (field: keyof GeneratedWebProfile, value: string | string[]) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  // Limpiar el handle para asegurar que no tenga doble @ si la IA lo incluyó
  const cleanHandle = profile.farcasterHandle.startsWith('@') 
    ? profile.farcasterHandle.substring(1) 
    : profile.farcasterHandle;

  return (
    <div className="min-h-screen bg-nounOffWhite py-8 px-4 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: VISTA PREVIA WEB */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white border-4 border-black p-4 shadow-hard-sm gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-black text-white px-3 py-1 font-bold text-xs uppercase pixel-font">
                    {isEditing ? "Modo Editor" : "Vista Previa"}
                </div>
                {!isEditing && (
                    <div className="flex items-center gap-1 text-[10px] font-black text-nounBlue uppercase">
                        <Globe size={12} /> Web3 Compatible
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2">
                {isEditing ? (
                    <button onClick={handleSave} className="flex items-center gap-2 bg-nounRed text-white px-4 py-2 font-bold border-2 border-black shadow-sm hover:bg-red-600 transition-colors"><Save size={18} /> Guardar</button>
                ) : (
                    <>
                        {isModified && <button onClick={onResetProfile} className="flex items-center gap-2 px-3 py-2 font-bold text-xs uppercase text-gray-400 hover:text-black transition-colors"><RotateCcw size={16} /> Original</button>}
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-nounYellow px-4 py-2 font-bold border-2 border-black shadow-sm hover:translate-y-[-2px] transition-all"><Edit2 size={18} /> Editar Textos</button>
                    </>
                )}
            </div>
          </div>

          <div className="border-4 border-black bg-white shadow-hard relative flex flex-col min-h-[800px] overflow-hidden">
            {/* Browser Header Mockup */}
            <div className="bg-gray-100 border-b-2 border-black p-3 flex items-center gap-2 text-xs text-gray-500">
              <div className="flex gap-1.5 ml-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 border border-black/10"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black/10"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 border border-black/10"></div>
              </div>
              <div className="ml-4 bg-white border-2 border-black px-3 py-1 flex-1 text-center font-bold text-black overflow-hidden truncate">
                {inputData.farmName.toLowerCase().replace(/\s/g, '')}.beenouns.eth
              </div>
            </div>

            <div className="flex-grow flex flex-col font-sans text-stone-800 bg-stone-50 overflow-y-auto">
              {/* Contenido de la Web Generada */}
              <nav className="bg-white px-6 py-4 flex justify-between items-center border-b border-stone-200">
                 <div className="flex items-center gap-3 font-serif font-black text-xl uppercase tracking-tighter text-stone-900">
                    {inputData.logo && <img src={inputData.logo} alt="Logo" className="w-10 h-10 object-contain border border-stone-100 p-1" />}
                    {inputData.farmName}
                 </div>
                 <div className="hidden sm:flex gap-8 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                    <span className="text-amber-800 cursor-pointer">Nuestro Origen</span>
                    <span className="cursor-pointer hover:text-stone-900 transition-colors">La Cosecha</span>
                    <span className="cursor-pointer hover:text-stone-900 transition-colors">Contacto</span>
                 </div>
              </nav>

              <header className="py-24 px-6 md:px-12 text-center md:text-left bg-gradient-to-br from-amber-50 via-white to-orange-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Hexagon size={240} className="text-amber-500 rotate-12" />
                </div>

                <div className="max-w-4xl mx-auto md:mx-0 relative z-10">
                    <div className="flex items-center gap-2 mb-6 justify-center md:justify-start">
                        <MapPin size={14} className="text-amber-700" />
                        <span className="text-amber-700 font-bold tracking-widest text-[10px] uppercase border-b border-amber-200">{inputData.location}</span>
                    </div>
                    
                    {isEditing ? (
                        <textarea 
                            value={tempProfile.heroTitle} 
                            onChange={(e) => handleChange('heroTitle', e.target.value)} 
                            className="w-full text-3xl md:text-5xl font-serif bg-white border-4 border-nounYellow p-4 mb-4 shadow-hard-sm"
                            rows={2}
                        />
                    ) : (
                        <h1 className="text-4xl md:text-7xl font-serif font-medium text-stone-900 mb-6 leading-[1.1]">{tempProfile.heroTitle}</h1>
                    )}
                    
                    {isEditing ? (
                        <input 
                            value={tempProfile.tagline} 
                            onChange={(e) => handleChange('tagline', e.target.value)} 
                            className="w-full text-lg text-stone-600 italic font-light bg-white border-2 border-stone-200 p-2"
                        />
                    ) : (
                        <p className="text-xl md:text-2xl text-stone-600 font-light italic max-w-2xl leading-relaxed">{tempProfile.tagline}</p>
                    )}

                    <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button className="bg-stone-900 text-white px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors">Explorar Cosecha</button>
                        <button className="border-2 border-stone-900 px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-stone-100 transition-colors">Nuestra Historia</button>
                    </div>
                </div>
              </header>

              <section className="bg-white py-20 px-6 md:px-12 border-t border-stone-100">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        {tempProfile.valueProposition.map((vp, idx) => (
                            <div key={idx} className="group">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6 text-amber-900 group-hover:scale-110 transition-transform">
                                    <Hexagon size={24} />
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-stone-900 mb-3">{vp}</h3>
                                <div className="w-8 h-1 bg-amber-400"></div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-24 max-w-2xl mx-auto text-center">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-amber-800 mb-6">Sobre Nosotros</h2>
                        {isEditing ? (
                             <textarea 
                                value={tempProfile.aboutUsText} 
                                onChange={(e) => handleChange('aboutUsText', e.target.value)} 
                                className="w-full text-lg md:text-xl text-stone-700 font-serif leading-relaxed text-center bg-white border-2 border-stone-200 p-4"
                                rows={3}
                            />
                        ) : (
                            <p className="text-lg md:text-2xl text-stone-700 font-serif leading-relaxed">"{tempProfile.aboutUsText}"</p>
                        )}
                        <p className="mt-8 font-black uppercase text-[10px] tracking-widest text-stone-400">— {inputData.name}, Fundador de {inputData.farmName}</p>
                    </div>
                </div>
              </section>
              
              <footer className="bg-stone-900 text-white py-12 px-6 text-center text-[10px] font-black uppercase tracking-[0.2em]">
                 <p>© {new Date().getFullYear()} {inputData.farmName} — Hecho en la Colmena Digital</p>
              </footer>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: ESTRATEGIA E IDENTIDAD */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* BLOQUE FARCASTER (MEJORADO) */}
            <BlockCard className="bg-[#855DCD] text-white border-black">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black uppercase pixel-font tracking-tighter">Tu Marca Social</h3>
                    <div className="bg-white text-[#855DCD] px-2 py-0.5 rounded text-[8px] font-black uppercase">Web3</div>
                </div>
                <p className="text-xs mb-4 font-bold opacity-90 leading-tight">
                    Esta es tu "cédula" en la nueva red social de apicultores descentralizada.
                </p>
                <div className="bg-black/20 p-4 border-2 border-white/20 rounded-lg mb-4">
                    <p className="text-[10px] font-black uppercase text-white/50 mb-1">Tu nombre de usuario</p>
                    <p className="text-xl font-black lowercase font-mono">@{cleanHandle}</p>
                </div>
                <button 
                    onClick={() => window.open('https://warpcast.com/', '_blank')}
                    className="w-full bg-white text-[#855DCD] py-3 font-black text-[10px] uppercase shadow-hard-sm active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                    <Share2 size={12} /> Reservar en Farcaster
                </button>
            </BlockCard>

            <BlockCard className="border-nounBlue">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-nounBlue flex items-center justify-center text-white border-2 border-black">
                        <Sparkles size={16} />
                    </div>
                    <h3 className="text-xl font-black uppercase text-nounBlue pixel-font tracking-tighter">Estrategia IA</h3>
                </div>
                <div className="space-y-4">
                    <div className="bg-stone-50 p-3 border-2 border-black/5">
                        <p className="font-bold text-[9px] uppercase text-gray-400 mb-1">Tu Desafío:</p>
                        <p className="text-xs italic text-stone-600">
                          {inputData.painPointTraceability.length > 3 
                            ? `"${inputData.painPointTraceability}"` 
                            : "Mejorar la confianza con el cliente final."}
                        </p>
                    </div>
                    <div>
                        <p className="font-bold text-[9px] uppercase text-nounBlue mb-2">Solución BeeNouns:</p>
                        <p className="text-xs leading-relaxed font-medium text-stone-800">{profile.strategicAnalysis}</p>
                    </div>
                </div>
            </BlockCard>

            <BlockCard className="bg-nounYellow">
                <h3 className="text-xl font-black uppercase mb-2 pixel-font tracking-tighter">¿Todo listo?</h3>
                <p className="mb-6 text-xs font-bold leading-tight">Al publicar, tu web estará disponible para todo el mundo bajo tu nombre @{cleanHandle}.</p>
                <Button fullWidth onClick={() => alert("¡Excelente! Tu web está siendo publicada en la red descentralizada...")} className="text-sm py-4">
                  PUBLICAR MI PÁGINA
                </Button>
            </BlockCard>
            
            <div className="flex justify-center gap-4 text-gray-400 font-black text-[9px] uppercase tracking-widest">
                <span className="hover:text-black cursor-pointer">Términos</span>
                <span className="hover:text-black cursor-pointer">Privacidad</span>
                <span className="hover:text-black cursor-pointer">Soporte</span>
            </div>
        </div>
      </div>
    </div>
  );
};
