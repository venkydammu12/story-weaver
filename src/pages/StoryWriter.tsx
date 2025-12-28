import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, Languages, FileText, Sparkles, X, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Language = 'english' | 'telugu' | 'hindi';

// Transliteration mappings for common WhatsApp-style text
const transliterationMaps = {
  telugu: {
    // Common words and phrases
    'namaste': 'నమస్తే',
    'nenu': 'నేను',
    'meeru': 'మీరు',
    'ela': 'ఎలా',
    'unnaru': 'ఉన్నారు',
    'chala': 'చాలా',
    'bagundi': 'బాగుంది',
    'dhanyavaadalu': 'ధన్యవాదాలు',
    'prema': 'ప్రేమ',
    'hrudayam': 'హృదయం',
    'kathalu': 'కథలు',
    'katha': 'కథ',
    'jeevitham': 'జీవితం',
    'manasu': 'మనసు',
    'amma': 'అమ్మ',
    'nanna': 'నాన్న',
    'akka': 'అక్క',
    'anna': 'అన్న',
    'chelli': 'చెల్లి',
    'tammudu': 'తమ్ముడు',
    'snehithudu': 'స్నేహితుడు',
    'snehithuralu': 'స్నేహితురాలు',
    'aakasam': 'ఆకాశం',
    'nakshatram': 'నక్షత్రం',
    'chandrudu': 'చంద్రుడు',
    'suryudu': 'సూర్యుడు',
    'puvvu': 'పువ్వు',
    'cheekati': 'చీకటి',
    'velugu': 'వెలుగు',
    'neellu': 'నీళ్ళు',
    'gali': 'గాలి',
    'varsha': 'వర్షం',
    'endakaalam': 'ఎండాకాలం',
    // Letters mapping
    'a': 'అ', 'aa': 'ఆ', 'i': 'ఇ', 'ee': 'ఈ', 'u': 'ఉ', 'oo': 'ఊ',
    'e': 'ఎ', 'ae': 'ఏ', 'ai': 'ఐ', 'o': 'ఒ', 'oh': 'ఓ', 'au': 'ఔ',
    'ka': 'క', 'kha': 'ఖ', 'ga': 'గ', 'gha': 'ఘ', 'nga': 'ఙ',
    'cha': 'చ', 'chha': 'ఛ', 'ja': 'జ', 'jha': 'ఝ', 'nya': 'ఞ',
    'ta': 'ట', 'tha': 'ఠ', 'da': 'డ', 'dha': 'ఢ', 'na': 'ణ',
    'pa': 'ప', 'pha': 'ఫ', 'ba': 'బ', 'bha': 'భ', 'ma': 'మ',
    'ya': 'య', 'ra': 'ర', 'la': 'ల', 'va': 'వ', 'wa': 'వ',
    'sha': 'శ', 'sa': 'స', 'ha': 'హ',
  },
  hindi: {
    // Common words and phrases
    'namaste': 'नमस्ते',
    'main': 'मैं',
    'aap': 'आप',
    'kaise': 'कैसे',
    'hain': 'हैं',
    'bahut': 'बहुत',
    'accha': 'अच्छा',
    'dhanyavaad': 'धन्यवाद',
    'pyaar': 'प्यार',
    'dil': 'दिल',
    'kahaniyaan': 'कहानियाँ',
    'kahani': 'कहानी',
    'zindagi': 'ज़िंदगी',
    'mann': 'मन',
    'maa': 'माँ',
    'papa': 'पापा',
    'didi': 'दीदी',
    'bhaiya': 'भैया',
    'behen': 'बहन',
    'bhai': 'भाई',
    'dost': 'दोस्त',
    'saheli': 'सहेली',
    'aasmaan': 'आसमान',
    'taara': 'तारा',
    'chaand': 'चाँद',
    'suraj': 'सूरज',
    'phool': 'फूल',
    'andhera': 'अंधेरा',
    'roshni': 'रोशनी',
    'paani': 'पानी',
    'hawa': 'हवा',
    'baarish': 'बारिश',
    'garmi': 'गर्मी',
    // Letters mapping
    'a': 'अ', 'aa': 'आ', 'i': 'इ', 'ee': 'ई', 'u': 'उ', 'oo': 'ऊ',
    'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ',
    'ka': 'क', 'kha': 'ख', 'ga': 'ग', 'gha': 'घ',
    'cha': 'च', 'chha': 'छ', 'ja': 'ज', 'jha': 'झ',
    'ta': 'ट', 'tha': 'ठ', 'da': 'ड', 'dha': 'ढ', 'na': 'न',
    'pa': 'प', 'pha': 'फ', 'ba': 'ब', 'bha': 'भ', 'ma': 'म',
    'ya': 'य', 'ra': 'र', 'la': 'ल', 'va': 'व', 'wa': 'व',
    'sha': 'श', 'sa': 'स', 'ha': 'ह',
  }
};

