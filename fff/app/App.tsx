
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse, Part } from "@google/genai";
import type { Message } from './types';
import {
  LockIcon,
  MicrophoneIcon,
  SoundOnIcon,
  SoundOffIcon,
  SendIcon,
  UserIcon,
  AssistantIcon,
  SpinnerIcon,
  DeleteIcon,
  SettingsIcon,
  ImageIcon,
  CloseIcon,
} from './components/IconComponents';
import { SettingsModal } from './components/SettingsModal';
import { Homepage } from './components/Homepage';
import { translations, supportedLanguages, LanguageCode } from './translations';


// Add this to solve TypeScript errors for vendor-prefixed APIs
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const [header, data] = result.split(',');
            const mimeType = header.match(/:(.*?);/)?.[1] || file.type;
            resolve({ mimeType, data });
        };
        reader.onerror = (error) => reject(error);
    });
};


// Speech Recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition: any;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}

const AuthFlow = ({ storedPin, onPinSet, onUnlock, t }: { storedPin: string | null, onPinSet: (pin: string) => void, onUnlock: () => void, t: (key: string) => string }) => {
    const [mode, setMode] = useState<'create' | 'confirm' | 'unlock'>(storedPin ? 'unlock' : 'create');
    const [pin, setPin] = useState("");
    const [tempPin, setTempPin] = useState("");
    const [error, setError] = useState<string | false>(false);

    const titleMap: Record<typeof mode, string> = {
        create: t('createPin.title'),
        confirm: t('confirmPin.title'),
        unlock: t('unlock.title')
    };
    const subtitleMap: Record<typeof mode, string> = {
        create: t('createPin.subtitle'),
        confirm: t('confirmPin.subtitle'),
        unlock: t('unlock.subtitle')
    };

    useEffect(() => {
        if (pin.length === 4) {
            switch(mode) {
                case 'create':
                    setTempPin(pin);
                    setMode('confirm');
                    setPin("");
                    break;
                case 'confirm':
                    if (pin === tempPin) {
                        onPinSet(pin);
                    } else {
                        setError(t('confirmPin.error'));
                        setPin("");
                        setTimeout(() => {
                            setError(false);
                            setMode('create');
                            setTempPin("");
                        }, 1500);
                    }
                    break;
                case 'unlock':
                    if (pin === storedPin) {
                        onUnlock();
                    } else {
                        setError(t('unlock.error'));
                        setTimeout(() => {
                            setError(false);
                            setPin("");
                        }, 800);
                    }
                    break;
            }
        }
    }, [pin, mode, storedPin, tempPin, onPinSet, onUnlock, t]);

    const handleKeyClick = (key: string) => {
        if (pin.length < 4) {
            setPin(pin + key);
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    const PinDots = () => (
        <div className={`flex space-x-4 mb-6 ${error ? 'shake' : ''}`}>
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 transition-colors ${pin.length > i ? 'bg-teal-500 border-teal-500 dark:bg-teal-400 dark:border-teal-400 pin-dot-filled' : 'border-slate-400 dark:border-slate-500'}`}
                ></div>
            ))}
        </div>
    );

    const Keypad = () => {
        const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];
        return (
            <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                {keys.map((key) =>
                    key === "" ? (
                        <div key={key}></div>
                    ) : (
                        <button
                            key={key}
                            onClick={() => (key === "del" ? handleDelete() : handleKeyClick(key))}
                            className="pin-key text-2xl font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full aspect-square flex items-center justify-center"
                            aria-label={key === 'del' ? t('delete.label') : t('number.label').replace('{key}', key)}
                        >
                            {key === "del" ? <DeleteIcon className="w-8 h-8" /> : key}
                        </button>
                    )
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
            <LockIcon className="w-12 h-12 mb-4 text-teal-500 dark:text-teal-400" />
            <h1 className="text-2xl font-bold mb-2">{titleMap[mode]}</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6">{subtitleMap[mode]}</p>
            <PinDots />
            {error && <p className="text-red-500 mb-4 text-sm min-h-[20px]">{error}</p>}
            {!error && <div className="mb-4 min-h-[20px]"></div>}
            <Keypad />
        </div>
    );
};

const ChatScreen = ({settings, t}) => {
  const { isSoundOn, setIsSoundOn, volume, chatBackground, openSettings, profilePicture, language } = settings;
  const [messages, setMessages] = useState<Message[]>([
      { id: 'welcome-1', role: 'assistant', text: t('chat.welcomeMessage') }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [imageForUpload, setImageForUpload] = useState<{ file: File, preview: string } | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  
  const langToSpeechCode: Record<LanguageCode, string> = { rw: 'rw-RW', en: 'en-US', fr: 'fr-FR' };

  useEffect(() => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: t('system.instruction'),
            }
        });
        // Reset welcome message if language changes
        setMessages([{ id: 'welcome-1', role: 'assistant', text: t('chat.welcomeMessage') }]);
    } catch (e) {
        console.error("Failed to initialize AI:", e);
        setMessages(prev => [...prev, {id: 'error-1', role: 'assistant', text: t('chat.initError')}])
    }
  }, [t]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const speak = (text: string) => {
    if (!isSoundOn || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langToSpeechCode[language];
    utterance.volume = volume;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };
  
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && !isLoading) {
        speak(lastMessage.text);
    }
  }, [messages, isSoundOn, volume, isLoading, language]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if ((!trimmedInput && !imageForUpload) || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: trimmedInput, image: imageForUpload?.preview };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setImageForUpload(null);
    setIsLoading(true);

    try {
        if (!chatRef.current) throw new Error("Chat not initialized.");

        let messagePayload: string | Part[];

        if (imageForUpload) {
            const { mimeType, data } = await fileToBase64(imageForUpload.file);
            const imagePart: Part = { inlineData: { mimeType, data } };
            const textPart: Part = { text: trimmedInput };
            messagePayload = [textPart, imagePart];
        } else {
            messagePayload = trimmedInput;
        }
        
        const response: GenerateContentResponse = await chatRef.current.sendMessage({ message: messagePayload });
        const assistantMessage: Message = { id: Date.now().toString() + '-ai', role: 'assistant', text: response.text };
        setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
        console.error("Gemini API error:", error);
        const errorMessage: Message = {id: Date.now().toString() + '-err', role: 'assistant', text: t('chat.geminiError') };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleListen = () => {
    if (!recognition) {
        alert(t('chat.speechRecognitionNotSupported'));
        return;
    }
    if (isListening) {
        recognition.stop();
        setIsListening(false);
        return;
    }
    recognition.lang = langToSpeechCode[language];
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
    };
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        if(transcript) setTimeout(() => handleSend(), 100);
    };
    recognition.start();
  };
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageForUpload({ file, preview: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-800 transition-colors duration-300">
      <header className="flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm shadow-md border-b border-slate-200 dark:border-slate-700 z-10">
        <h1 className="text-xl font-bold text-teal-600 dark:text-teal-400">{t('chat.header')}</h1>
        <div className="flex items-center gap-2">
            <button onClick={() => setIsSoundOn(!isSoundOn)} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
              {isSoundOn ? <SoundOnIcon /> : <SoundOffIcon />}
            </button>
            <button onClick={openSettings} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
              <SettingsIcon />
            </button>
        </div>
      </header>

      <main className={`flex-1 overflow-y-auto p-4 space-y-4 ${chatBackground} transition-colors duration-300`}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 max-w-full ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && <div className="p-2 bg-teal-500 rounded-full flex-shrink-0"><AssistantIcon className="w-5 h-5 text-white" /></div>}
            <div className={`max-w-xl p-3 rounded-xl break-words ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
              {msg.image && <img src={msg.image} alt={t('chat.userUploadAlt')} className="rounded-lg mb-2 max-w-xs" />}
              <p>{msg.text}</p>
            </div>
             {msg.role === 'user' && (
                profilePicture ? (
                    <img src={profilePicture} alt={t('chat.profilePictureAlt')} className="w-9 h-9 rounded-full flex-shrink-0 object-cover" />
                ) : (
                    <div className="p-2 bg-slate-600 dark:bg-slate-500 rounded-full flex-shrink-0"><UserIcon className="w-5 h-5 text-white" /></div>
                )
             )}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                <div className="p-2 bg-teal-500 rounded-full"><AssistantIcon className="w-5 h-5 text-white" /></div>
                <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded-xl rounded-bl-none">
                    <SpinnerIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
        {imageForUpload && (
            <div className="relative w-24 h-24 mb-2 p-1 border border-slate-300 dark:border-slate-600 rounded-lg">
                <img src={imageForUpload.preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                <button onClick={() => setImageForUpload(null)} className="absolute -top-2 -right-2 bg-slate-700 text-white rounded-full p-0.5">
                    <CloseIcon className="w-4 h-4"/>
                </button>
            </div>
        )}
        <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-full p-2">
          <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600" disabled={isLoading}>
            <ImageIcon />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chat.placeholder')}
            className="flex-1 bg-transparent px-4 focus:outline-none dark:text-slate-100"
            disabled={isLoading}
          />
          <button onClick={handleListen} className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600" disabled={isLoading}>
            <MicrophoneIcon isListening={isListening} />
          </button>
          <button onClick={handleSend} className="p-2 rounded-full hover:bg-teal-500 bg-teal-600 ml-2 disabled:bg-teal-400 dark:disabled:bg-teal-800 disabled:cursor-not-allowed" disabled={isLoading || (!input.trim() && !imageForUpload)}>
            <SendIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </footer>
    </div>
  );
};


const App = () => {
    const [hasStarted, setHasStarted] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [pin, setPin] = useState<string | null>(() => localStorage.getItem('kunga-pin'));
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Settings State with localStorage persistence
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('kunga-theme') as 'light' | 'dark') || 'dark');
    const [volume, setVolume] = useState<number>(() => parseFloat(localStorage.getItem('kunga-volume') || '1'));
    const [isSoundOn, setIsSoundOn] = useState<boolean>(() => (localStorage.getItem('kunga-sound') || 'true') === 'true');
    const [chatBackground, setChatBackground] = useState<string>(() => localStorage.getItem('kunga-background') || 'bg-white dark:bg-slate-800');
    const [profilePicture, setProfilePicture] = useState<string | null>(() => localStorage.getItem('kunga-profile-picture'));
    const [language, setLanguage] = useState<LanguageCode>(() => {
        const savedLang = localStorage.getItem('kunga-language') as LanguageCode;
        return savedLang && supportedLanguages[savedLang] ? savedLang : 'rw';
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('kunga-theme', theme);
    }, [theme]);

    useEffect(() => { 
      localStorage.setItem('kunga-language', language);
      document.documentElement.lang = language;
    }, [language]);

    useEffect(() => { localStorage.setItem('kunga-volume', volume.toString()); }, [volume]);
    useEffect(() => { localStorage.setItem('kunga-sound', isSoundOn.toString()); }, [isSoundOn]);
    useEffect(() => { localStorage.setItem('kunga-background', chatBackground); }, [chatBackground]);
    useEffect(() => {
        if (profilePicture) {
            localStorage.setItem('kunga-profile-picture', profilePicture);
        } else {
            localStorage.removeItem('kunga-profile-picture');
        }
    }, [profilePicture]);

    const t = (key: string) => {
      return translations[language][key] || translations['en'][key] || key;
    };

    const handlePinSet = (newPin: string) => {
        localStorage.setItem('kunga-pin', newPin);
        setPin(newPin);
        setIsUnlocked(true);
    };

    const handleUnlock = () => {
        setIsUnlocked(true);
    };

    const handleResetPin = () => {
        localStorage.removeItem('kunga-pin');
        setPin(null);
        setIsUnlocked(false);
        setIsSettingsOpen(false); // Close modal
        setHasStarted(false); // Go back to homepage
    };

    const settingsProps = {
        isSoundOn, setIsSoundOn,
        volume, setVolume,
        chatBackground, setChatBackground,
        profilePicture,
        language,
        openSettings: () => setIsSettingsOpen(true)
    };
    
    if (!hasStarted) {
        return <Homepage 
            onStart={() => setHasStarted(true)}
            language={language}
            setLanguage={setLanguage}
            t={t}
        />;
    }

    if (!isUnlocked) {
        return <AuthFlow storedPin={pin} onPinSet={handlePinSet} onUnlock={handleUnlock} t={t} />;
    }

    return (
        <>
            <ChatScreen settings={settingsProps} t={t} />
            <SettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                theme={theme}
                setTheme={setTheme}
                volume={volume}
                setVolume={setVolume}
                chatBackground={chatBackground}
                setChatBackground={setChatBackground}
                profilePicture={profilePicture}
                setProfilePicture={setProfilePicture}
                onResetPin={handleResetPin}
                language={language}
                setLanguage={setLanguage}
                t={t}
            />
        </>
    );
};

export default App;