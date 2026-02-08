
import React, { useEffect, useState, useRef } from 'react';
import { NounsBee } from './NounsBee';
import { Button } from './Button';
import { ArrowDown, Quote, Sparkles } from 'lucide-react';
import { BlockCard } from './BlockCard';
import { NounsGlasses } from './NounsGlasses';
import { useTranslation } from '../context/LanguageContext';

const InteractiveWord: React.FC<{ word: string, type: 'bee' | 'noun' }> = ({ word, type }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const beeTooltip = {
    title: t('hero.beeTooltip.title'),
    text: t('hero.beeTooltip.text'),
    icon: <span className="text-xl">🐝</span>,
    color: "decoration-amber-400 text-amber-600"
  };

  const nounTooltip = {
    title: t('hero.nounTooltip.title'),
    text: t('hero.nounTooltip.text'),
    icon: <NounsGlasses className="w-8 h-auto" />,
    color: "decoration-nounRed text-nounRed"
  };

  const content = type === 'bee' ? beeTooltip : nounTooltip;

  return (
    <span
      className="relative inline-block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`
        cursor-help font-black underline decoration-4 underline-offset-4 transition-all duration-300
        ${content.color}
        ${type === 'noun' && isHovered ? 'animate-nouns-glitch' : ''}
      `}>
        {word}
      </span>

      {/* Bee Swarm Effect */}
      {type === 'bee' && isHovered && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <span className="absolute top-0 left-0 animate-bee-swarm-1">🐝</span>
          <span className="absolute top-0 left-0 animate-bee-swarm-2">🐝</span>
          <span className="absolute top-0 left-0 animate-bee-swarm-3">🐝</span>
        </div>
      )}

      {/* Tooltip Flotante */}
      <div className={`
        absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-72 p-5
        bg-white border-4 border-black shadow-hard z-50 pointer-events-none
        transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275)
        ${isHovered ? 'opacity-100 translate-y-0 rotate-0 scale-100' : 'opacity-0 translate-y-10 rotate-3 scale-50'}
      `}>
        {/* Decoraciones Divertidas */}
        {type === 'bee' && isHovered && (
          <div className="absolute -top-6 -right-6 animate-bounce text-3xl">🍯</div>
        )}
        {type === 'noun' && isHovered && (
          <div className="absolute -top-6 -left-6 animate-pulse text-3xl">👾</div>
        )}

        <div className="flex items-center gap-3 mb-3 border-b-2 border-black pb-2">
          <div className="bg-gray-100 p-1 border-2 border-black flex items-center justify-center">
            {content.icon}
          </div>
          <span className="font-black uppercase text-sm tracking-tight">{content.title}</span>
        </div>

        <p className="text-sm font-bold leading-relaxed text-left italic">
          "{content.text}"
        </p>

        {/* Flechita del globo */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-4 border-r-4 border-black rotate-45"></div>
      </div>
    </span>
  );
};

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const { t } = useTranslation();
  const [scrollY, setScrollY] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [activeSide, setActiveSide] = useState<'bee' | 'noun' | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // El punto exacto donde la sección amarilla comienza (aproximadamente 100vh)
  const SECTION_THRESHOLD = window.innerHeight * 0.8;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasTriggered(true);
        }
      },
      { threshold: 0.2 }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (triggerRef.current) observer.unobserve(triggerRef.current);
    };
  }, []);

  const interviewColors = ["bg-nounBlue", "bg-green-400", "bg-nounRed"];
  const rawInterviews = t('hero.interviews') || [];
  const interviews = rawInterviews.map((int: any, i: number) => ({
    ...int,
    color: interviewColors[i % interviewColors.length]
  }));

  // La abeja superior baja de forma más pausada y armónica
  const heroTx = scrollY * 0.12;
  const heroTy = scrollY * 0.85; // Multiplicador reducido para un vuelo más lento
  const heroRotate = scrollY * 0.04;
  const heroScale = 1 - (scrollY * 0.0008);

  // Determinamos si la abeja superior ya cruzó el "horizonte" de la sección amarilla
  const isTopBeeHidden = scrollY > SECTION_THRESHOLD;

  // Condición final para que la abeja inferior sea la misma que la superior
  const canBottomBeeAppear = hasTriggered && isTopBeeHidden;

  return (
    <div className="relative bg-nounYellow w-full overflow-hidden">
      {/* Patrón de fondo */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='100' viewBox='0 0 56 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 66 L0 50 L0 16 L28 0 L56 16 L56 50 L28 66 L28 100' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E")`, backgroundSize: '56px 100px' }}>
      </div>

      {/* SECCIÓN 1: CUBOS 3D (CABECERA IMPACTO) */}
      <section className="relative z-20 border-b-8 border-black shadow-2xl overflow-hidden bg-white">
        {/* CABECERA DE CONTEXTO (SOLUCIÓN PUNTO 1) */}
        <div className="bg-black text-white py-12 px-4 text-center border-b-4 border-black">
          <h1 className="text-5xl md:text-8xl font-black pixel-font mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
            {t('hero.exchange')}
          </h1>
          <p className="text-xl md:text-3xl font-bold uppercase tracking-widest text-amber-400">
            {t('hero.exchangeSub')}
          </p>
          <p className="max-w-2xl mx-auto mt-6 text-sm md:text-lg font-medium opacity-80 leading-tight">
            {t('hero.exchangeDesc')}
          </p>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
          .perspective-container { perspective: 2000px; }
          .cube-side { 
            transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform-style: preserve-3d;
            position: relative;
            width: 100%;
            height: 100%;
          }
          .cube-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .face-front { z-index: 2; border-x: 4px solid black; }
          .face-back { 
            transform: rotateY(180deg);
            z-index: 1;
            border-x: 4px solid black;
          }
          .side-wrapper:hover .cube-side {
            transform: rotateY(180deg);
          }
        ` }} />

        <div className="flex flex-col md:flex-row h-[500px] md:h-[650px] w-full border-black">
          {/* LADO BEE */}
          <div className="side-wrapper flex-1 perspective-container cursor-help border-r-0 md:border-r-4 border-black">
            <div className="cube-side">
              <div className="cube-face face-front bg-amber-400 p-8 md:p-16">
                <h2 className="text-8xl md:text-[14rem] font-black pixel-font text-black animate-float tracking-tighter leading-none">BEE</h2>
              </div>
              <div className="cube-face face-back bg-white p-8 md:p-16 text-center">
                <div className="max-w-3xl px-4">
                  <h4 className="text-3xl md:text-5xl font-black uppercase mb-8 border-b-8 border-amber-500 pb-4 inline-block">{t('hero.guardianTitle')}</h4>
                  <p className="text-xl md:text-4xl font-bold leading-tight italic mb-8">
                    "{t('hero.guardianText')}"
                  </p>
                  <div className="flex flex-wrap justify-center gap-6">
                    <span className="bg-amber-100 border-4 border-black px-6 py-2 font-black text-lg uppercase">#Naturaleza</span>
                    <span className="bg-amber-100 border-4 border-black px-6 py-2 font-black text-lg uppercase">#Futuro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LADO NOUNS */}
          <div className="side-wrapper flex-1 perspective-container cursor-help border-l-0 md:border-l-4 border-black">
            <div className="cube-side">
              <div className="cube-face face-front bg-nounRed p-8 md:p-16 overflow-hidden">
                <h2 className="text-7xl md:text-[11rem] font-black pixel-font text-black tracking-tighter w-full text-center leading-none">NOUNS</h2>
              </div>
              <div className="cube-face face-back bg-white p-8 md:p-16 text-center">
                <div className="max-w-3xl px-4">
                  <h4 className="text-3xl md:text-5xl font-black uppercase mb-8 border-b-8 border-nounRed pb-4 inline-block">{t('hero.communityTitle')}</h4>
                  <p className="text-xl md:text-4xl font-bold leading-tight italic mb-8">
                    "{t('hero.communityText')}"
                  </p>
                  <div className="flex flex-wrap justify-center gap-6">
                    <span className="bg-red-50 border-4 border-black px-6 py-2 font-black text-lg uppercase">#OpenSource</span>
                    <span className="bg-red-50 border-4 border-black px-6 py-2 font-black text-lg uppercase">#Web3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INDICADOR DE SCROLL EXPERTO */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center gap-2">
          <span className="bg-white border-2 border-black px-4 py-1 font-black text-[10px] uppercase shadow-hard-sm animate-bounce">
            {t('hero.discoverExchange')}
          </span>
          <ArrowDown size={20} className="text-black animate-bounce" />
        </div>
      </section>

      {/* SECCIÓN 2: HERO - VALOR Y ACCIÓN */}
      <section className="min-h-screen flex flex-col items-center justify-center p-4 pb-40 relative z-10 text-center">
        {/* ABEJA VIAJERA (SUPERIOR) */}
        <div
          className={`flex justify-center mb-12 z-0 transition-opacity duration-200 ${isTopBeeHidden ? 'opacity-0' : 'opacity-100'}`}
          style={{
            transform: `translate(${heroTx}px, ${heroTy}px) scale(${heroScale}) rotate(${heroRotate}deg)`,
            transition: 'transform 0.05s linear, opacity 0.3s ease-in-out'
          }}
        >
          <div className="animate-float">
            <NounsBee className="w-48 md:w-64 h-auto drop-shadow-2xl" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <div className="inline-block transform rotate-1 mb-12 relative z-10 scale-125">
            <p className="text-2xl md:text-4xl font-black bg-white border-4 border-black p-6 shadow-hard-lg">
              {t('hero.heroBadge')}
            </p>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-hard max-w-2xl mx-auto mb-12 relative z-10">
            <p className="text-lg md:text-xl font-bold leading-relaxed">
              {t('hero.heroTrust')}
            </p>
          </div>

          <Button onClick={onStart} className="text-2xl animate-pulse relative z-10">
            {t('hero.ctaMain')}
          </Button>

          <div className="absolute bottom-10 animate-bounce text-black/30">
            <ArrowDown size={48} />
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: VOCES Y CIERRE */}
      <section className="py-24 relative z-20 border-t-8 border-black bg-nounYellow">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase pixel-font mb-4">{t('hero.voicesTitle')}</h2>
            <p className="text-xl font-bold">{t('hero.voicesSub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-32">
            {interviews.map((interview: any, index: number) => (
              <BlockCard key={index} className="bg-white flex flex-col relative h-full">
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 border-4 border-black ${interview.color} shadow-hard-sm flex items-center justify-center`}>
                  <Quote size={20} className="text-white fill-current" />
                </div>
                <div className="pt-8 flex-grow flex flex-col justify-between">
                  <p className="text-lg font-medium italic mb-6">"{interview.quote}"</p>
                  <div className="border-t-2 border-black pt-4">
                    <p className="font-black uppercase text-lg">{interview.name}</p>
                    <p className="text-sm font-bold text-gray-600">{interview.role}</p>
                  </div>
                </div>
              </BlockCard>
            ))}
          </div>

          {/* PUNTO DE REAPARICIÓN */}
          <div ref={triggerRef} className="relative flex flex-col items-center justify-center w-full min-h-[350px]">
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 w-full">
              <div className="z-20">
                <Button onClick={onStart} variant="secondary" className="hover:scale-105 active:scale-95 text-xl px-12">
                  {t('hero.ctaFinal')}
                </Button>
              </div>

              <div className={`
                relative w-40 h-44 flex flex-col items-center justify-center
                md:absolute md:left-[calc(50%+280px)]
                ${canBottomBeeAppear ? 'animate-cell-pop' : 'opacity-0 scale-0'}
              `}>
                <div className={`
                  absolute -top-14 left-1/2 -translate-x-1/2 
                  bg-white border-4 border-black px-4 py-2 
                  whitespace-nowrap z-30 shadow-hard-sm
                  ${canBottomBeeAppear ? 'animate-bubble-pop' : 'opacity-0'}
                `}>
                  <p className="pixel-font text-[10px] md:text-xs font-black">bzzz vamos!</p>
                  <div className="speech-bubble-tail"></div>
                </div>

                <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                  <polygon
                    points="50 0, 100 25, 100 75, 50 100, 0 75, 0 25"
                    fill="#FBBF24"
                    stroke="black"
                    strokeWidth="4"
                  />
                </svg>

                <div className={`z-10 ${canBottomBeeAppear ? 'animate-bee-emerge' : 'opacity-0'}`}>
                  <div className="animate-float">
                    <NounsBee className="w-28 h-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
