
import React from 'react';
import { NounsGlasses } from './NounsGlasses';
import { ArrowLeft } from 'lucide-react';
import { AppState } from '../types';
import { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { useTranslation } from '../context/LanguageContext';
import { Language } from '../translations';

interface Props {
  currentState: AppState;
  onGoHome: () => void;
  onBack: () => void;
  user: User | null;
  onLogin: () => void;
  isAdmin?: boolean;
}

export const Header: React.FC<Props> = ({ currentState, onGoHome, onBack, user, onLogin, isAdmin }) => {
  const { lang, setLang, t } = useTranslation();

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  const LangButton = ({ code, label }: { code: Language, label: string }) => (
    <button
      onClick={() => setLang(code)}
      className={`px-2 py-1 text-[8px] font-black border-2 transition-all ${lang === code ? 'bg-black text-white border-black' : 'bg-white text-black border-black/10 hover:border-black'}`}
    >
      {label}
    </button>
  );

  return (
    <header className="bg-nounYellow border-b-4 border-black p-3 sticky top-0 z-50 shadow-hard-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        <div className="flex items-center gap-4">
          {(currentState === AppState.FORM || currentState === AppState.RESULT || currentState === AppState.ADMIN) && (
            <button
              onClick={onBack}
              className="p-2 bg-white border-2 border-black shadow-hard-sm hover:translate-y-1 hover:shadow-none transition-all"
              title={t('common.back')}
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <button onClick={onGoHome} className="flex items-center gap-2 group">
            <div className="w-8 md:w-12 h-5 md:h-7 relative flex items-center overflow-hidden">
              <NounsGlasses className="w-full h-auto" color="#E63433" />
            </div>
            <span className="hidden sm:inline font-black text-lg md:text-2xl uppercase pixel-font tracking-tighter group-hover:text-nounRed transition-colors -ml-1">
              BeeNouns
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center bg-white border-2 border-black p-0.5 shadow-hard-xs">
            <LangButton code="es" label="ES" />
            <LangButton code="en" label="EN" />
            <LangButton code="pt" label="PT" />
          </div>

          <div className="hidden md:flex items-center gap-6 font-black uppercase text-sm tracking-widest">
            <span className="text-nounRed pixel-font text-[11px] md:text-sm opacity-100 tracking-normal">{t('header.digitalHive')}</span>
          </div>

          {user ? (
            <div className="flex items-center gap-3 bg-white border-2 border-black px-3 py-1.5 shadow-hard-sm">
              <div className="hidden sm:block text-right">
                <p className="text-[8px] font-black uppercase text-gray-400 leading-none">{t('header.myProfile')}</p>
                <p className="text-[10px] font-black truncate max-w-[100px]">{user.email?.split('@')[0]}</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => (window as any).setAppStateAdmin()}
                  className="bg-nounBlue text-white px-3 py-1 font-black text-[10px] uppercase hover:bg-blue-600 transition-colors"
                >
                  Admin
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-black text-white px-3 py-1 font-black text-[10px] uppercase hover:bg-nounRed transition-colors"
                title={t('common.logout')}
              >
                {t('common.logout').split(' ')[0]}
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="text-[9px] font-black uppercase text-gray-500 bg-white border border-black px-3 py-1 shadow-hard-sm hover:bg-nounYellow hover:-translate-y-0.5 transition-all"
            >
              {t('common.login')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
