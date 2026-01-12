
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
import { Loader2, Sparkles } from 'lucide-react';
import { NounsBee } from './components/NounsBee';
import { profileService } from './services/profileService';

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
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Función para sincronizar datos locales con el servidor cuando el usuario se loguea
  const syncProfileWithUser = async (userId: string) => {
    try {
      // 1. Intentar cargar perfil guardado en la nube
      const savedData = await profileService.getProfile(userId);

      // 2. Revisar si hay cambios locales pendientes de guardar (hechos justo antes de loguearse)
      const localProfile = localStorage.getItem('pending_profile');
      const localInput = localStorage.getItem('pending_input');

      if (localProfile && localInput) {
        const p = JSON.parse(localProfile);
        const i = JSON.parse(localInput);

        // Guardamos lo que el usuario estaba editando localmente en la base de datos
        await profileService.saveProfile(userId, p, i);

        // Limpiamos local
        localStorage.removeItem('pending_profile');
        localStorage.removeItem('pending_input');

        // Actualizamos estado
        setProfile(p);
        setOriginalProfile(p);
        setInputData(i);
        setState(AppState.RESULT);
      } else if (savedData) {
        // Si no hay nada local pero sí en la nube, cargamos lo de la nube
        setProfile(savedData.profile_data);
        setOriginalProfile(savedData.profile_data);
        setInputData(savedData.input_data);
        setState(AppState.RESULT);
      }
    } catch (err) {
      console.error("Error sincronizando perfil:", err);
    }
  };

  // Eliminar el useEffect anterior de cargar perfil y usar syncProfileWithUser

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

      // Si el usuario está logueado, guardamos automáticamente
      if (user) {
        await profileService.saveProfile(user.id, result, data);
      } else {
        // Si no está logueado, guardamos en localStorage para cuando se loguee
        localStorage.setItem('pending_profile', JSON.stringify(result));
        localStorage.setItem('pending_input', JSON.stringify(data));
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Error desconocido conectando con la colmena.");
      setState(AppState.FORM);
    }
  };

  const handleProfileUpdate = async (updatedProfile: GeneratedWebProfile) => {
    setProfile(updatedProfile);
    // Si el usuario está logueado, guardamos los cambios
    if (user && inputData) {
      try {
        await profileService.saveProfile(user.id, updatedProfile, inputData);
      } catch (err) {
        console.error("Error actualizando perfil:", err);
      }
    }
  };
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
            isLoading={state === AppState.LOADING}
            onBack={handleBack}
            error={error}
          />
        )}

        {state === AppState.LOADING && (
          <div className="min-h-screen bg-nounYellow flex flex-col items-center justify-center p-4 text-center overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='100' viewBox='0 0 56 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 66 L0 50 L0 16 L28 0 L56 16 L56 50 L28 66 L28 100' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E")`, backgroundSize: '56px 100px' }}>
            </div>

            <div className="relative w-full max-w-xl h-48 mb-6 flex items-center justify-center bg-white/50 border-4 border-black border-dashed overflow-hidden rounded-3xl">
              {/* Central Flower (Target) */}
              <div className="absolute animate-flower-bloom">
                <svg viewBox="0 0 100 100" className="w-24 h-24">
                  {/* Petals */}
                  <circle cx="50" cy="25" r="20" fill="#E63433" />
                  <circle cx="75" cy="50" r="20" fill="#E63433" />
                  <circle cx="50" cy="75" r="20" fill="#E63433" />
                  <circle cx="25" cy="50" r="20" fill="#E63433" />
                  {/* Center */}
                  <circle cx="50" cy="50" r="15" fill="#FFFF00" stroke="black" strokeWidth="4" />
                </svg>
              </div>

              {/* Pacman Bee */}
              <div className="absolute z-10 animate-bee-pacman">
                <NounsBee className="w-20 h-auto drop-shadow-xl" />
              </div>

              {/* Decorative Flowers in background */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute opacity-20 scale-50"
                  style={{
                    left: `${(i * 20)}%`,
                    top: i % 2 === 0 ? '10%' : '70%',
                    animation: `flower-bloom 3s infinite ${i * 0.5}s`
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-16 h-16">
                    <circle cx="50" cy="25" r="20" fill="#2D81FF" />
                    <circle cx="75" cy="50" r="20" fill="#2D81FF" />
                    <circle cx="50" cy="75" r="20" fill="#2D81FF" />
                    <circle cx="25" cy="50" r="20" fill="#2D81FF" />
                    <circle cx="50" cy="50" r="15" fill="#FFFF00" stroke="black" strokeWidth="2" />
                  </svg>
                </div>
              ))}
            </div>

            <div className="max-w-2xl space-y-6 relative z-10 px-4">
              <h2 className="text-4xl md:text-6xl font-black uppercase pixel-font mb-4 tracking-tighter">
                Recolectando Polen...
              </h2>
              <div className="bg-white border-4 border-black p-6 shadow-hard-sm inline-block">
                <p className="text-xl md:text-2xl font-bold flex items-center justify-center gap-3">
                  <Sparkles className="text-nounYellow fill-nounYellow" />
                  La IA está destilando tu esencia artesanal
                  <Sparkles className="text-nounYellow fill-nounYellow" />
                </p>
              </div>

              <div className="flex justify-center gap-3 mt-8">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-5 h-5 bg-nounRed border-2 border-black shadow-hard-sm animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  ></div>
                ))}
              </div>

              <p className="text-sm font-black uppercase tracking-widest text-black/40 mt-12 animate-pulse">
                Procesando Trazabilidad • Generando Estrategia • Optimizando Diseño
              </p>
            </div>
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
