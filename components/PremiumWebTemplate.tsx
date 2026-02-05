
import React from 'react';
import { GeneratedWebProfile, BeekeeperInput } from '../types';
import { Sparkles, Image as ImageIcon, X } from 'lucide-react';

interface Props {
  profile: GeneratedWebProfile;
  inputData: BeekeeperInput;
  isEditing: boolean;
  tempProfile: GeneratedWebProfile;
  heroInputRef: React.RefObject<HTMLInputElement>;
  galleryInputRef: React.RefObject<HTMLInputElement>;
  onHeroUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFieldChange: (field: keyof GeneratedWebProfile, value: any) => void;
  onRemoveGalleryImage: (index: number) => void;
  isMobileView?: boolean;
}

export const PremiumWebTemplate: React.FC<Props> = ({
  profile,
  inputData,
  isEditing,
  tempProfile,
  heroInputRef,
  galleryInputRef,
  onHeroUpload,
  onGalleryUpload,
  onFieldChange,
  onRemoveGalleryImage,
  isMobileView = false
}) => {
  // Colores dinámicos extraídos de la IA (o fallback)
  const primary = tempProfile.primaryColor || '#D97706'; // amber-600
  const secondary = tempProfile.secondaryColor || '#1C1917'; // stone-900

  // Estilo basado en el "Vibe"
  const isMinimalist = tempProfile.styleVibe === 'minimalist';
  const isLuxury = tempProfile.styleVibe === 'luxury';
  const isRustic = tempProfile.styleVibe === 'rustic';

  const styleStyles = {
    '--brand-primary': primary,
    '--brand-secondary': secondary,
  } as React.CSSProperties;

  const fontHeader = isLuxury ? 'font-brand-luxury' : (isRustic ? 'font-brand-rustic' : 'font-brand-modern');
  const fontBody = (isLuxury || isRustic) ? 'font-brand-rustic' : 'font-brand-modern';

  return (
    <div
      style={styleStyles}
      className={`flex-grow flex flex-col ${fontBody} text-stone-800 bg-[#fdfcf8] overflow-y-auto ${isMobileView ? 'max-w-[375px] mx-auto border-x-4 border-black' : ''}`}
    >
      {/* Contenido de la Web Generada: Estética Premium */}
      <nav className={`bg-white/80 backdrop-blur-md px-6 md:px-12 py-6 flex justify-between items-center sticky top-0 z-50 border-b border-stone-100 ${isMinimalist ? 'py-4' : ''}`}>
        <div className={`flex items-center gap-4 text-xl md:text-2xl tracking-tight text-stone-900 ${fontHeader}`}>
          {inputData.logo && <img src={inputData.logo} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />}
          <span className="font-semibold" style={{ color: 'var(--brand-secondary)' }}>{inputData.farmName}</span>
        </div>
        {!isMobileView && (
          <div className="hidden sm:flex gap-10 text-[11px] font-semibold text-stone-500 uppercase tracking-[0.2em]">
            <span className="text-stone-900 cursor-pointer border-b border-stone-900">Inicio</span>
            {!isMinimalist && (
              <>
                <span className="cursor-pointer hover:text-stone-900 transition-colors">Cosecha</span>
                <span className="cursor-pointer hover:text-stone-900 transition-colors">Legado</span>
              </>
            )}
            {inputData.wantsToSellOnline && (
              <span className="cursor-pointer hover:opacity-80 transition-colors font-bold" style={{ color: 'var(--brand-primary)' }}>Tienda</span>
            )}
          </div>
        )}
      </nav>

      <header className={`${isMobileView ? 'min-h-[500px]' : 'min-h-[750px]'} flex items-center justify-center py-20 md:py-32 px-6 relative overflow-hidden bg-stone-900 dark`}>
        {/* Fondo Premium con profundidad */}
        <div className="absolute inset-0 z-0 bg-stone-900">
          {tempProfile.heroImage ? (
            <img src={tempProfile.heroImage} className="w-full h-full object-cover scale-105" alt="Hero" />
          ) : (
            <img src="https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=2000" className="w-full h-full object-cover opacity-50 grayscale-[0.5]" alt="Honey Background" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/20 to-stone-900/90"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 mb-6 md:mb-10 px-4 md:px-6 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--brand-primary)' }}></div>
            <span className="text-white font-medium tracking-[0.3em] text-[8px] md:text-[10px] uppercase">{inputData.location}</span>
          </div>

          {isEditing ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              <button
                onClick={() => heroInputRef.current?.click()}
                className="bg-white/90 text-stone-900 px-6 py-3 rounded-md font-bold text-xs uppercase hover:bg-white transition-all mx-auto block"
              >
                <ImageIcon size={16} className="inline mr-2" /> Cambiar Imagen Hero
              </button>
              <input type="file" ref={heroInputRef} onChange={onHeroUpload} accept="image/*" className="hidden" />
              <textarea
                value={tempProfile.heroTitle}
                onChange={(e) => onFieldChange('heroTitle', e.target.value)}
                className={`w-full text-3xl md:text-5xl font-bold bg-white text-stone-900 p-6 md:p-8 rounded-xl shadow-2xl ${fontHeader}`}
                rows={2}
              />
              <input
                value={tempProfile.tagline}
                onChange={(e) => onFieldChange('tagline', e.target.value)}
                className="w-full text-lg md:text-xl text-stone-200 bg-white/10 border border-white/20 p-4 rounded-lg text-center backdrop-blur-md"
              />
            </div>
          ) : (
            <>
              <h1 className={`${isMobileView ? 'text-4xl' : 'text-6xl md:text-9xl'} font-bold text-white mb-6 md:mb-10 leading-tight tracking-tight drop-shadow-lg break-words ${fontHeader}`}>
                {tempProfile.heroTitle}
              </h1>
              <p className={`${isMobileView ? 'text-lg' : 'text-xl md:text-3xl'} text-stone-200/90 font-light italic max-w-3xl mx-auto leading-relaxed border-t border-white/20 pt-6 md:pt-10`}>
                {tempProfile.tagline}
              </p>
            </>
          )}

          {!isEditing && (
            <div className="mt-12 md:mt-16 flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <button
                className="text-white px-8 md:px-12 py-4 md:py-5 rounded-sm font-semibold text-xs md:text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-black/20"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                {inputData.wantsToSellOnline ? 'Ver Catálogo' : 'Descubrir Cosecha'}
              </button>
              <button className="bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 md:px-12 py-4 md:py-5 rounded-sm font-semibold text-xs md:text-sm uppercase tracking-[0.2em] transition-all">
                Nuestra Unión
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="bg-white py-20 md:py-32 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <div className={`grid ${isMobileView ? 'grid-cols-1' : 'md:grid-cols-3'} gap-12 md:gap-20`}>
            {tempProfile.valueProposition.map((vp, idx) => (
              <div key={idx} className="group text-center">
                <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto border border-stone-100 flex items-center justify-center mb-6 md:mb-10 group-hover:bg-amber-50 group-hover:border-amber-200 transition-all duration-700 shadow-sm ${isRustic ? 'rounded-sm bg-stone-50' : 'rounded-full bg-white'}`}>
                  <div style={{ color: 'var(--brand-primary)' }} className="opacity-70 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={isMobileView ? 24 : 32} strokeWidth={1} />
                  </div>
                </div>
                <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-stone-900 mb-4">{vp}</h3>
                <div className="w-12 h-px bg-stone-200 mx-auto group-hover:w-20 transition-all duration-500" style={{ backgroundColor: 'var(--brand-primary)' }}></div>
              </div>
            ))}
          </div>

          {/* Galería Curada */}
          <div className="mt-24 md:mt-40">
            <div className="text-center mb-12 md:mb-16">
              <span className="font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block" style={{ color: 'var(--brand-primary)' }}>Capturando el Alma</span>
              <h2 className={`text-3xl md:text-4xl font-bold text-stone-900 ${fontHeader}`}>La Vida en el Apiario</h2>
            </div>

            <div className={`grid grid-cols-1 ${isMobileView ? '' : 'md:grid-cols-12'} gap-6 ${isMobileView ? 'h-auto' : 'h-[700px]'}`}>
              <div className={`${isMobileView ? 'h-[300px]' : 'md:col-span-8'} group relative overflow-hidden rounded-sm shadow-xl`}>
                {tempProfile.galleryImages?.[0] ? (
                  <img src={tempProfile.galleryImages[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Apiario" />
                ) : (
                  <div className={`w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 italic ${fontHeader}`}>Pureza Capturada</div>
                )}
                {isEditing && tempProfile.galleryImages?.[0] && (
                  <button onClick={() => onRemoveGalleryImage(0)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-xl"><X size={16} /></button>
                )}
              </div>
              <div className={`${isMobileView ? 'grid-cols-2 mt-6' : 'md:col-span-4 grid-rows-2'} grid gap-6 h-full`}>
                {[1, 2].map(i => (
                  <div key={i} className={`group relative overflow-hidden rounded-sm shadow-lg ${isMobileView ? 'h-[200px]' : 'h-full'}`}>
                    {tempProfile.galleryImages?.[i] ? (
                      <img src={tempProfile.galleryImages[i]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Detalle" />
                    ) : (
                      <div className="w-full h-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-300">Detalle {i}</div>
                    )}
                    {isEditing && tempProfile.galleryImages?.[i] && (
                      <button onClick={() => onRemoveGalleryImage(i)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-xl"><X size={16} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isEditing && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-sm font-bold text-xs uppercase hover:bg-black transition-all"
                >
                  <ImageIcon size={16} /> Gestionar Galería
                </button>
                <input type="file" ref={galleryInputRef} onChange={onGalleryUpload} accept="image/*" multiple className="hidden" />
              </div>
            )}
          </div>

          {/* Sección de Tienda */}
          {inputData.wantsToSellOnline && (
            <div className="mt-24 md:mt-40 border-t border-stone-100 pt-20 md:pt-32">
              <div className="text-center mb-12 md:mb-20">
                <span className="text-amber-700 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">Venta Directa del Apiario</span>
                <h2 className={`text-3xl md:text-4xl font-bold text-stone-900 ${fontHeader}`}>Selección de la Estación</h2>
              </div>

              <div className={`grid ${isMobileView ? 'grid-cols-1' : 'md:grid-cols-2'} gap-8 md:gap-12 max-w-5xl mx-auto`}>
                <div className="bg-[#fdfcf8] p-6 md:p-10 border border-stone-100 flex flex-col items-center">
                  <div className="w-full aspect-[4/5] bg-stone-200 mb-6 md:mb-8 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors"></div>
                    <img src="https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=800" className="w-full h-full object-cover" alt="Miel Pura" />
                  </div>
                  <h3 className={`text-lg md:text-xl font-bold mb-2 ${fontHeader}`}>Miel de Pradera Real</h3>
                  <p className="text-stone-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 md:mb-6">Cosecha Limitada — 500g</p>
                  <div className={`text-xl md:text-2xl text-stone-900 mb-6 md:mb-8 ${fontHeader}`}>$18.50</div>
                  <button className="w-full py-4 bg-stone-900 text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-colors flex items-center justify-center gap-3">
                    <Sparkles size={14} style={{ color: 'var(--brand-primary)' }} /> Añadir al Carrito
                  </button>
                </div>

                <div className="bg-stone-900 p-8 md:p-12 text-white flex flex-col justify-center border-l-4" style={{ borderLeftColor: 'var(--brand-primary)' }}>
                  <h3 className={`text-2xl md:text-3xl font-bold mb-6 italic leading-tight ${fontHeader}`}>"Calidad garantizada desde el panal hasta tu mesa."</h3>
                  <p className="text-stone-400 text-xs md:text-sm leading-relaxed mb-8 md:mb-10">
                    Activa tu cuenta para configurar tu billetera y empezar a recibir pagos sin intermediarios.
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest border-b border-white/10 pb-4">
                      <span>Subtotal</span>
                      <span>$18.50</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest pt-2">
                      <span>Total</span>
                      <span style={{ color: 'var(--brand-primary)' }}>$18.50</span>
                    </div>
                  </div>
                  <button
                    className="mt-8 md:mt-12 w-full py-5 text-stone-900 font-black text-xs uppercase tracking-[0.3em] hover:opacity-90 transition-all shadow-xl shadow-black/40"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                  >
                    Pagar con Kit de Pago
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-24 md:mt-40 bg-stone-50 p-10 md:p-20 rounded-sm border border-stone-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <div className={`text-stone-900 scale-[4] rotate-12 font-black ${fontHeader}`}>"{inputData.farmName.charAt(0)}"</div>
            </div>
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] mb-6 md:mb-10 block" style={{ color: 'var(--brand-primary)' }}>Nuestra Esencia</span>
              {isEditing ? (
                <textarea
                  value={tempProfile.aboutUsText}
                  onChange={(e) => onFieldChange('aboutUsText', e.target.value)}
                  className={`w-full text-xl md:text-2xl text-stone-700 leading-[1.8] text-center bg-white border border-stone-200 p-6 md:p-8 rounded-xl ${fontBody}`}
                  rows={4}
                />
              ) : (
                <p className={`text-2xl md:text-4xl text-stone-800 leading-[1.6] italic ${fontBody}`}>"{tempProfile.aboutUsText}"</p>
              )}
              <div className="mt-8 md:mt-12 flex flex-col items-center">
                <div className="w-16 h-px mb-6" style={{ backgroundColor: 'var(--brand-primary)' }}></div>
                <p className="font-bold uppercase text-[10px] md:text-[11px] tracking-[0.3em] text-stone-400">{inputData.name}</p>
                <p className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-stone-300 mt-2">Fundador de {inputData.farmName}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-stone-100 py-16 md:py-24 px-6 md:px-12 text-center">
        <div className="max-w-xs mx-auto mb-10 md:mb-12">
          <div className={`text-xl md:text-2xl font-bold mb-4 ${fontHeader}`}>{inputData.farmName}</div>
          <div className="w-12 h-px mx-auto" style={{ backgroundColor: 'var(--brand-primary)' }}></div>
        </div>
        <div className="flex justify-center gap-6 md:gap-12 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 border-b border-stone-50 pb-10 md:pb-12 mb-10 md:mb-12">
          <span className="cursor-pointer hover:text-stone-900 transition-colors">Instagram</span>
          {!isMobileView && (
            <>
              <span className="cursor-pointer hover:text-stone-900 transition-colors">Privacidad</span>
              <span className="cursor-pointer hover:text-stone-900 transition-colors">Términos</span>
            </>
          )}
        </div>
        <p className="text-[8px] md:text-[9px] font-medium text-stone-300 uppercase tracking-widest italic mb-8">
          © {new Date().getFullYear()} {inputData.farmName} — Colección Privada
        </p>

        {/* SELLO DE AUTENTICIDAD BEENOUNS (SOLUCIÓN PUNTO 5) */}
        <div className="flex justify-center mt-12 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 border-2 border-black px-3 py-1 rotate-1 shadow-hard-sm cursor-help" style={{ backgroundColor: 'var(--brand-primary)' }}>
            <span className="text-xs">🐝</span>
            <span className="text-[8px] font-black uppercase tracking-tighter text-black">Authentic Colmena Digital — BeeNouns CC</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
