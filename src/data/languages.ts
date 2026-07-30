export interface LanguageItem {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  welcomeText: string;
}

export const TOP_40_LANGUAGES: LanguageItem[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', welcomeText: 'AI Commerce Exchange (ACE)' },
  { code: 'zh', name: 'Mandarin Chinese', nativeName: '中文 (普通话)', flag: '🇨🇳', welcomeText: '全球自主人工智能商业交易所' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', welcomeText: 'Mercado Global Autónomo de Comercio e Intercambio de Tiempo' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', welcomeText: 'ग्लोबल स्वायत्त एआई वाणिज्य विनिमय' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', welcomeText: 'البورصة العالمية المستقلة للتجارة والتبادل الزمني' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', welcomeText: 'গ্লোবাল স্বায়ত্তশাসিত এআই বাণিজ্য বিনিময়' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', welcomeText: 'Bolsa Global Autônoma de Comércio e Crédito Temporal' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', welcomeText: 'Глобальная автономная торговая биржа ИИ' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', welcomeText: 'グローバル自律型AIコマース＆時間取引所' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', welcomeText: 'ਗਲੋਬਲ ਆਟੋਨੋਮਸ ਏਆਈ ਵਪਾਰ ਵਟਾਂਦਰਾ' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', welcomeText: 'Globale Autonome KI-Handels- und Zeitkreditbörse' },
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa', flag: '🇮🇩', welcomeText: 'Bursa Perdagangan AI Otonom Global' },
  { code: 'wu', name: 'Wu Chinese', nativeName: '吴语', flag: '🇨🇳', welcomeText: '全球自主人工智能商业交易所' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', welcomeText: 'Bursa Perdagangan & Kredit Waktu AI Otonom Global' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', welcomeText: 'గ్లోబల్ స్వయంప్రతిపత్తి కలిగిన AI వాణిజ్య మార్పిడి' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', welcomeText: 'Sàn Giao Dịch Thương Mại & Tín Dụng Thời Gian AI' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', welcomeText: 'ग्लोबल स्वायत्त एआय वाणिज्य एक्सचेंज' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', welcomeText: 'உலகளாவிய ಸ್ವയംప్రతిపత్తి AI வர்த்தகப் பரிமாற்றம்' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', welcomeText: 'Küresel Otonom Yapay Zeka Ticaret Borsa' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', welcomeText: 'عالمی بائے اے آئی ٹریڈنگ ایکسچینج' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', welcomeText: '글로벌 자율 AI 커머스 및 시간 거래소' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', welcomeText: 'Bourse Mondiale Autonome de Commerce & Crédit Temps' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', welcomeText: 'Borsa Globale Autonoma di Commercio e Credito Temporale' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', welcomeText: 'بورس جهانی تجارت و تبادل 시간 هوش مصنوعی' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', welcomeText: 'Globalna Autonomiczna Giełda Handlu i Czasu AI' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', welcomeText: 'Глобальна Автономна Торгова Біржа ШІ' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', welcomeText: 'Globale Autonome AI Handelsbeurs' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', welcomeText: 'ตลาดกลางการค้าและการแลกเปลี่ยนเวลา AI อัตโนมัติ' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', welcomeText: 'ዓለም አቀፍ የኤአይ ንግድ እና የጊዜ ክሬዲት ልውውጥ' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Èdè Yorùbá', flag: '🇳🇬', welcomeText: 'Agbaye Adase AI Commerce Agbaye' },
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo', flag: '🇪🇹', welcomeText: "Gabaa Daldala fi Jijjiarra Sa'aatii AI" },
  { code: 'ig', name: 'Igbo', nativeName: 'Asụsụ Igbo', flag: '🇳🇬', welcomeText: 'Ahịa Azụmaahịa AI Global' },
  { code: 'tl', name: 'Tagalog (Filipino)', nativeName: 'Wikang Tagalog', flag: '🇵🇭', welcomeText: 'Pandaigdigang Palitan ng Kalakalan at Oras ng AI' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', welcomeText: 'Bursa Globală Autonomă de Comerț și Credite de Timp' },
  { code: 'ha', name: 'Hausa', nativeName: 'Harshen Hausa', flag: '🇳🇬', welcomeText: 'Mahaɗar Kasuwancin AI ta Duniya' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', welcomeText: 'Soko la Biashara na Mikopo ya Muda la AI la Kimataifa' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', welcomeText: 'ગ્લોબલ સ્વાયત્ત AI કોમર્સ એક્સચેન્જ' },
  { code: 'yue', name: 'Cantonese', nativeName: '粵語', flag: '🇭🇰', welcomeText: '全球自主人工智慧商業交易所' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', welcomeText: 'ഗ്ലോബൽ എഐ സമയം വിനിമയ എക്സ്ചേഞ്ച്' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', welcomeText: 'ಗ್ಲೋಬಲ್ ಸ್ವಾಯತ್ತ ಎಐ ವಾಣಿಜ್ಯ ವಿನಿಮಯ' }
];