const languageLabels: Record<Language, string> = {
  english: 'English',
  telugu: 'తెలుగు',
  hindi: 'हिंदी'
};

const StoryWriter = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedContent, setUploadedContent] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Transliterate text based on selected language
  const transliterate = useCallback((text: string, targetLang: Language): string => {
    if (targetLang === 'english') return text;
    
    const map = transliterationMaps[targetLang];
    let result = text;
    
    // Sort by length (longest first) to match multi-character sequences first
    const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
    
    for (const key of sortedKeys) {
      const regex = new RegExp(key, 'gi');
      result = result.replace(regex, map[key as keyof typeof map]);
    }
    
    return result;
  }, []);

  // Handle content change with live transliteration
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
  };

  // Convert content to selected language
  const convertContent = () => {
    if (!content.trim()) {
      toast.error('Please write some content first');
      return;
    }
    
    setIsConverting(true);
    
    setTimeout(() => {
      const converted = transliterate(content, selectedLanguage);
      setContent(converted);
      setIsConverting(false);
      toast.success(`Converted to ${languageLabels[selectedLanguage]}`);
    }, 800);
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    setIsProcessingFile(true);
    
    try {
      const text = await readFileContent(file);
      setUploadedContent(text);
      toast.success(`File "${file.name}" loaded successfully`);
    } catch (error) {
      toast.error('Error reading file');
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Read file content based on type
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      // Handle different file types
      if (file.type.includes('text') || 
          file.name.endsWith('.txt') || 
          file.name.endsWith('.md') ||
          file.name.endsWith('.json')) {
        reader.readAsText(file);
      } else {
        // For other files, try to read as text
        reader.readAsText(file);
      }
    });
  };

  // Convert uploaded content
  const convertUploadedContent = () => {
    if (!uploadedContent.trim()) {
      toast.error('No uploaded content to convert');
      return;
    }
    
    setIsConverting(true);
    
    setTimeout(() => {
      const converted = transliterate(uploadedContent, selectedLanguage);
      setUploadedContent(converted);
      setIsConverting(false);
      toast.success(`Document converted to ${languageLabels[selectedLanguage]}`);
    }, 1000);
  };

  // Use uploaded content in editor
  const useUploadedContent = () => {
    setContent(prev => prev + (prev ? '\n\n' : '') + uploadedContent);
    toast.success('Content added to editor');
  };

  return (
    <div 
      className="min-h-screen bg-black text-white overflow-x-hidden"
      style={{ perspective: '2000px' }}
    >
      {/* 3D Background Layers */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Deep background layer */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, hsl(350 40% 8% / 0.4) 0%, transparent 50%)',
            transform: 'translateZ(-200px) scale(1.2)',
          }}
        />
        {/* Mid layer with animated glow */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 70% 80%, hsl(350 50% 12% / 0.3) 0%, transparent 60%)',
              'radial-gradient(ellipse at 60% 70%, hsl(350 50% 15% / 0.4) 0%, transparent 60%)',
              'radial-gradient(ellipse at 70% 80%, hsl(350 50% 12% / 0.3) 0%, transparent 60%)',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transform: 'translateZ(-100px) scale(1.1)' }}
        />
        {/* Vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, hsl(0 0% 0% / 0.8) 100%)',
          }}
        />
      </motion.div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          background: 'linear-gradient(180deg, hsl(0 0% 0%) 0%, transparent 100%)',
        }}
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors duration-300 group"
        >
          <motion.div
            whileHover={{ x: -4 }}
            className="p-2 rounded-full border border-neutral-700 group-hover:border-red-900/50 group-hover:bg-red-900/10 transition-all duration-300"
          >
            <ArrowLeft size={20} />
          </motion.div>
          <span className="text-sm tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: 'Georgia, serif' }}>
            Back
          </span>
        </motion.button>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl md:text-2xl tracking-[0.15em] absolute left-1/2 -translate-x-1/2"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Write Stories
        </motion.h1>

        {/* Language Selector */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700 hover:border-red-900/50 hover:bg-red-900/10 transition-all duration-300"
          >
            <Languages size={18} />
            <span className="text-sm tracking-wider">{languageLabels[selectedLanguage]}</span>
          </motion.button>

          <AnimatePresence>
            {isLanguageMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setIsLanguageMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 z-50 bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden shadow-2xl"
                >
                  {(['english', 'telugu', 'hindi'] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setIsLanguageMenuOpen(false);
                      }}
                      className={`w-full px-6 py-3 text-left text-sm tracking-wider hover:bg-red-900/20 transition-colors flex items-center gap-3 ${
                        selectedLanguage === lang ? 'text-red-400 bg-red-900/10' : 'text-neutral-300'
                      }`}
                    >
                      {selectedLanguage === lang && <Check size={14} />}
                      <span className={selectedLanguage === lang ? '' : 'ml-5'}>{languageLabels[lang]}</span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12 px-4 md:px-8 min-h-screen flex flex-col">
        {/* Writing Area */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex-1 max-w-4xl mx-auto w-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Paper-like writing area */}
          <div 
            className="relative min-h-[70vh] rounded-lg overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, hsl(0 0% 8%) 0%, hsl(0 0% 5%) 100%)',
              boxShadow: '0 25px 80px -20px hsl(350 60% 20% / 0.3), 0 0 40px hsl(350 50% 15% / 0.2), inset 0 1px 0 hsl(0 0% 15%)',
              border: '1px solid hsl(0 0% 12%)',
            }}
          >
            {/* Page lines decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute left-8 right-8 h-px bg-neutral-600"
                  style={{ top: `${(i + 1) * 2.5}rem` }}
                />
              ))}
            </div>

            {/* Left margin line */}
            <div className="absolute left-12 top-0 bottom-0 w-px bg-red-900/30" />

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing your story here..."
              className="w-full min-h-[70vh] bg-transparent text-neutral-200 placeholder-neutral-600 p-8 pl-16 resize-none focus:outline-none text-lg leading-relaxed"
              style={{ 
                fontFamily: 'Georgia, serif',
                lineHeight: '2.5rem',
              }}
            />

            {/* Convert Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={convertContent}
              disabled={isConverting || selectedLanguage === 'english'}
              className="absolute bottom-6 right-6 flex items-center gap-2 px-6 py-3 bg-red-900/20 border border-red-900/40 rounded-lg text-red-300 hover:bg-red-900/30 hover:border-red-900/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConverting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              <span className="text-sm tracking-wider">
                {isConverting ? 'Converting...' : `Convert to ${languageLabels[selectedLanguage]}`}
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Document Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto w-full mt-8"
        >
          <div 
            className="p-6 rounded-lg"
            style={{
              background: 'linear-gradient(145deg, hsl(0 0% 6%) 0%, hsl(0 0% 4%) 100%)',
              border: '1px solid hsl(0 0% 12%)',
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <FileText size={20} className="text-red-400" />
              <h3 className="text-lg tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                Upload Document
              </h3>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept=".txt,.md,.doc,.docx,.pdf,.json,.rtf"
              className="hidden"
            />

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-6 py-3 border border-dashed border-neutral-600 hover:border-red-900/50 rounded-lg transition-all duration-300 hover:bg-red-900/5"
              >
                <Upload size={18} />
                <span className="text-sm text-neutral-400">Choose File</span>
              </motion.button>

              {uploadedFile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-4 py-3 bg-neutral-800/50 rounded-lg"
                >
                  <FileText size={16} className="text-neutral-400" />
                  <span className="text-sm text-neutral-300">{uploadedFile.name}</span>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setUploadedContent('');
                    }}
                    className="ml-2 text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </div>

            {/* Uploaded Content Preview */}
            <AnimatePresence>
              {uploadedContent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 max-h-48 overflow-y-auto">
                    <pre className="text-sm text-neutral-400 whitespace-pre-wrap" style={{ fontFamily: 'Georgia, serif' }}>
                      {uploadedContent.slice(0, 500)}
                      {uploadedContent.length > 500 && '...'}
                    </pre>
                  </div>
                  
                  <div className="flex gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={convertUploadedContent}
                      disabled={isConverting || selectedLanguage === 'english'}
                      className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-900/40 rounded-lg text-red-300 text-sm hover:bg-red-900/30 transition-all disabled:opacity-50"
                    >
                      {isConverting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      Convert Document
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={useUploadedContent}
                      className="flex items-center gap-2 px-4 py-2 border border-neutral-700 rounded-lg text-neutral-300 text-sm hover:bg-neutral-800/50 transition-all"
                    >
                      Add to Editor
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isProcessingFile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center gap-3 text-neutral-400"
              >
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Processing file...</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-neutral-600 text-sm mt-8 max-w-xl mx-auto"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Tip: Type in WhatsApp-style language (e.g., "namaste", "prema", "dil") and click convert to transform it into {languageLabels[selectedLanguage]} script.
        </motion.p>
      </main>

      {/* Floating particles for 3D effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-red-900/30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * -200, null],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              transform: `translateZ(${Math.random() * 100 - 50}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StoryWriter;
