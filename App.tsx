
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
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
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
        setUser(session?.user ?? null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleStartForm = () => {
    setError(null);
    setState(AppState.FORM);
  };
  const handleGoHome = () => setState(AppState.LANDING);

  const handleBack = () => {
    setError(null);
    if (state === AppState.RESULT) setState(AppState.FORM);
    else if (state === AppState.FORM) setState(AppState.LANDING);
  };

  const handleFormSubmit = async (data: BeekeeperInput) => {
    setInputData(data);
    setError(null);
    setState(AppState.LOADING);

    try {
      const result = await generateWebProfile(data);
      setProfile(result);
      setOriginalProfile(result);
      setState(AppState.RESULT);
    } catch (error: any) {
      console.error(error);
      // Usamos el mensaje del error que viene del servicio (que ya tiene lógica de reintentos)
      setError(error.message || "Error desconocido conectando con la colmena.");
      setState(AppState.FORM);
    }
  };

  const handleProfileUpdate = (updatedProfile: GeneratedWebProfile) => setProfile(updatedProfile);
  const handleResetToOriginal = () => originalProfile && setProfile(originalProfile);

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
            isLoading={false}
            onBack={handleBack}
            error={error}
          />
        )}

        {state === AppState.LOADING && (
          <div className="min-h-screen bg-nounYellow flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-8 animate-spin text-black">
              <Loader2 size={64} strokeWidth={3} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase pixel-font mb-4">
              Construyendo...
            </h2>
            <p className="text-xl font-bold max-w-xl mx-auto">
              La IA está aplicando la plantilla "Colmena Pro" a tus datos.
            </p>
          </div>
        )}

        {state === AppState.RESULT && profile && inputData && (
          <WebPreview
            profile={profile}
            inputData={inputData}
            onEditInputs={() => setState(AppState.FORM)}
            onUpdateProfile={handleProfileUpdate}
            onResetProfile={handleResetToOriginal}
            isModified={JSON.stringify(profile) !== JSON.stringify(originalProfile)}
            user={user}
            onLogin={() => setIsAuthModalOpen(true)}
          />
        )}
      </div>

      <Footer />

      <SocialAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        farmName={inputData?.farmName || "tu Marca"}
      />
    </main>
  );
};

export default App;
