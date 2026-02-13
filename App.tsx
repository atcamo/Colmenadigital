
import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import { User } from '@supabase/supabase-js';
import { Hero } from './components/Hero';
import { BeekeeperForm } from './components/BeekeeperForm';
import { WebPreview } from './components/WebPreview';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SocialAuthModal } from './components/SocialAuthModal';
import { AppState, BeekeeperInput, GeneratedWebProfile } from './types';
import { generateWebProfile } from './services/geminiService';
import { profileService } from './services/profileService';
import { LoadingState } from './components/LoadingState';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { AdminPanel } from './components/AdminPanel';

// CONFIGURACIÓN DE ADMIN: Cambia esto por tu correo de Google
const ADMIN_EMAIL = 'tu-correo-admin@gmail.com';


const AppContent: React.FC = () => {
  const { lang, t } = useTranslation();
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [inputData, setInputData] = useState<BeekeeperInput | null>(null);
  const [profile, setProfile] = useState<GeneratedWebProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<GeneratedWebProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // Escuchar cambios en la autenticación
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          syncProfileWithUser(currentUser.id);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        // Si el usuario acaba de entrar (viniendo de un Magic Link o OAuth)
        if (event === 'SIGNED_IN' && currentUser) {
          syncProfileWithUser(currentUser.id);

          // Si es el admin, lo mandamos directo al panel por defecto si queremos, 
          // o simplemente habilitamos el estado.
          if (currentUser.email === ADMIN_EMAIL) {
            console.log("Bienvenido, Administrador de la Colmena.");
          }
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Lógica de Subdominios Dinámicos
  useEffect(() => {
    const checkSubdomain = async () => {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');

      // Si tenemos un subdominio (ej: miel-artesanal.beenouns.xyz)
      // En localhost suele ser 'localhost', en vercel 'beenouns.xyz'
      // El subdominio sería la primera parte si hay más de 2 partes (sub.domain.tld)
      if (parts.length > 2 && !hostname.includes('vercel.app')) {
        const subdomain = parts[0];
        if (subdomain !== 'www' && subdomain !== 'admin') {
          try {
            const data = await profileService.getProfileBySlug(subdomain);
            if (data) {
              setProfile(data.profile_data);
              setOriginalProfile(data.profile_data);
              setInputData(data.input_data);
              setState(AppState.RESULT);
            }
          } catch (err) {
            console.error("Error cargando perfil de subdominio:", err);
          }
        }
      }
    };

    checkSubdomain();
  }, []);

  const [isModified, setIsModified] = useState(false);

  // Exponer función de admin globalmente para el Header
  useEffect(() => {
    (window as any).setAppStateAdmin = () => {
      if (user?.email === ADMIN_EMAIL) {
        setState(AppState.ADMIN);
      }
    };
  }, [user]);

  // Función para sincronizar datos locales con el servidor cuando el usuario se loguea
  const syncProfileWithUser = async (userId: string) => {
    try {
      const savedData = await profileService.getProfile(userId);
      const localProfile = localStorage.getItem('pending_profile');
      const localInput = localStorage.getItem('pending_input');

      if (localProfile && localInput) {
        const p = JSON.parse(localProfile);
        const i = JSON.parse(localInput);
        await profileService.saveProfile(userId, p, i);
        localStorage.removeItem('pending_profile');
        localStorage.removeItem('pending_input');

        setProfile(p);
        setOriginalProfile(p);
        setInputData(i);
        setState(AppState.RESULT);
        setIsModified(false); // Resetear flag al sincronizar exitosamente
      } else if (savedData) {
        setProfile(savedData.profile_data);
        setOriginalProfile(savedData.profile_data);
        setInputData(savedData.input_data);
        setState(AppState.RESULT);
        setIsModified(false);
      }
    } catch (err) {
      console.error("Error sincronizando perfil:", err);
    }
  };

  const handleStartForm = () => {
    setError(null);
    setState(AppState.FORM);
  };
  const handleGoHome = () => setState(AppState.LANDING);

  const handleBack = () => {
    setError(null);
    if (state === AppState.RESULT) setState(AppState.FORM);
    else if (state === AppState.FORM) setState(AppState.LANDING);
    else if (state === AppState.ADMIN) setState(AppState.LANDING);
  };

  const handleFormSubmit = async (data: BeekeeperInput, logoBase64?: string) => {
    setInputData(data);
    setError(null);
    setState(AppState.LOADING);

    try {
      const result = await generateWebProfile(data, logoBase64, lang);

      setProfile(result);
      setOriginalProfile(result);
      setState(AppState.RESULT);
      setIsModified(false); // Es una versión nueva, no está "modificada" respecto a sí misma

      if (user) {
        await profileService.saveProfile(user.id, result, data);
      } else {
        localStorage.setItem('pending_profile', JSON.stringify(result));
        localStorage.setItem('pending_input', JSON.stringify(data));
      }
    } catch (err: any) {
      console.error("Error en el proceso de generación:", err);
      setError(err.message || "Error al conectar con la colmena.");
      setState(AppState.FORM);
    }
  };

  const handleProfileUpdate = async (updatedProfile: GeneratedWebProfile) => {
    setProfile(updatedProfile);
    setIsModified(true); // Marcamos como modificado explícitamente

    if (user && inputData) {
      try {
        await profileService.saveProfile(user.id, updatedProfile, inputData);
        setIsModified(false); // Tras guardar con éxito en la nube, ya no hay cambios pendientes
        setOriginalProfile(updatedProfile); // El nuevo original es la versión guardada
      } catch (err) {
        console.error("Error actualizando perfil:", err);
      }
    } else if (inputData) {
      localStorage.setItem('pending_profile', JSON.stringify(updatedProfile));
      localStorage.setItem('pending_input', JSON.stringify(inputData));
    }
  };

  const handleResetToOriginal = () => {
    if (originalProfile) {
      setProfile(originalProfile);
      setIsModified(false); // Volvemos al estado original, por lo tanto no hay cambios
    }
  };

  return (
    <main className="min-h-screen font-sans text-black selection:bg-nounRed selection:text-white flex flex-col">
      <Header
        currentState={state}
        onGoHome={handleGoHome}
        onBack={handleBack}
        user={user}
        onLogin={() => setIsAuthModalOpen(true)}
      />

      <div className="flex-grow">
        {state === AppState.LANDING && (
          <Hero onStart={handleStartForm} />
        )}

        {state === AppState.FORM && (
          <BeekeeperForm
            onSubmit={handleFormSubmit}
            isLoading={state === AppState.LOADING}
            onBack={handleBack}
            error={error}
            user={user}
          />
        )}

        {state === AppState.LOADING && (
          <LoadingState />
        )}


        {state === AppState.RESULT && profile && inputData && (
          <WebPreview
            profile={profile}
            inputData={inputData}
            onEditInputs={() => setState(AppState.FORM)}
            onUpdateProfile={handleProfileUpdate}
            onResetProfile={handleResetToOriginal}
            isModified={isModified}
            user={user}
            onLogin={() => setIsAuthModalOpen(true)}
          />
        )}

        {state === AppState.ADMIN && user?.email === ADMIN_EMAIL && (
          <AdminPanel />
        )}
      </div>

      <Footer />

      <SocialAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        farmName={inputData?.farmName || t('modal.yourBrand')}
      />
    </main>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
