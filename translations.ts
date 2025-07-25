
export const supportedLanguages = {
  en: 'English',
  fr: 'Français',
  rw: 'Kinyarwanda',
};

export type LanguageCode = keyof typeof supportedLanguages;

export const translations: Record<LanguageCode, { [key: string]: string }> = {
  rw: {
    // Homepage
    'homepage.title': 'Ikaze kuri Kunga AI',
    'homepage.subtitle': 'Umuhagarizi wawe w\'ubwenge wo kugufasha kwiga, kuganira, no kuvumbura.',
    'homepage.feature1.title': 'Indimi Nyinshi',
    'homepage.feature1.description': 'Ganira kandi wige mu Gifaransa, Icyongereza, n\'Ikinyarwanda.',
    'homepage.feature2.title': 'Amashusho n\'Ijwi',
    'homepage.feature2.description': 'Ohereza amashusho kandi ukoreshe ijwi ryawe mu biganiro.',
    'homepage.feature3.title': 'Igenamiterere Ryihariye',
    'homepage.feature3.description': 'Hindura uko bigaragara, amajwi, n\'ibindi kugira ngo bikunogere.',
    'homepage.cta': 'Tangira',
    'homepage.language': 'Ururimi',

    // Auth
    'unlock.title': "Injira",
    'unlock.subtitle': "Shyiramo umubare w'ibanga.",
    'unlock.error': "Umubare w'ibanga siwo. Ongera ugerageze.",
    'createPin.title': "Shyiramo umubare w'ibanga mushya",
    'createPin.subtitle': "Shyiramo umubare w'ibanga w'imibare 4.",
    'confirmPin.title': "Emeza umubare w'ibanga mushya",
    'confirmPin.subtitle': "Ongera ushyiremo umubare w'ibanga.",
    'confirmPin.error': "Imibare y'ibanga ntiyahuza. Ongera ugerageze.",
    'delete.label': 'Siba',
    'number.label': 'Umubare {key}',

    // Chat
    'chat.header': "Kunga AI",
    'chat.welcomeMessage': "Muraho! Nitwa Kunga, umuhanga wagufasha. Nshobora kukwigisha indimi, kuganira nawe, n'ibindi byinshi. Ubifuzamo iki uyu munsi?",
    'chat.placeholder': "Andika ubutumwa bwawe...",
    'chat.geminiError': "Mbabarira, sinshoboye kubona igisubizo. Byaba byiza wongere ugerageje.",
    'chat.initError': "Mbabarira, hari ikibazo cya tekiniki cyabaye mu gutangiza Kunga. Nyamuneka gerageza ongera ufungure.",
    'chat.speechRecognitionNotSupported': "Mbabarira, porogaramu yawe ntishobora gukoresha ijwi.",
    'chat.profilePictureAlt': "Ifoto y'umwirondoro",
    'chat.userUploadAlt': "Ifoto washyizeho",

    // Settings
    'settings.title': "Igenamiterere",
    'settings.profilePictureTitle': "Ifoto y'umwirondoro",
    'settings.profilePictureEditLabel': "Hindura ifoto y'umwirondoro",
    'settings.profilePictureDescription': "Hindura ifoto yawe",
    'settings.profilePictureSubdescription': "Ifoto yawe izagaragara mu kiganiro.",
    'settings.fileReadError': "Byabuze, ifoto ntiyabashije gufungurwa.",
    'settings.themeTitle': "Inyuma Rusange",
    'settings.themeLabel': "Guhindura urubuga",
    'settings.themeLight': "Umucyo",
    'settings.themeDark': "Umwijima",
    'settings.soundTitle': "Ijwi",
    'settings.backgroundTitle': "Aho Ikiganiro Kibera",
    'settings.backgroundDefault': "Ibisanzwe",
    'settings.backgroundOcean': "Inyanja",
    'settings.backgroundSunset': "Izuba Rirenga",
    'settings.backgroundMint': "Mint",
    'settings.securityTitle': "Umutekano",
    'settings.securityChangePin': "Hindura umubare w'ibanga",
    'settings.languageTitle': "Ururimi",
    
    // System Prompt
    'system.instruction': "You are Kunga, a friendly, patient, and helpful AI assistant from Rwanda. You must always respond in Kinyarwanda. If the user wants to learn another language, you act as a language tutor but still provide explanations in Kinyarwanda. When analyzing an image, describe it in Kinyarwanda. Be conversational and encouraging."
  },
  en: {
    // Homepage
    'homepage.title': 'Welcome to Kunga AI',
    'homepage.subtitle': 'Your intelligent assistant to help you learn, chat, and discover.',
    'homepage.feature1.title': 'Multilingual',
    'homepage.feature1.description': 'Chat and learn in French, English, and Kinyarwanda.',
    'homepage.feature2.title': 'Image & Voice',
    'homepage.feature2.description': 'Send images and use your voice to interact.',
    'homepage.feature3.title': 'Personalized Experience',
    'homepage.feature3.description': 'Customize themes, sounds, and more to your liking.',
    'homepage.cta': 'Get Started',
    'homepage.language': 'Language',

    // Auth
    'unlock.title': "Enter PIN",
    'unlock.subtitle': "Please enter your PIN.",
    'unlock.error': "Incorrect PIN. Please try again.",
    'createPin.title': "Create a new PIN",
    'createPin.subtitle': "Enter a 4-digit PIN.",
    'confirmPin.title': "Confirm your new PIN",
    'confirmPin.subtitle': "Re-enter your PIN to confirm.",
    'confirmPin.error': "PINs do not match. Please try again.",
    'delete.label': 'Delete',
    'number.label': 'Number {key}',
    
    // Chat
    'chat.header': "Kunga AI",
    'chat.welcomeMessage': "Hello! I'm Kunga, your AI assistant. I can help you learn languages, chat with you, and much more. What would you like to do today?",
    'chat.placeholder': "Type your message...",
    'chat.geminiError': "I'm sorry, I couldn't get a response. Please try again.",
    'chat.initError': "I'm sorry, a technical issue occurred while starting Kunga. Please try reopening the app.",
    'chat.speechRecognitionNotSupported': "Sorry, your browser doesn't support speech recognition.",
    'chat.profilePictureAlt': "Profile picture",
    'chat.userUploadAlt': "User upload",
    
    // Settings
    'settings.title': "Settings",
    'settings.profilePictureTitle': "Profile Picture",
    'settings.profilePictureEditLabel': "Change profile picture",
    'settings.profilePictureDescription': "Change your photo",
    'settings.profilePictureSubdescription': "Your picture will appear in the chat.",
    'settings.fileReadError': "Oops, the file could not be read.",
    'settings.themeTitle': "Appearance",
    'settings.themeLabel': "Switch theme",
    'settings.themeLight': "Light",
    'settings.themeDark': "Dark",
    'settings.soundTitle': "Sound",
    'settings.backgroundTitle': "Chat Background",
    'settings.backgroundDefault': "Default",
    'settings.backgroundOcean': "Ocean",
    'settings.backgroundSunset': "Sunset",
    'settings.backgroundMint': "Mint",
    'settings.securityTitle': "Security",
    'settings.securityChangePin': "Change PIN",
    'settings.languageTitle': "Language",

    // System Prompt
    'system.instruction': "You are Kunga, a friendly, patient, and helpful AI assistant. You must always respond in English. If the user wants to learn another language, you act as a language tutor but still provide explanations in English. When analyzing an image, describe it in English. Be conversational and encouraging."
  },
  fr: {
    // Homepage
    'homepage.title': 'Bienvenue chez Kunga AI',
    'homepage.subtitle': 'Votre assistant intelligent pour vous aider à apprendre, discuter et découvrir.',
    'homepage.feature1.title': 'Multilingue',
    'homepage.feature1.description': 'Discutez et apprenez en français, anglais et kinyarwanda.',
    'homepage.feature2.title': 'Image & Voix',
    'homepage.feature2.description': 'Envoyez des images et utilisez votre voix pour interagir.',
    'homepage.feature3.title': 'Expérience Personnalisée',
    'homepage.feature3.description': 'Personnalisez les thèmes, les sons et plus encore à votre goût.',
    'homepage.cta': 'Commencer',
    'homepage.language': 'Langue',
    
    // Auth
    'unlock.title': "Entrez le PIN",
    'unlock.subtitle': "Veuillez entrer votre code PIN.",
    'unlock.error': "PIN incorrect. Veuillez réessayer.",
    'createPin.title': "Créer un nouveau PIN",
    'createPin.subtitle': "Entrez un PIN à 4 chiffres.",
    'confirmPin.title': "Confirmez votre nouveau PIN",
    'confirmPin.subtitle': "Ressaisissez votre PIN pour confirmer.",
    'confirmPin.error': "Les PIN ne correspondent pas. Veuillez réessayer.",
    'delete.label': 'Supprimer',
    'number.label': 'Numéro {key}',
    
    // Chat
    'chat.header': "Kunga AI",
    'chat.welcomeMessage': "Bonjour ! Je suis Kunga, votre assistant IA. Je peux vous aider à apprendre des langues, discuter avec vous, et bien plus encore. Que souhaitez-vous faire aujourd'hui ?",
    'chat.placeholder': "Écrivez votre message...",
    'chat.geminiError': "Désolé, je n'ai pas pu obtenir de réponse. Veuillez réessayer.",
    'chat.initError': "Désolé, un problème technique est survenu lors du démarrage de Kunga. Veuillez essayer de rouvrir l'application.",
    'chat.speechRecognitionNotSupported': "Désolé, votre navigateur ne prend pas en charge la reconnaissance vocale.",
    'chat.profilePictureAlt': "Photo de profil",
    'chat.userUploadAlt': "Image téléchargée",

    // Settings
    'settings.title': "Paramètres",
    'settings.profilePictureTitle': "Photo de profil",
    'settings.profilePictureEditLabel': "Changer la photo de profil",
    'settings.profilePictureDescription': "Changez votre photo",
    'settings.profilePictureSubdescription': "Votre photo apparaîtra dans le chat.",
    'settings.fileReadError': "Oups, le fichier n'a pas pu être lu.",
    'settings.themeTitle': "Apparence",
    'settings.themeLabel': "Changer de thème",
    'settings.themeLight': "Clair",
    'settings.themeDark': "Sombre",
    'settings.soundTitle': "Son",
    'settings.backgroundTitle': "Arrière-plan du chat",
    'settings.backgroundDefault': "Défaut",
    'settings.backgroundOcean': "Océan",
    'settings.backgroundSunset': "Crépuscule",
    'settings.backgroundMint': "Menthe",
    'settings.securityTitle': "Sécurité",
    'settings.securityChangePin': "Changer le PIN",
    'settings.languageTitle': "Langue",

    // System Prompt
    'system.instruction': "Vous êtes Kunga, un assistant IA amical, patient et serviable. Vous devez toujours répondre en français. Si l'utilisateur souhaite apprendre une autre langue, vous agissez comme un tuteur linguistique mais fournissez toujours des explications en français. Lorsque vous analysez une image, décrivez-la en français. Soyez conversationnel et encourageant."
  }
};