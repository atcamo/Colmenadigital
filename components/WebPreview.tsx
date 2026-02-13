
import React, { useState, useEffect, useRef } from 'react';
import { GeneratedWebProfile, BeekeeperInput } from '../types';
import { BlockCard } from './BlockCard';
import { Button } from './Button';
import {
    Edit2, Save, RotateCcw, Share2,
    Globe, Sparkles, Smartphone, Monitor,
    CheckCircle2, TrendingUp, Target, ShieldCheck
} from 'lucide-react';
import { profileService } from '../services/profileService';
import { User } from '@supabase/supabase-js';
import { PremiumWebTemplate } from './PremiumWebTemplate';
import { storageService } from '../services/storageService';
import { useTranslation } from '../context/LanguageContext';

interface Props {
    profile: GeneratedWebProfile;
    inputData: BeekeeperInput;
    onEditInputs: () => void;
    onUpdateProfile: (p: GeneratedWebProfile) => void;
    onResetProfile: () => void;
    onLogin: () => void;
    isModified: boolean;
    user: User | null;
}

export const WebPreview: React.FC<Props> = ({
    profile, inputData, onUpdateProfile, onResetProfile, isModified, user, onLogin
}) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [tempProfile, setTempProfile] = useState<GeneratedWebProfile>(profile);
    const heroInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setTempProfile(profile); }, [profile]);

    const handleSave = () => { onUpdateProfile(tempProfile); setIsEditing(false); };

    const handleChange = (field: keyof GeneratedWebProfile, value: any) => {
        setTempProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Generar URL para visualización inmediata
            const blobUrl = URL.createObjectURL(file);
            handleChange('heroImage', blobUrl);

            // Subida en segundo plano si hay usuario
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result as string;
                if (user) {
                    const publicUrl = await storageService.uploadImage(user.id, 'profiles', 'hero.png', base64);
                    if (publicUrl) {
                        handleChange('heroImage', publicUrl);
                        URL.revokeObjectURL(blobUrl); // Limpiar memoria
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const filesArray = Array.from(files) as File[];
            const tempUrls = filesArray.map(f => URL.createObjectURL(f));

            // Visualización instantánea con Blobs
            setTempProfile(prev => ({
                ...prev,
                galleryImages: [...(prev.galleryImages || []), ...tempUrls]
            }));

            // Procesamiento en segundo plano (Base64 / Storage)
            for (let i = 0; i < filesArray.length; i++) {
                const file = filesArray[i];
                const blobUrl = tempUrls[i];

                const reader = new FileReader();
                const base64 = await new Promise<string>((resolve) => {
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });

                if (user) {
                    const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
                    const publicUrl = await storageService.uploadImage(user.id, 'profiles', fileName, base64);
                    if (publicUrl) {
                        // Reemplazar el Blob por la URL definitiva
                        setTempProfile(prev => ({
                            ...prev,
                            galleryImages: prev.galleryImages?.map(img => img === blobUrl ? publicUrl : img)
                        }));
                        URL.revokeObjectURL(blobUrl);
                    }
                }
            }
        }
    };

    const removeGalleryImage = (index: number) => {
        setTempProfile(prev => ({
            ...prev,
            galleryImages: prev.galleryImages?.filter((_, i) => i !== index)
        }));
    };

    const cleanHandle = profile.farcasterHandle.startsWith('@')
        ? profile.farcasterHandle.substring(1)
        : profile.farcasterHandle;

    const copyToClipboard = () => {
        const url = `${inputData.farmName.toLowerCase().replace(/\s/g, '')}.beenouns.cc`;
        navigator.clipboard.writeText(url);
        alert(t('preview.linkCopied'));
    };

    return (
        <div className="min-h-screen bg-nounOffWhite py-8 px-4 font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* COLUMNA IZQUIERDA: VISTA PREVIA WEB */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between bg-white border-4 border-black p-4 shadow-hard-sm gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-black text-white px-3 py-1 font-bold text-xs uppercase pixel-font">
                                {isEditing ? t('preview.modeEditor') : t('preview.modePreview')}
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-lg border-2 border-black">
                                <button
                                    onClick={() => setViewMode('desktop')}
                                    className={`p-2 transition-all ${viewMode === 'desktop' ? 'bg-nounYellow shadow-sm' : 'hover:bg-gray-200'}`}
                                >
                                    <Monitor size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('mobile')}
                                    className={`p-2 transition-all ${viewMode === 'mobile' ? 'bg-nounYellow shadow-sm' : 'hover:bg-gray-200'}`}
                                >
                                    <Smartphone size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <button onClick={handleSave} className="flex items-center gap-2 bg-nounRed text-white px-4 py-2 font-bold border-2 border-black shadow-sm hover:bg-red-600 transition-colors"><Save size={18} /> {t('common.save')}</button>
                            ) : (
                                <>
                                    {isModified && <button onClick={onResetProfile} className="flex items-center gap-2 px-3 py-2 font-bold text-xs uppercase text-gray-400 hover:text-black transition-colors"><RotateCcw size={16} /> {t('preview.original')}</button>}
                                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-nounYellow px-4 py-2 font-bold border-2 border-black shadow-sm hover:translate-y-[-2px] transition-all"><Edit2 size={18} /> {t('preview.editWeb')}</button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className={`border-4 border-black bg-white shadow-hard relative flex flex-col min-h-[800px] overflow-hidden transition-all duration-500`}>
                        {/* Browser Header Mockup */}
                        <div className="bg-gray-100 border-b-2 border-black p-3 flex items-center gap-2 text-xs text-gray-500">
                            <div className="flex gap-1.5 ml-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400 border border-black/10"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black/10"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400 border border-black/10"></div>
                            </div>
                            <div className="ml-4 bg-white border-2 border-black px-3 py-1 flex-1 text-center font-bold text-black overflow-hidden truncate">
                                {inputData.farmName.toLowerCase().replace(/\s/g, '')}.beenouns.cc
                            </div>
                        </div>

                        <PremiumWebTemplate
                            profile={profile}
                            inputData={inputData}
                            isEditing={isEditing}
                            tempProfile={tempProfile}
                            heroInputRef={heroInputRef}
                            galleryInputRef={galleryInputRef}
                            onHeroUpload={handleHeroUpload}
                            onGalleryUpload={handleGalleryUpload}
                            onFieldChange={handleChange}
                            onRemoveGalleryImage={removeGalleryImage}
                            isMobileView={viewMode === 'mobile'}
                        />
                    </div>
                </div>

                {/* COLUMNA DERECHA: ESTRATEGIA E IDENTIDAD */}
                <div className="lg:col-span-4 space-y-6">

                    {/* BLOQUE DE ESTRATEGIA (MEJORADO) */}
                    <BlockCard className="bg-white border-black border-4 overflow-hidden">
                        <div className="bg-nounYellow px-4 py-2 border-b-4 border-black flex items-center gap-2">
                            <TrendingUp size={16} className="text-black" />
                            <h3 className="text-xs font-black uppercase pixel-font tracking-tighter">{t('preview.growthPlan')}</h3>
                        </div>
                        <div className="p-4 space-y-6">
                            <div className="flex gap-4">
                                <div className="mt-1 bg-green-100 p-2 rounded-lg text-green-700">
                                    <Target size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">{t('preview.competitiveAdvantage')}</p>
                                    <p className="text-sm font-bold leading-relaxed text-stone-700 italic">
                                        "{profile.strategicAnalysis}"
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 p-3 border-2 border-black shadow-sm">
                                    <CheckCircle2 size={16} className="text-nounBlue mb-2" />
                                    <p className="text-[9px] font-black uppercase mb-1">Propuesta</p>
                                    <p className="text-[10px] font-bold text-gray-600">Venta Directa</p>
                                </div>
                                <div className="bg-gray-50 p-3 border-2 border-black shadow-sm">
                                    <ShieldCheck size={16} className="text-nounRed mb-2" />
                                    <p className="text-[9px] font-black uppercase mb-1">Garantía</p>
                                    <p className="text-[10px] font-bold text-gray-600">Sello de Calidad</p>
                                </div>
                            </div>
                        </div>
                    </BlockCard>

                    {/* NUEVO: BLOQUE "VER EN TU MÓVIL" (CONFIDENCIA) */}
                    <BlockCard className="bg-white border-black border-4 p-6 flex flex-col items-center text-center">
                        <Smartphone size={32} className="text-nounBlue mb-4" />
                        <h3 className="text-xs font-black uppercase pixel-font mb-2">{t('preview.viewOnMobile')}</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase leading-tight mb-6">
                            {t('preview.qrHint')}
                        </p>

                        {/* Simulación de QR Code Brutalista */}
                        <div className="w-32 h-32 border-4 border-black p-2 bg-white mb-6 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                            <div className="grid grid-cols-4 grid-rows-4 h-full w-full gap-1">
                                {[...Array(16)].map((_, i) => (
                                    <div key={i} className={`border border-black/10 ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`}></div>
                                ))}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-white border-2 border-black px-2 py-1 font-black text-[8px] uppercase">qr-sim</span>
                            </div>
                        </div>

                        <button
                            onClick={copyToClipboard}
                            className="text-[9px] font-black uppercase underline hover:text-nounBlue transition-colors"
                        >
                            {t('preview.copyLink')}
                        </button>
                    </BlockCard>

                    {/* BLOQUE DE ACCIÓN FINAL (STICKY-LIKE) */}
                    <div className="sticky bottom-6 z-30">
                        <BlockCard className="bg-nounYellow border-4 border-black shadow-hard-lg scale-105">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles size={16} className="animate-pulse" />
                                <h3 className="text-lg font-black uppercase pixel-font tracking-tighter">{t('preview.readyToLaunch')}</h3>
                            </div>
                            <p className="mb-6 text-[10px] font-bold leading-tight uppercase">
                                {user
                                    ? t('preview.browserBadge')
                                    : t('preview.browserBadgeAuth')}
                            </p>
                            <div className="space-y-3">
                                <Button
                                    fullWidth
                                    onClick={async () => {
                                        if (!user) {
                                            onLogin();
                                        } else {
                                            try {
                                                await profileService.saveProfile(user.id, profile, inputData);
                                                alert(t('preview.publishSuccess'));
                                            } catch (err: any) {
                                                alert("Error: " + err.message);
                                            }
                                        }
                                    }}
                                    className="text-sm py-5 shadow-hard-sm hover:shadow-hard transition-all font-black"
                                >
                                    {user ? t('preview.saveChanges').toUpperCase() : t('preview.publicPage').toUpperCase()}
                                </Button>
                                {!isEditing && (
                                    <button
                                        onClick={copyToClipboard}
                                        className="w-full py-3 bg-white border-4 border-black font-black text-[10px] uppercase flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                                    >
                                        <Globe size={14} /> {t('preview.publicLink')}
                                    </button>
                                )}
                            </div>
                        </BlockCard>
                    </div>
                </div>
            </div>
        </div>
    );
};
