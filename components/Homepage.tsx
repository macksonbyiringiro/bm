
import React from 'react';
import { LanguageCode, supportedLanguages } from '../translations';
import { AssistantIcon, LanguageIcon, ImageIcon, SettingsIcon } from './IconComponents';

interface HomepageProps {
    onStart: () => void;
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    t: (key: string) => string;
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex flex-col items-center p-6 bg-white/5 dark:bg-slate-800/50 rounded-2xl backdrop-blur-lg border border-white/10">
        <div className="mb-4 text-teal-400">
            {icon}
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
        <p className="text-slate-300 text-center">{description}</p>
    </div>
);

export const Homepage: React.FC<HomepageProps> = ({ onStart, language, setLanguage, t }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-b from-slate-900 to-sky-900 text-white">
        {/* Background Gradients */}
        <div className="absolute top-0 -left-12 w-96 h-96 bg-cyan-500/30 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 -right-12 w-96 h-96 bg-violet-600/30 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-600/30 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="absolute top-6 right-6 z-20">
            <div className="relative">
                <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                    className="bg-white/10 border border-white/20 rounded-md py-2 pl-3 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none"
                    aria-label={t('homepage.language')}
                >
                    {Object.entries(supportedLanguages).map(([code, name]) => (
                        <option key={code} value={code} className="bg-slate-800 text-white">
                            {name}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-300">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
        </div>

        <main className="z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="mb-6">
                <AssistantIcon className="w-24 h-24 text-teal-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400">
                {t('homepage.title')}
            </h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-slate-300">
                {t('homepage.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full">
                <FeatureCard 
                    icon={<LanguageIcon className="w-12 h-12"/>}
                    title={t('homepage.feature1.title')}
                    description={t('homepage.feature1.description')}
                />
                <FeatureCard 
                    icon={<ImageIcon className="w-12 h-12"/>}
                    title={t('homepage.feature2.title')}
                    description={t('homepage.feature2.description')}
                />
                <FeatureCard 
                    icon={<SettingsIcon className="w-12 h-12"/>}
                    title={t('homepage.feature3.title')}
                    description={t('homepage.feature3.description')}
                />
            </div>

            <button
                onClick={onStart}
                className="mt-16 px-12 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg rounded-full shadow-lg shadow-teal-500/30 transform transition-all duration-300 hover:scale-105"
            >
                {t('homepage.cta')}
            </button>
        </main>
    </div>
  );
};

// Add some simple animation styles to index.html if they don't exist
// This is not a file change, but a recommendation. The developer should add this to their CSS.
/*
@keyframes blob {
	0% {
		transform: translate(0px, 0px) scale(1);
	}
	33% {
		transform: translate(30px, -50px) scale(1.1);
	}
	66% {
		transform: translate(-20px, 20px) scale(0.9);
	}
	100% {
		transform: translate(0px, 0px) scale(1);
	}
}
.animate-blob {
    animation: blob 7s infinite;
}
.animation-delay-2000 {
    animation-delay: 2s;
}
.animation-delay-4000 {
    animation-delay: 4s;
}
*/