import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Message, Role, ChatHistory } from './types';
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
} from './components/IconComponents';

// Add this to solve TypeScript errors for vendor-prefixed APIs
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const CORRECT_PIN = "2024";

// Speech Recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition: any;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'rw-RW'; // Set to Kinyarwanda
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}

const PinScreen = ({ onUnlock }: { onUnlock: () => void }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => {
          setError(false);
          setPin("");
        }, 800);
      }
    }
  }, [pin, onUnlock]);

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
          className={`w-4 h-4 rounded-full border-2 ${pin.length > i ? 'bg-indigo-400 border-indigo-400 pin-dot-filled' : 'border-gray-500'}`}
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
              className="pin-key text-2xl font-bold bg-gray-700/50 hover:bg-gray-600/70 rounded-full aspect-square flex items-center justify-center"
              aria-label={key === 'del' ? 'Delete' : `Number ${key}`}
            >
              {key === "del" ? <DeleteIcon className="w-8 h-8" /> : key}
            </button>
          )
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-4">
      <LockIcon className="w-12 h-12 mb-4 text-indigo-400" />
      <h1 className="text-2xl font-bold mb-2">Injira</h1>
      <p className="text-gray-400 mb-6">Shyiramo umubare w'ibanga.</p>
      <PinDots />
      {error && <p className="text-red-500 mb-4 text-sm">Umubare w'ibanga siwo. Ongera ugerageze.</p>}
      <Keypad />
    </div>
  );
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([
      { id: 'welcome-1', role: 'assistant', text: "Muraho! Nitwa Kunga, umuhanga wagufasha. Nshobora kukwigisha indimi, kuganira nawe, n'ibindi byinshi. Ubifuzamo iki uyu munsi?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are Kunga, a friendly, patient, and helpful AI assistant from Rwanda. You must always respond in Kinyarwanda. If the user wants to learn another language, you act as a language tutor but still provide explanations in Kinyarwanda. Be conversational and encouraging.",
            }
        });
    } catch (e) {
        console.error("Failed to initialize AI:", e);
        setMessages(prev => [...prev, {id: 'error-1', role: 'assistant', text: "Mbabarira, hari ikibazo cya tekiniki cyabaye mu gutangiza Kunga. Nyamuneka gerageza ongera ufungure."}])
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const speak = (text: string) => {
    if (!isSoundOn || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'rw-RW'; // Prioritize Kinyarwanda voice
    window.speechSynthesis.cancel(); // Cancel any previous speech
    window.speechSynthesis.speak(utterance);
  };
  
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
        speak(lastMessage.text);
    }
  }, [messages, isSoundOn]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
        if (!chatRef.current) {
            throw new Error("Chat not initialized.");
        }
        const response: GenerateContentResponse = await chatRef.current.sendMessage({ message: input });
        const assistantMessage: Message = { id: Date.now().toString() + '-ai', role: 'assistant', text: response.text };
        setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
        console.error("Gemini API error:", error);
        const errorMessage: Message = {id: Date.now().toString() + '-err', role: 'assistant', text: 'Mbabarira, sinshoboye kubona igisubizo. Byaba byiza wongere ugerageje.' };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleListen = () => {
    if (!recognition) {
        alert("Mbabarira, porogaramu yawe ntishobora gukoresha ijwi.");
        return;
    }

    if (isListening) {
        recognition.stop();
        setIsListening(false);
        return;
    }

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
    };
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        if(transcript) handleSend(); // auto send after speech
    };
    recognition.start();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-gray-100">
      <header className="flex items-center justify-between p-4 bg-gray-900 shadow-md">
        <h1 className="text-xl font-bold text-indigo-400">Kunga AI</h1>
        <button onClick={() => setIsSoundOn(!isSoundOn)} className="p-2 rounded-full hover:bg-gray-700">
          {isSoundOn ? <SoundOnIcon /> : <SoundOffIcon />}
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && <div className="p-2 bg-indigo-500 rounded-full"><AssistantIcon className="w-5 h-5 text-white" /></div>}
            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
              <p>{msg.text}</p>
            </div>
             {msg.role === 'user' && <div className="p-2 bg-gray-600 rounded-full"><UserIcon className="w-5 h-5 text-white" /></div>}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-500 rounded-full"><AssistantIcon className="w-5 h-5 text-white" /></div>
                <div className="p-3 bg-gray-700 rounded-lg rounded-bl-none">
                    <SpinnerIcon className="w-5 h-5" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-gray-900">
        <div className="flex items-center bg-gray-700 rounded-full p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Andika ubutumwa bwawe..."
            className="flex-1 bg-transparent px-4 focus:outline-none"
            disabled={isLoading}
          />
          <button onClick={handleListen} className="p-2 rounded-full hover:bg-gray-600" disabled={isLoading}>
            <MicrophoneIcon isListening={isListening} />
          </button>
          <button onClick={handleSend} className="p-2 rounded-full hover:bg-indigo-500 bg-indigo-600 ml-2" disabled={isLoading || !input.trim()}>
            <SendIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </footer>
    </div>
  );
};


const App = () => {
    const [isUnlocked, setIsUnlocked] = useState(false);

    if (!isUnlocked) {
        return <PinScreen onUnlock={() => setIsUnlocked(true)} />;
    }

    return <ChatScreen />;
};

export default App;