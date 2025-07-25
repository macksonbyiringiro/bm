
import React, { useRef } from 'react';
import { CloseIcon, SoundOnIcon, UserIcon, PencilIcon } from './IconComponents';
import { LanguageCode, supportedLanguages } from '../translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  volume: number;
  setVolume: (volume: number) => void;
  chatBackground: string;
  setChatBackground: (bg: string) => void;
  profilePicture: string | null;
  setProfilePicture: (pic: string | null) => void;
  onResetPin: () => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
  volume,
  setVolume,
  chatBackground,
  setChatBackground,
  profilePicture,
  setProfilePicture,
  onResetPin,
  language,
  setLanguage,
  t,
}) => {
  if (!isOpen) return null;
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const backgroundOptions = [
    { name: t('settings.backgroundDefault'), class: 'bg-white dark:bg-slate-800' },
    { name: t('settings.backgroundOcean'), class: 'bg-gradient-to-br from-sky-50 to-teal-100 dark:from-sky-900/50 dark:to-teal-900/50' },
    { name: t('settings.backgroundSunset'), class: 'bg-gradient-to-br from-orange-50 to-rose-100 dark:from-orange-900/50 dark:to-rose-900/50' },
    { name: t('settings.backgroundMint'), class: 'bg-gradient-to-br from-green-50 to-cyan-100 dark:from-green-900/50 dark:to-cyan-900/50' },
  ];

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          try {
              const dataUrl = await fileToDataUrl(e.target.files[0]);
              setProfilePicture(dataUrl);
          } catch (error) {
              console.error("Failed to read file", error);
              alert(t('settings.fileReadError'));
          }
      }
  };


  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 text-slate-900 dark:text-slate-100 animate-scale-in" style={{animationDuration: '0.3s'}} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('settings.title')}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 -mr-2">
            {/* Profile Picture Settings */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">{t('settings.profilePictureTitle')}</h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-slate-700" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <UserIcon className="w-10 h-10 text-slate-500" />
                    </div>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleProfilePictureChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="absolute bottom-0 right-0 bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full shadow-md transition-transform transform hover:scale-110"
                    aria-label={t('settings.profilePictureEditLabel')}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-700 dark:text-slate-300">{t('settings.profilePictureDescription')}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.profilePictureSubdescription')}</p>
                </div>
              </div>
            </div>

            {/* Theme Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('settings.themeTitle')}</h3>
              <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700/50 p-2 rounded-lg">
                <span className="font-medium text-slate-700 dark:text-slate-300">{t('settings.themeLabel')}</span>
                <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-900/70 p-1 rounded-md">
                  <button onClick={() => setTheme('light')} className={`px-4 py-1 rounded-md text-sm font-medium ${theme === 'light' ? 'bg-white shadow-sm dark:bg-slate-600' : 'text-slate-600 dark:text-slate-300'}`}>{t('settings.themeLight')}</button>
                  <button onClick={() => setTheme('dark')} className={`px-4 py-1 rounded-md text-sm font-medium ${theme === 'dark' ? 'bg-white shadow-sm dark:bg-slate-600' : 'text-slate-600 dark:text-slate-300'}`}>{t('settings.themeDark')}</button>
                </div>
              </div>
            </div>

            {/* Language Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('settings.languageTitle')}</h3>
              <div className="flex flex-col space-y-2 bg-slate-100 dark:bg-slate-700/50 p-2 rounded-lg">
                  {Object.entries(supportedLanguages).map(([code, name]) => (
                      <button 
                          key={code} 
                          onClick={() => setLanguage(code as LanguageCode)}
                          className={`w-full text-left px-3 py-2 font-medium rounded-md transition-colors text-slate-700 dark:text-slate-300 ${
                              language === code 
                              ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200' 
                              : 'hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                      >
                          {name}
                      </button>
                  ))}
              </div>
            </div>

            {/* Sound Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('settings.soundTitle')}</h3>
              <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                <SoundOnIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>
            </div>

            {/* Background Settings */}
            <div>
                <h3 className="text-lg font-semibold mb-3">{t('settings.backgroundTitle')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {backgroundOptions.map((bg) => (
                        <button key={bg.name} onClick={() => setChatBackground(bg.class)} className={`p-2 rounded-lg text-center border-2 transition-colors ${chatBackground === bg.class ? 'border-teal-500' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'}`}>
                          <div className={`w-full h-12 rounded-md mb-2 border border-black/10 ${bg.class.split(' ').join(' ')}`}></div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{bg.name}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Security Settings */}
            <div>
                <h3 className="text-lg font-semibold mb-3">{t('settings.securityTitle')}</h3>
                <div className="bg-slate-100 dark:bg-slate-700/50 p-2 rounded-lg">
                    <button onClick={onResetPin} className="w-full text-left px-3 py-2 text-teal-600 dark:text-teal-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors">
                        {t('settings.securityChangePin')}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};