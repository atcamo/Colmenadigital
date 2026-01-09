
import React, { useState, useEffect, useRef } from 'react';
import { GeneratedWebProfile, BeekeeperInput } from '../types';
import { BlockCard } from './BlockCard';
import { Button } from './Button';
import { Edit2, Save, RotateCcw, MapPin, Share2, Hexagon, Globe, Sparkles, Image as ImageIcon, Plus, X } from 'lucide-react';
import { SocialAuthModal } from './SocialAuthModal';
import { profileService } from '../services/profileService';

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
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const heroInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setTempProfile(profile); }, [profile]);

    const handleSave = () => { onUpdateProfile(tempProfile); setIsEditing(false); };

    const handleChange = (field: keyof GeneratedWebProfile, value: any) => {
        setTempProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => handleChange('heroImage', reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file: File) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setTempProfile(prev => ({
                        ...prev,
                        galleryImages: [...(prev.galleryImages || []), reader.result as string]
                    }));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeGalleryImage = (index: number) => {
        setTempProfile(prev => ({
            ...prev,
            galleryImages: prev.galleryImages?.filter((_, i) => i !== index)
        }));
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
                                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-nounYellow px-4 py-2 font-bold border-2 border-black shadow-sm hover:translate-y-[-2px] transition-all"><Edit2 size={18} /> Editar Web</button>
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
                                {inputData.farmName.toLowerCase().replace(/\s/g, '')}.beenouns.cc
                            </div>
                        </div>

                        <div className="flex-grow flex flex-col font-sans text-stone-800 bg-[#fdfcf8] overflow-y-auto">
                            {/* Contenido de la Web Generada: Estética Premium */}
                            <nav className="bg-white/80 backdrop-blur-md px-12 py-6 flex justify-between items-center sticky top-0 z-50 border-b border-stone-100">
                                <div className="flex items-center gap-4 font-serif text-2xl tracking-tight text-stone-900">
                                    {inputData.logo && <img src={inputData.logo} alt="Logo" className="w-12 h-12 object-contain" />}
                                    <span className="font-semibold">{inputData.farmName}</span>
                                </div>
                                <div className="hidden sm:flex gap-10 text-[11px] font-semibold text-stone-500 uppercase tracking-[0.2em]">
                                    <span className="text-stone-900 cursor-pointer border-b border-stone-900">Inicio</span>
                                    <span className="cursor-pointer hover:text-stone-900 transition-colors">Cosecha</span>
                                    <span className="cursor-pointer hover:text-stone-900 transition-colors">Legado</span>
                                    {inputData.wantsToSellOnline && (
                                        <span className="cursor-pointer text-amber-600 hover:text-amber-700 transition-colors font-bold">Tienda</span>
                                    )}
                                </div>
                            </nav>

                            <header className="min-h-[750px] flex items-center justify-center py-32 px-6 relative overflow-hidden bg-stone-900 dark">
                                {/* Fondo Premium con profundidad */}
                                <div className="absolute inset-0 z-0 bg-stone-900">
                                    {tempProfile.heroImage && (
                                        <img src={tempProfile.heroImage} className="w-full h-full object-cover scale-105" alt="Hero" />
                                    )}
                                    {/* Overlay sofisticado */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/20 to-stone-900/90"></div>
                                </div>

                                <div className="max-w-5xl mx-auto relative z-10 text-center">
                                    <div className="inline-flex items-center gap-3 mb-10 px-6 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                                        <span className="text-white font-medium tracking-[0.3em] text-[10px] uppercase">{inputData.location}</span>
                                    </div>

                                    {isEditing ? (
                                        <div className="space-y-6 max-w-3xl mx-auto">
                                            <button
                                                onClick={() => heroInputRef.current?.click()}
                                                className="bg-white/90 text-stone-900 px-6 py-3 rounded-md font-bold text-xs uppercase hover:bg-white transition-all mx-auto block"
                                            >
                                                <ImageIcon size={16} className="inline mr-2" /> Cambiar Imagen Hero
                                            </button>
                                            <input type="file" ref={heroInputRef} onChange={handleHeroUpload} accept="image/*" className="hidden" />
                                            <textarea
                                                value={tempProfile.heroTitle}
                                                onChange={(e) => handleChange('heroTitle', e.target.value)}
                                                className="w-full text-5xl font-serif font-bold bg-white text-stone-900 p-8 rounded-xl shadow-2xl"
                                                rows={2}
                                            />
                                            <input
                                                value={tempProfile.tagline}
                                                onChange={(e) => handleChange('tagline', e.target.value)}
                                                className="w-full text-xl text-stone-200 bg-white/10 border border-white/20 p-4 rounded-lg text-center backdrop-blur-md"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h1 className="text-6xl md:text-9xl font-serif font-bold text-white mb-10 leading-tight tracking-tight drop-shadow-lg">
                                                {tempProfile.heroTitle}
                                            </h1>
                                            <p className="text-xl md:text-3xl text-stone-200/90 font-light italic max-w-3xl mx-auto leading-relaxed border-t border-white/20 pt-10">
                                                {tempProfile.tagline}
                                            </p>
                                        </>
                                    )}

                                    {!isEditing && (
                                        <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center">
                                            <button className="bg-amber-600/90 hover:bg-amber-600 text-white px-12 py-5 rounded-sm font-semibold text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-black/20">
                                                {inputData.wantsToSellOnline ? 'Ver Catálogo' : 'Descubrir Cosecha'}
                                            </button>
                                            <button className="bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white border border-white/30 px-12 py-5 rounded-sm font-semibold text-sm uppercase tracking-[0.2em] transition-all">
                                                Nuestra Unión
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
                                    <div className="w-px h-12 bg-white"></div>
                                </div>
                            </header>

                            <section className="bg-white py-32 px-6 md:px-12 relative">
                                <div className="max-w-7xl mx-auto">
                                    <div className="grid md:grid-cols-3 gap-20">
                                        {tempProfile.valueProposition.map((vp, idx) => (
                                            <div key={idx} className="group text-center">
                                                <div className="w-20 h-20 mx-auto bg-stone-50 border border-stone-100 rounded-full flex items-center justify-center mb-10 group-hover:bg-amber-50 group-hover:border-amber-200 transition-all duration-700 shadow-sm">
                                                    <div className="text-amber-700/40 group-hover:text-amber-700 transition-colors">
                                                        <Sparkles size={32} strokeWidth={1} />
                                                    </div>
                                                </div>
                                                <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-stone-900 mb-4">{vp}</h3>
                                                <div className="w-12 h-px bg-stone-200 mx-auto group-hover:w-20 group-hover:bg-amber-400 transition-all duration-500"></div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Galería Curada */}
                                    <div className="mt-40">
                                        <div className="text-center mb-16">
                                            <span className="text-amber-700 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">Capturando el Alma</span>
                                            <h2 className="text-4xl font-serif font-bold text-stone-900">La Vida en el Apiario</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[700px]">
                                            <div className="md:col-span-8 group relative overflow-hidden rounded-sm shadow-xl">
                                                {tempProfile.galleryImages?.[0] ? (
                                                    <img src={tempProfile.galleryImages[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Apiario" />
                                                ) : (
                                                    <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 font-serif italic">Pureza Capturada</div>
                                                )}
                                                {isEditing && tempProfile.galleryImages?.[0] && (
                                                    <button onClick={() => removeGalleryImage(0)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-xl"><X size={16} /></button>
                                                )}
                                            </div>
                                            <div className="md:col-span-4 grid grid-rows-2 gap-6">
                                                {[1, 2].map(i => (
                                                    <div key={i} className="group relative overflow-hidden rounded-sm shadow-lg h-full">
                                                        {tempProfile.galleryImages?.[i] ? (
                                                            <img src={tempProfile.galleryImages[i]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Detalle" />
                                                        ) : (
                                                            <div className="w-full h-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-300">Detalle {i}</div>
                                                        )}
                                                        {isEditing && tempProfile.galleryImages?.[i] && (
                                                            <button onClick={() => removeGalleryImage(i)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-xl"><X size={16} /></button>
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
                                                    <Plus size={16} /> Gestionar Galería
                                                </button>
                                                <input type="file" ref={galleryInputRef} onChange={handleGalleryUpload} accept="image/*" multiple className="hidden" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Sección de Tienda / Kit de Pago (Mockup) */}
                                    {inputData.wantsToSellOnline && (
                                        <div className="mt-40 border-t border-stone-100 pt-32">
                                            <div className="text-center mb-20">
                                                <span className="text-amber-700 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">Venta Directa del Apiario</span>
                                                <h2 className="text-4xl font-serif font-bold text-stone-900">Selección de la Estación</h2>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                                                <div className="bg-[#fdfcf8] p-10 border border-stone-100 flex flex-col items-center">
                                                    <div className="w-full aspect-[4/5] bg-stone-200 mb-8 relative group overflow-hidden">
                                                        <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors"></div>
                                                        <img src="https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=800" className="w-full h-full object-cover" alt="Miel Pura" />
                                                    </div>
                                                    <h3 className="text-xl font-serif font-bold mb-2">Miel de Pradera Real</h3>
                                                    <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-6">Cosecha Limitada — 500g</p>
                                                    <div className="text-2xl font-serif text-stone-900 mb-8">$18.50</div>
                                                    <button className="w-full py-4 bg-stone-900 text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-colors flex items-center justify-center gap-3">
                                                        <Sparkles size={14} className="text-amber-400" /> Añadir al Carrito
                                                    </button>
                                                </div>

                                                <div className="bg-stone-900 p-12 text-white flex flex-col justify-center border-l-4 border-amber-500">
                                                    <h3 className="text-3xl font-serif font-bold mb-6 italic leading-tight">"Calidad garantizada desde el panal hasta tu mesa."</h3>
                                                    <p className="text-stone-400 text-sm leading-relaxed mb-10">
                                                        Activa tu cuenta para configurar tu billetera y empezar a recibir pagos sin intermediarios.
                                                    </p>
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-4">
                                                            <span>Subtotal</span>
                                                            <span>$18.50</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest pt-2">
                                                            <span>Total</span>
                                                            <span className="text-amber-400">$18.50</span>
                                                        </div>
                                                    </div>
                                                    <button className="mt-12 w-full py-5 bg-amber-500 text-stone-900 font-black text-xs uppercase tracking-[0.3em] hover:bg-amber-400 transition-all shadow-xl shadow-black/40">
                                                        Pagar con Kit de Pago
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-40 bg-stone-50 p-20 rounded-sm border border-stone-100 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                                            <div className="text-stone-900 scale-[4] rotate-12 font-serif font-black">"{inputData.farmName.charAt(0)}"</div>
                                        </div>
                                        <div className="max-w-3xl mx-auto text-center relative z-10">
                                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-800 mb-10 block">Nuestra Esencia</span>
                                            {isEditing ? (
                                                <textarea
                                                    value={tempProfile.aboutUsText}
                                                    onChange={(e) => handleChange('aboutUsText', e.target.value)}
                                                    className="w-full text-2xl text-stone-700 font-serif leading-[1.8] text-center bg-white border border-stone-200 p-8 rounded-xl"
                                                    rows={4}
                                                />
                                            ) : (
                                                <p className="text-3xl md:text-4xl text-stone-800 font-serif leading-[1.6] italic">"{tempProfile.aboutUsText}"</p>
                                            )}
                                            <div className="mt-12 flex flex-col items-center">
                                                <div className="w-16 h-px bg-amber-600 mb-6"></div>
                                                <p className="font-bold uppercase text-[11px] tracking-[0.3em] text-stone-400">{inputData.name}</p>
                                                <p className="text-[9px] uppercase tracking-[0.2em] text-stone-300 mt-2">Fundador de {inputData.farmName}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <footer className="bg-white border-t border-stone-100 py-24 px-6 md:px-12 text-center">
                                <div className="max-w-xs mx-auto mb-12">
                                    <div className="font-serif text-2xl font-bold mb-4">{inputData.farmName}</div>
                                    <div className="w-12 h-1 bg-amber-600 mx-auto"></div>
                                </div>
                                <div className="flex justify-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 border-b border-stone-50 pb-12 mb-12">
                                    <span className="cursor-pointer hover:text-stone-900 transition-colors">Instagram</span>
                                    <span className="cursor-pointer hover:text-stone-900 transition-colors">Privacidad</span>
                                    <span className="cursor-pointer hover:text-stone-900 transition-colors">Términos</span>
                                </div>
                                <p className="text-[9px] font-medium text-stone-300 uppercase tracking-widest italic">
                                    © {new Date().getFullYear()} {inputData.farmName} — Colección Privada
                                </p>
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


                    <BlockCard className="bg-nounYellow">
                        <h3 className="text-xl font-black uppercase mb-2 pixel-font tracking-tighter">¿Todo listo?</h3>
                        <p className="mb-6 text-xs font-bold leading-tight">Al publicar, tu web estará disponible para todo el mundo bajo tu nombre @{cleanHandle}.</p>
                        <Button fullWidth onClick={() => setIsAuthModalOpen(true)} className="text-sm py-4">
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
            <SocialAuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                farmName={inputData.farmName}
                onSelectProvider={async (provider) => {
                    try {
                        console.log(`Intentando guardar con provider: ${provider}`);
                        // Para el MVP, usamos el handle de la red social como identificador
                        const identifier = inputData.socialUrl.split('/').pop() || inputData.name;

                        await profileService.saveProfile(identifier, profile, inputData);

                        alert(`¡ÉXITO! Tu web "${inputData.farmName}" ha sido publicada y vinculada a tu cuenta de ${provider.toUpperCase()}.`);
                        setIsAuthModalOpen(false);
                    } catch (err: any) {
                        console.error("Error al publicar:", err);
                        alert("Hubo un problema al publicar. Revisa la consola para más detalles.");
                    }
                }}
            />
        </div>
    );
};
