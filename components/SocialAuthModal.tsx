
import React from 'react';
import { BlockCard } from './BlockCard';
import { X as XIcon, Instagram, Zap, ShieldCheck, ArrowRight, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectProvider: (provider: 'x' | 'instagram' | 'farcaster') => void;
  farmName: string;
}

export const SocialAuthModal: React.FC<Props> = ({ isOpen, onClose, farmName }) => {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleEmailLogin = async () => {
    if (!supabase) return;
    setIsLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      if (error) throw error;
      setMessage("¡Link enviado! Revisa tu email.");
    } catch (err: any) {
      alert(err.message || "Error al enviar el link");
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectProvider = async (provider: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      alert(err.message || `Error al conectar con ${provider}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <BlockCard className="relative w-full max-w-md bg-white border-4 border-black overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-black uppercase pixel-font leading-none mb-2">Asegura tu Colmena</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Conéctate para guardar y editar "{farmName}" en el futuro.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 border-2 border-transparent hover:border-black transition-all">
              <XIcon size={24} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Login con Email (Magic Link) - RECOMENDADO */}
            <div className="p-4 border-4 border-black bg-nounYellow/5 space-y-3">
              <p className="font-black uppercase text-[10px] text-gray-400 tracking-widest">Acceso Directo (Recomendado)</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-black p-2 pl-10 font-bold text-sm outline-none focus:bg-white"
                  />
                </div>
                <button
                  disabled={isLoading || !email}
                  onClick={handleEmailLogin}
                  className="bg-black text-white px-4 py-2 font-black text-xs uppercase hover:bg-nounRed disabled:opacity-50 transition-colors flex items-center gap-2 shadow-hard-sm active:translate-y-0.5 active:shadow-none"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={14} /> : "Entrar"}
                </button>
              </div>
              {message && (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-nounBlue animate-pulse">
                  <CheckCircle2 size={14} /> {message}
                </div>
              )}
            </div>

            <div className="relative py-2 flex items-center">
              <div className="flex-grow border-t-2 border-black/10"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black text-gray-300 uppercase">O usa tus redes</span>
              <div className="flex-grow border-t-2 border-black/10"></div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Instagram */}
              <button
                onClick={() => onSelectProvider('instagram')}
                className="flex flex-col items-center gap-2 p-3 border-2 border-black hover:bg-pink-50 transition-colors shadow-hard-sm"
              >
                <Instagram size={20} />
                <span className="text-[8px] font-black uppercase">IG</span>
              </button>

              {/* X */}
              <button
                onClick={() => onSelectProvider('x')}
                className="flex flex-col items-center gap-2 p-3 border-2 border-black hover:bg-gray-100 transition-colors shadow-hard-sm"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                <span className="text-[8px] font-black uppercase">X</span>
              </button>

              {/* Farcaster */}
              <button
                onClick={() => onSelectProvider('farcaster')}
                className="flex flex-col items-center gap-2 p-3 border-2 border-black border-dashed opacity-50 cursor-not-allowed"
              >
                <Zap size={20} />
                <span className="text-[8px] font-black uppercase">Soon</span>
              </button>
            </div>
          </div>

          <div className="mt-8 flex gap-3 p-4 bg-nounBlue/10 border-2 border-nounBlue text-nounBlue">
            <ShieldCheck className="flex-shrink-0" size={20} />
            <p className="text-[10px] font-bold uppercase leading-tight">
              Tus datos están protegidos. Solo usamos esta red para confirmar que eres el dueño legítimo de esta colmena.
            </p>
          </div>
        </div>
      </BlockCard>
    </div>
  );
};
