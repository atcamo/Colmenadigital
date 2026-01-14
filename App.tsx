
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
    // Si el usuario está logueado, guardamos los cambios en la nube
    if (user && inputData) {
      try {
        await profileService.saveProfile(user.id, updatedProfile, inputData);
      } catch (err) {
        console.error("Error actualizando perfil:", err);
      }
    } else if (inputData) {
      // Si no hay usuario, guardamos en local para que no se pierdan los cambios 
      // al recargar para el login
      localStorage.setItem('pending_profile', JSON.stringify(updatedProfile));
      localStorage.setItem('pending_input', JSON.stringify(inputData));
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
          <LoadingState />
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
