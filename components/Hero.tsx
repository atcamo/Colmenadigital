
import React, { useEffect, useState, useRef } from 'react';
import { NounsBee } from './NounsBee';
import { Button } from './Button';
import { ArrowDown, Quote } from 'lucide-react';
import { BlockCard } from './BlockCard';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const [scrollY, setScrollY] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);
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

  const interviews = [
    { name: "María G.", role: "Apicultora en Biobío", quote: "Antes gastaba días explicando por qué mi miel es pura. Ahora la web muestra la trazabilidad y los clientes pagan felices.", color: "bg-nounBlue" },
    { name: "Jorge L.", role: "Mieles del Sur", quote: "Los bancos no me daban crédito. Con el registro de ventas en blockchain de BeeNouns, pude demostrar mis ingresos.", color: "bg-green-400" },
    { name: "Familia R.", role: "3ra Generación", quote: "BeeNouns nos hizo la página profesional en lo que tardamos en tomarnos un mate.", color: "bg-nounRed" }
  ];

  // La abeja superior baja más rápido que el scroll para dar efecto de "buceo"
  const heroTx = scrollY * 0.15; 
  const heroTy = scrollY * 1.5; // Multiplicador alto para que baje y se esconda
  const heroRotate = scrollY * 0.08;
  const heroScale = 1 - (scrollY * 0.001);
  
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

      {/* SECCIÓN HERO - CAPA INFERIOR (z-10) */}
      <section className="min-h-screen flex flex-col items-center justify-center p-4 pb-40 relative z-10 text-center">
        {/* ABEJA VIAJERA (SUPERIOR) */}
        <div 
          className={`flex justify-center mb-6 z-0 transition-opacity duration-200 ${isTopBeeHidden ? 'opacity-0' : 'opacity-100'}`}
          style={{ 
            transform: `translate(${heroTx}px, ${heroTy}px) scale(${heroScale}) rotate(${heroRotate}deg)`,
            transition: 'transform 0.05s linear, opacity 0.3s ease-in-out'
          }}
        >
          <div className="animate-float">
            <NounsBee className="w-48 md:w-64 h-auto drop-shadow-2xl" />
          </div>
        </div>

        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4 pixel-font relative z-10">
          Bee<span className="text-nounRed">Nouns</span>
        </h1>
        
        <div className="inline-block transform rotate-1 mb-8 relative z-10">
            <p className="text-xl md:text-3xl font-bold bg-white border-4 border-black p-4 shadow-hard">
            TU MIEL. TU WEB. GRATIS.
            </p>
        </div>
        
        <div className="bg-white border-4 border-black p-6 shadow-hard max-w-2xl mx-auto mb-8 relative z-10">
            <p className="text-lg md:text-xl font-bold leading-relaxed">
              Los apicultores desconfían de la tecnología. Nosotros confiamos en ti. Intercambiamos una Página Web Profesional por 5 minutos de tu tiempo.
            </p>
        </div>

        <Button onClick={onStart} className="text-2xl animate-pulse relative z-10">
            COMENZAR EL INTERCAMBIO
        </Button>

        <div className="absolute bottom-10 animate-bounce text-black/30">
            <ArrowDown size={48} />
        </div>
      </section>

      {/* SECCIÓN AMARILLA - CAPA SUPERIOR (z-20) */}
      <section className="py-24 px-4 relative z-20 border-t-4 border-black bg-nounYellow shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black uppercase pixel-font mb-4">Voces de la Colmena</h2>
                <p className="text-xl font-bold">Historias reales de apicultores que ya dieron el salto.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-32">
                {interviews.map((interview, index) => (
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
                    
                    {/* Botón Centrado */}
                    <div className="z-20">
                      <Button onClick={onStart} variant="secondary" className="hover:scale-105 active:scale-95 text-xl px-12">
                          QUIERO MI WEB AHORA
                      </Button>
                    </div>

                    {/* La Celda y la Abeja Inferior - Posicionada más a la derecha */}
                    <div className={`
                      relative w-40 h-44 flex flex-col items-center justify-center
                      md:absolute md:left-[calc(50%+280px)]
                      ${canBottomBeeAppear ? 'animate-cell-pop' : 'opacity-0 scale-0'}
                    `}>
                        {/* GLOBO DE TEXTO (Ahora más cerca de la abeja) */}
                        <div className={`
                            absolute -top-14 left-1/2 -translate-x-1/2 
                            bg-white border-4 border-black px-4 py-2 
                            whitespace-nowrap z-30 shadow-hard-sm
                            ${canBottomBeeAppear ? 'animate-bubble-pop' : 'opacity-0'}
                        `}>
                            <p className="pixel-font text-[10px] md:text-xs font-black">bzzz vamos!</p>
                            <div className="speech-bubble-tail"></div>
                        </div>

                        {/* Hexágono Ámbar */}
                        <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                            <polygon 
                                points="50 0, 100 25, 100 75, 50 100, 0 75, 0 25" 
                                fill="#FBBF24" 
                                stroke="black" 
                                strokeWidth="4"
                            />
                        </svg>
                        
                        {/* REAPARICIÓN DE LA MISMA ABEJA */}
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
