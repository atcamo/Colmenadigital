
import React, { useState, useEffect } from 'react';
import { BeekeeperInput } from '../types';
import { Button } from './Button';
import { BlockCard } from './BlockCard';
import { Info, Image as ImageIcon, Instagram, AlertCircle, ShieldCheck, XCircle, Copy, Check, ChevronRight, ChevronLeft, User, MapPin, BadgeCheck, Zap, ShoppingBag } from 'lucide-react';

interface Props {
  onSubmit: (data: BeekeeperInput) => void;
  isLoading: boolean;
  onBack: () => void;
  error?: string | null;
}

const MARKET_OPTS = ["Precios muy bajos", "Intermediarios abusan", "Miel adulterada compite", "Poca venta local"];
const MONEY_OPTS = ["Sin acceso a crédito", "Pagos muy lentos", "Inversión alta", "Costos suben"];

type Step = 1 | 2 | 3 | 4;

export const BeekeeperForm: React.FC<Props> = ({ onSubmit, isLoading, onBack, error }) => {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<BeekeeperInput>({
    name: '', farmName: '', location: '', painPointMarket: '',
    painPointTraceability: '', painPointMoney: '', socialUrl: '', logo: '',
    wantsToSellOnline: false
  });

  const [urlError, setUrlError] = useState<string | null>(null);
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [copied, setCopied] = useState(false);

  const validateUrl = (url: string) => {
    if (!url) return false;
    const socialPattern = /^(https?:\/\/)?(www\.)?(instagram\.com|facebook\.com|fb\.me|twitter\.com|x\.com|tiktok\.com|youtube\.com|linkedin\.com)\/[a-zA-Z0-9_.-]+\/?$/i;
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
      }, 800);

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

  const setPainPoint = (field: keyof BeekeeperInput, value: string) => {
    const current = formData[field] as string;
    if (current.includes(value)) return;
    const newValue = current ? `${current}, ${value}` : value;
    setFormData({ ...formData, [field]: newValue });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, logo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleCopyError = () => {
    if (error) {
      navigator.clipboard.writeText(error);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.farmName || !formData.location)) return;
    if (step === 2 && (!isUrlValid || isChecking)) return;
    if (step < 4) setStep((prev) => (prev + 1) as Step);
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => (prev - 1) as Step);
    else onBack();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 4) onSubmit(formData);
  };

  const renderChips = (options: string[], field: keyof BeekeeperInput) => (
    <div className="flex flex-wrap gap-2 mb-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => setPainPoint(field, opt)}
          className="text-[10px] font-bold uppercase px-3 py-1 bg-gray-100 border-2 border-gray-300 hover:bg-nounYellow hover:border-black hover:-translate-y-0.5 transition-all text-gray-600 hover:text-black rounded-full"
        >
          + {opt}
        </button>
      ))}
    </div>
  );

  const stepsInfo = [
    { title: "Identidad", icon: <User size={16} /> },
    { title: "Verificación", icon: <BadgeCheck size={16} /> },
    { title: "Desafíos", icon: <Zap size={16} /> },
    { title: "Negocio", icon: <ShoppingBag size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-nounOffWhite py-8 px-4 flex flex-col items-center justify-center font-sans">
      <div className="max-w-3xl w-full">
        <div className="mb-8 flex justify-between items-center px-2">
          {stepsInfo.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all ${step > i + 1 ? 'bg-black border-black text-white' : (step === i + 1 ? 'bg-nounYellow border-black scale-110 shadow-hard-sm' : 'bg-white border-gray-200 text-gray-300')}`}>
                {step > i + 1 ? <Check size={20} /> : s.icon}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter ${step === i + 1 ? 'text-black' : 'text-gray-300'}`}>{s.title}</span>
            </div>
          ))}
        </div>

        <BlockCard className="bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
            <div className="h-full bg-nounYellow transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>

          <form onSubmit={handleSubmit} className="pt-6">
            {error && (
              <div className="mb-6 bg-red-100 border-4 border-nounRed p-4 flex items-center justify-between gap-3 animate-pulse cursor-help group relative">
                <div className="flex items-center gap-3">
                  <XCircle className="text-nounRed w-8 h-8 flex-shrink-0" />
                  <div>
                    <h4 className="font-black uppercase text-nounRed text-sm">Error en la Colmena</h4>
                    <p className="text-xs font-bold text-red-800">Revisa los datos e intenta de nuevo.</p>
                  </div>
                </div>
                <button type="button" onClick={handleCopyError} className="p-2 bg-white border-2 border-red-200 rounded">
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-nounRed" />}
                </button>
              </div>
            )}

            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black uppercase pixel-font mb-2">¿Con quién hablamos?</h2>
                  <p className="font-bold text-gray-500 uppercase text-xs">Queremos conocer el alma detrás de la miel.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-black text-sm uppercase flex items-center gap-2"><User size={14} /> Tu nombre completo</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full border-4 border-black p-4 font-bold focus:bg-nounYellow/10 outline-none text-lg" placeholder="Ej: Pedro Juan" autoFocus />
                  </div>
                  <div className="space-y-2">
                    <label className="font-black text-sm uppercase flex items-center gap-2"><ImageIcon size={14} /> Nombre de tu Marca / Apiario</label>
                    <input required name="farmName" value={formData.farmName} onChange={handleChange} className="w-full border-4 border-black p-4 font-bold focus:bg-nounYellow/10 outline-none text-lg" placeholder="Ej: Miel del Monte" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-black text-sm uppercase flex items-center gap-2"><MapPin size={14} /> ¿Dónde te encuentras?</label>
                    <input required name="location" value={formData.location} onChange={handleChange} className="w-full border-4 border-black p-4 font-bold focus:bg-nounYellow/10 outline-none text-lg" placeholder="Ciudad, Región" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: VERIFICATION */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black uppercase pixel-font mb-2">Tu Huella</h2>
                  <p className="font-bold text-gray-500 uppercase text-xs">Pega tu red social para validar que eres un apicultor real.</p>
                </div>

                <div className={`p-6 border-4 border-black shadow-hard-sm transition-all duration-300 ${isUrlValid ? 'bg-blue-50 border-nounBlue' : (formData.socialUrl && !isChecking ? 'bg-red-50 border-nounRed' : 'bg-gray-50')}`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-black uppercase text-sm">Link de Instagram / Facebook</h3>
                    {isChecking ? <AlertCircle className="animate-spin text-nounBlue" /> : isUrlValid ? <ShieldCheck className="text-nounBlue" /> : null}
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Instagram size={24} /></div>
                    <input required name="socialUrl" value={formData.socialUrl} onChange={handleChange} placeholder="instagram.com/tu_marca" className="w-full border-4 border-black p-4 pl-12 font-bold text-lg outline-none" autoFocus />
                  </div>
                  {urlError && <p className="text-nounRed font-black text-[10px] mt-2 uppercase">{urlError}</p>}
                </div>

                <div className="bg-gray-100 p-6 border-4 border-black border-dashed">
                  <h3 className="font-black text-sm uppercase mb-2">¿Tienes un logo?</h3>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-4">Opcional: Lo usaremos para personalizar tu web profesional.</p>
                  <label className="cursor-pointer bg-white border-2 border-black px-4 py-2 font-black text-xs uppercase hover:bg-black hover:text-white transition-all inline-block">
                    {formData.logo ? 'CAMBIAR LOGO' : 'SUBIR IMAGEN'}
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {formData.logo && <img src={formData.logo} className="mt-4 h-12 w-auto border-2 border-black" alt="Preview" />}
                </div>
              </div>
            )}

            {/* STEP 3: CHALLENGES */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black uppercase pixel-font mb-2">Tus Desafíos</h2>
                  <p className="font-bold text-gray-500 uppercase text-xs">¿Qué te quita el sueño? La IA diseñará tu mensaje de venta aquí.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-black text-sm uppercase">Problemas de Mercado</label>
                    {renderChips(MARKET_OPTS, 'painPointMarket')}
                    <textarea required name="painPointMarket" value={formData.painPointMarket} onChange={handleChange} className="w-full border-4 border-black p-4 font-bold h-24 outline-none focus:bg-nounYellow/5" placeholder="Cuéntanos..." />
                  </div>

                  <div className="space-y-2">
                    <label className="font-black text-sm uppercase">Problemas Financieros</label>
                    {renderChips(MONEY_OPTS, 'painPointMoney')}
                    <textarea required name="painPointMoney" value={formData.painPointMoney} onChange={handleChange} className="w-full border-4 border-black p-4 font-bold h-24 outline-none focus:bg-nounYellow/5" placeholder="Cuéntanos..." />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: BUSINESS */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black uppercase pixel-font mb-2">Venta Directa</h2>
                  <p className="font-bold text-gray-500 uppercase text-xs">El paso final para tu independencia financiera.</p>
                </div>

                <div className={`p-8 border-4 border-black shadow-hard transition-all ${formData.wantsToSellOnline ? 'bg-black text-white' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black uppercase mb-2">Habitar el E-commerce</h3>
                      <p className="text-sm font-bold opacity-80 uppercase leading-tight">¿Quieres que tu página permita a los clientes comprar tus productos directamente?</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, wantsToSellOnline: !prev.wantsToSellOnline }))}
                      className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors border-4 border-current ${formData.wantsToSellOnline ? 'bg-nounYellow text-white' : 'bg-white text-black'}`}
                    >
                      <span className={`${formData.wantsToSellOnline ? 'translate-x-11' : 'translate-x-1'} inline-block h-6 w-6 transform rounded-full bg-current transition-transform`} />
                    </button>
                  </div>
                </div>

                <div className="bg-nounYellow/20 p-6 border-4 border-black flex gap-4 items-start">
                  <Info className="flex-shrink-0" />
                  <p className="text-xs font-bold leading-relaxed">
                    Al confirmar, nuestra IA generará una estrategia personalizada para que vendas directo sin intermediarios, aprovechando el valor de tu marca artesanal.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-12">
              <button type="button" onClick={prevStep} className="flex-1 bg-white border-4 border-black font-black py-4 text-sm uppercase hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <ChevronLeft size={20} /> ATRÁS
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (step === 1 && (!formData.name || !formData.farmName || !formData.location)) ||
                    (step === 2 && (!isUrlValid || isChecking))
                  }
                  className="flex-[2] bg-nounYellow border-4 border-black font-black py-4 text-sm uppercase shadow-hard-sm hover:-translate-y-1 hover:shadow-hard active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  SIGUIENTE <ChevronRight size={20} />
                </button>
              ) : (
                <Button type="submit" className="flex-[2] text-xl" disabled={isLoading}>
                  {isLoading ? 'ENVIANDO...' : 'CREAR MI WEB'}
                </Button>
              )}
            </div>
          </form>
        </BlockCard>
      </div>
    </div>
  );
};
