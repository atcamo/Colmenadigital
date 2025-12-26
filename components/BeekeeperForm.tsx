
import React, { useState, useEffect } from 'react';
import { BeekeeperInput } from '../types';
import { Button } from './Button';
import { BlockCard } from './BlockCard';
import { Info, Image as ImageIcon, Instagram, AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';

interface Props {
  onSubmit: (data: BeekeeperInput) => void;
  isLoading: boolean;
  onBack: () => void;
}

export const BeekeeperForm: React.FC<Props> = ({ onSubmit, isLoading, onBack }) => {
  const [formData, setFormData] = useState<BeekeeperInput>({
    name: '', farmName: '', location: '', painPointMarket: '',
    painPointTraceability: '', painPointMoney: '', socialUrl: '', logo: ''
  });

  const [urlError, setUrlError] = useState<string | null>(null);
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const validateUrl = (url: string) => {
    if (!url) return false;
    // Regex para detectar perfiles reales de redes sociales comunes
    const socialPattern = /^(https?:\/\/)?(www\.)?(instagram\.com|facebook\.com|fb\.me|twitter\.com|x\.com|tiktok\.com|youtube\.com|linkedin\.com)\/[a-zA-Z0-9_.-]+\/?$/i;
    // Regex genérico para sitios web de apiarios
    const webPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    
    return socialPattern.test(url) || (webPattern.test(url) && url.includes('.'));
  };

  useEffect(() => {
    if (formData.socialUrl) {
      setIsChecking(true);
      setIsUrlValid(false);
      setUrlError(null);

      const timer = setTimeout(() => {
        const valid = validateUrl(formData.socialUrl);
        setIsUrlValid(valid);
        if (!valid) {
          setUrlError("El enlace no parece un perfil real. Usa: instagram.com/usuario");
        }
        setIsChecking(false);
      }, 800); // Simulamos una verificación de red

      return () => clearTimeout(timer);
    } else {
      setIsUrlValid(false);
      setUrlError(null);
      setIsChecking(false);
    }
  }, [formData.socialUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, logo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUrlValid || isChecking) return;
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-nounOffWhite py-8 px-4 flex flex-col items-center justify-center font-sans">
      <div className="max-w-3xl w-full">
        <BlockCard className="bg-white">
          <h2 className="text-3xl md:text-5xl font-black mb-8 text-center uppercase pixel-font">El Intercambio</h2>
          
          <div className="mb-8 p-4 bg-nounYellow border-4 border-black shadow-hard-sm flex gap-4 items-start">
            <Info className="w-8 h-8 flex-shrink-0" />
            <p className="font-bold">Este es un trato: tú nos das datos reales de tu trabajo, nosotros te damos tecnología de punta. <span className="text-nounRed underline">La red social es obligatoria</span> para verificar que eres un apicultor real.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección: Identidad del Apiario */}
            <div className="space-y-4">
              <h3 className="text-xl font-black uppercase border-b-4 border-black inline-block mb-2">1. Identidad</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-black text-sm uppercase">Tu Nombre *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full border-4 border-black p-3 font-bold focus:bg-nounYellow/10 outline-none" placeholder="Ej: Pedro Juan" />
                </div>
                <div className="space-y-2">
                  <label className="font-black text-sm uppercase">Nombre de tu Apiario *</label>
                  <input required name="farmName" value={formData.farmName} onChange={handleChange} className="w-full border-4 border-black p-3 font-bold focus:bg-nounYellow/10 outline-none" placeholder="Ej: Miel del Monte" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-black text-sm uppercase">Ubicación *</label>
                <input required name="location" value={formData.location} onChange={handleChange} className="w-full border-4 border-black p-3 font-bold focus:bg-nounYellow/10 outline-none" placeholder="Ciudad, Región" />
              </div>
            </div>

            {/* Sección: Huella Digital (OBLIGATORIA CON VERIFICACIÓN) */}
            <div className={`p-6 border-4 border-black shadow-hard-sm transition-all duration-300 ${
              isUrlValid ? 'bg-blue-50 border-nounBlue' : (formData.socialUrl && !isChecking ? 'bg-red-50 border-nounRed' : 'bg-gray-50')
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-black uppercase flex items-center gap-2">
                        2. Verificación Social *
                    </h3>
                    <p className="text-xs font-bold uppercase text-gray-600">Pega el link a tu Instagram o Facebook para validar tu identidad.</p>
                </div>
                {isChecking ? (
                    <Loader2 className="animate-spin text-nounBlue" size={28} />
                ) : isUrlValid ? (
                    <div className="flex flex-col items-end">
                        <ShieldCheck className="text-nounBlue" size={32} />
                        <span className="text-[10px] font-black text-nounBlue uppercase">Validado</span>
                    </div>
                ) : (
                    <AlertCircle className={formData.socialUrl ? "text-nounRed" : "text-gray-300"} size={28} />
                )}
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Instagram size={24} />
                </div>
                <input 
                  required 
                  name="socialUrl" 
                  value={formData.socialUrl} 
                  onChange={handleChange} 
                  placeholder="instagram.com/tu_marca"
                  className={`w-full border-4 p-3 pl-12 font-bold text-lg outline-none transition-all ${
                    isChecking ? 'border-gray-300 opacity-50' : 
                    (formData.socialUrl ? (isUrlValid ? 'border-nounBlue bg-white' : 'border-nounRed bg-white') : 'border-black bg-white')
                  }`} 
                />
              </div>
              {urlError && <p className="text-nounRed font-black text-[10px] mt-2 uppercase animate-pulse">{urlError}</p>}
              {isUrlValid && !isChecking && <p className="text-nounBlue font-black text-[10px] mt-2 uppercase">¡Identidad confirmada! Eres parte de la colmena.</p>}
            </div>

            {/* Logo (Opcional) */}
            <div className="bg-gray-100 p-4 border-2 border-black border-dashed flex items-center justify-between">
                <div>
                  <h3 className="font-black text-sm uppercase flex items-center gap-2"><ImageIcon size={18} /> Logo de tu marca</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Opcional: Si tienes uno, lo pondremos en tu web.</p>
                </div>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-xs max-w-[150px]" />
            </div>

            {/* Sección: Dolores */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xl font-black uppercase text-nounRed border-b-4 border-nounRed inline-block mb-2">3. Tus Desafíos</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-black text-sm uppercase">¿Qué es lo más difícil de vender tu miel? *</label>
                  <textarea required name="painPointMarket" value={formData.painPointMarket} onChange={handleChange} className="w-full border-4 border-black p-3 font-bold h-20 outline-none focus:bg-nounYellow/5" />
                </div>
                <div className="space-y-2">
                  <label className="font-black text-sm uppercase">¿Te piden certificaciones que no tienes? *</label>
                  <textarea required name="painPointTraceability" value={formData.painPointTraceability} onChange={handleChange} className="w-full border-4 border-black p-3 font-bold h-20 outline-none focus:bg-nounYellow/5" />
                </div>
                <div className="space-y-2">
                  <label className="font-black text-sm uppercase">¿Es difícil conseguir dinero para crecer? *</label>
                  <textarea required name="painPointMoney" value={formData.painPointMoney} onChange={handleChange} className="w-full border-4 border-black p-3 font-bold h-20 outline-none focus:bg-nounYellow/5" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button type="button" onClick={onBack} className="flex-1 bg-white border-4 border-black font-bold py-4 text-xl hover:bg-gray-100 transition-colors">ATRÁS</button>
                <Button 
                  type="submit" 
                  className={`flex-[2] text-2xl ${(isChecking || !isUrlValid) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`} 
                  disabled={isLoading || isChecking || !isUrlValid}
                >
                  {isLoading ? 'ENVIANDO...' : 'CREAR MI WEB'}
                </Button>
            </div>
          </form>
        </BlockCard>
      </div>
    </div>
  );
};
