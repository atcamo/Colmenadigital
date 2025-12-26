
import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { BeekeeperForm } from './components/BeekeeperForm';
import { WebPreview } from './components/WebPreview';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AppState, BeekeeperInput, GeneratedWebProfile } from './types';
import { generateWebProfile } from './services/geminiService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [inputData, setInputData] = useState<BeekeeperInput | null>(null);
  const [profile, setProfile] = useState<GeneratedWebProfile | null>(null);
  const [originalProfile, setOriginalProfile] = useState<GeneratedWebProfile | null>(null);

  const handleStartForm = () => setState(AppState.FORM);
  const handleGoHome = () => setState(AppState.LANDING);
  
  const handleBack = () => {
    if (state === AppState.RESULT) setState(AppState.FORM);
    else if (state === AppState.FORM) setState(AppState.LANDING);
  };

  const handleFormSubmit = async (data: BeekeeperInput) => {
    setInputData(data);
    setState(AppState.LOADING);
    
    try {
      const result = await generateWebProfile(data);
      setProfile(result);
      setOriginalProfile(result);
      setState(AppState.RESULT);
    } catch (error) {
      console.error(error);
      alert("Error conectando con la colmena. Intenta de nuevo.");
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
          />
        )}
      </div>

      <Footer />
    </main>
  );
};

export default App;
