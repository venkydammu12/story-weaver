import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Upload, Languages, FileText, Sparkles, X, Check, Loader2,
  Save, Cloud, CloudOff, LogOut, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAutoSave, SaveStatus } from '@/hooks/useAutoSave';

type Language = 'english' | 'telugu' | 'hindi';

// Transliteration mappings for common WhatsApp-style text
const transliterationMaps = {
  telugu: {
    'namaste': 'నమస్తే', 'nenu': 'నేను', 'meeru': 'మీరు', 'ela': 'ఎలా',
    'unnaru': 'ఉన్నారు', 'chala': 'చాలా', 'bagundi': 'బాగుంది',
    'dhanyavaadalu': 'ధన్యవాదాలు', 'prema': 'ప్రేమ', 'hrudayam': 'హృదయం',
    'kathalu': 'కథలు', 'katha': 'కథ', 'jeevitham': 'జీవితం', 'manasu': 'మనసు',
    'amma': 'అమ్మ', 'nanna': 'నాన్న', 'akka': 'అక్క', 'anna': 'అన్న',
    'chelli': 'చెల్లి', 'tammudu': 'తమ్ముడు', 'snehithudu': 'స్నేహితుడు',
    'aakasam': 'ఆకాశం', 'nakshatram': 'నక్షత్రం', 'chandrudu': 'చంద్రుడు',
    'suryudu': 'సూర్యుడు', 'puvvu': 'పువ్వు', 'cheekati': 'చీకటి',
    'velugu': 'వెలుగు', 'neellu': 'నీళ్ళు', 'gali': 'గాలి', 'varsha': 'వర్షం',
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
    'namaste': 'नमस्ते', 'main': 'मैं', 'aap': 'आप', 'kaise': 'कैसे',
    'hain': 'हैं', 'bahut': 'बहुत', 'accha': 'अच्छा', 'dhanyavaad': 'धन्यवाद',
    'pyaar': 'प्यार', 'dil': 'दिल', 'kahaniyaan': 'कहानियाँ', 'kahani': 'कहानी',
    'zindagi': 'ज़िंदगी', 'mann': 'मन', 'maa': 'माँ', 'papa': 'पापा',
    'didi': 'दीदी', 'bhaiya': 'भैया', 'behen': 'बहन', 'bhai': 'भाई',
    'dost': 'दोस्त', 'saheli': 'सहेली', 'aasmaan': 'आसमान', 'taara': 'तारा',
    'chaand': 'चाँद', 'suraj': 'सूरज', 'phool': 'फूल', 'andhera': 'अंधेरा',
    'roshni': 'रोशनी', 'paani': 'पानी', 'hawa': 'हवा', 'baarish': 'बारिश',
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

const SaveStatusIndicator = ({ status, lastSaved }: { status: SaveStatus; lastSaved: Date | null }) => {
  const getIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 size={14} className="animate-spin" />;
      case 'saved':
        return <Cloud size={14} />;
      case 'error':
        return <CloudOff size={14} />;
      default:
        return <Cloud size={14} className="opacity-50" />;
    }
  };

  const getText = () => {
    switch (status) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Saved';
      case 'error':
        return 'Error saving';
      default:
        return 'Auto-save enabled';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-2 text-xs tracking-wider ${
        status === 'error' ? 'text-red-400' : 
        status === 'saved' ? 'text-green-400' : 'text-neutral-400'
      }`}
    >
      {getIcon()}
      <span>{getText()}</span>
    </motion.div>
  );
};

const WriterStudio = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Story');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedContent, setUploadedContent] = useState('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false);
  const [saveAsTitle, setSaveAsTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { saveStatus, lastSaved, manualSave } = useAutoSave({
    storyId: null,
    content,
    title,
    language: selectedLanguage,
  });

  const transliterate = useCallback((text: string, targetLang: Language): string => {
    if (targetLang === 'english') return text;
    
    const map = transliterationMaps[targetLang];
    let result = text;
    
    const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
    
    for (const key of sortedKeys) {
      const regex = new RegExp(key, 'gi');
      result = result.replace(regex, map[key as keyof typeof map]);
    }
    
    return result;
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

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

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

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

  const useUploadedContent = () => {
    setContent(prev => prev + (prev ? '\n\n' : '') + uploadedContent);
    toast.success('Content added to editor');
  };

  const handleSaveAs = async () => {
    if (!saveAsTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    const success = await manualSave(saveAsTitle);
    if (success) {
      setTitle(saveAsTitle);
      setShowSaveAsDialog(false);
      setSaveAsTitle('');
      toast.success('Story saved successfully!');
    }
  };

  const handleExit = () => {
    navigate('/author');
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
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, hsl(350 40% 6% / 0.4) 0%, transparent 50%)',
            transform: 'translateZ(-200px) scale(1.2)',
          }}
        />
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 70% 80%, hsl(350 50% 10% / 0.3) 0%, transparent 60%)',
              'radial-gradient(ellipse at 60% 70%, hsl(350 50% 13% / 0.4) 0%, transparent 60%)',
              'radial-gradient(ellipse at 70% 80%, hsl(350 50% 10% / 0.3) 0%, transparent 60%)',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transform: 'translateZ(-100px) scale(1.1)' }}
        />
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
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4"
        style={{
          background: 'linear-gradient(180deg, hsl(0 0% 0%) 0%, transparent 100%)',
        }}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-300 group"
          >
            <motion.div
              whileHover={{ x: -4 }}
              className="p-2 rounded-full border border-neutral-700 group-hover:border-red-900/50 group-hover:bg-red-900/10 transition-all duration-300"
            >
              <ArrowLeft size={18} />
            </motion.div>
          </motion.button>

          {/* Title & Save Status */}
          <div className="flex flex-col items-center gap-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg md:text-xl tracking-[0.1em] bg-transparent border-none text-center focus:outline-none text-white"
              style={{ fontFamily: 'Georgia, serif' }}
            />
            <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Save As Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSaveAsDialog(true)}
              className="p-2 rounded-lg border border-neutral-700 hover:border-red-900/50 hover:bg-red-900/10 transition-all duration-300 text-neutral-400 hover:text-white"
            >
              <Save size={18} />
            </motion.button>

            {/* Language Selector */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-700 hover:border-red-900/50 hover:bg-red-900/10 transition-all duration-300"
              >
                <Languages size={16} />
                <span className="text-sm tracking-wider hidden md:inline">{languageLabels[selectedLanguage]}</span>
                <ChevronDown size={14} />
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
                          className={`w-full px-5 py-3 text-left text-sm tracking-wider hover:bg-red-900/20 transition-colors flex items-center gap-3 ${
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

            {/* Exit */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExit}
              className="p-2 rounded-lg border border-neutral-700 hover:border-red-900/50 hover:bg-red-900/10 transition-all duration-300 text-neutral-400 hover:text-white"
            >
              <LogOut size={18} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content - Infinite Notepad Style */}
      <main className="relative z-10 pt-28 pb-32 px-4 md:px-8 min-h-screen flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex-1 max-w-3xl mx-auto w-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Paper-like writing area */}
          <div 
            className="relative min-h-[80vh] rounded-lg overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, hsl(40 10% 7%) 0%, hsl(40 5% 5%) 100%)',
              boxShadow: '0 25px 80px -20px hsl(350 60% 15% / 0.3), 0 0 40px hsl(350 50% 10% / 0.2), inset 0 1px 0 hsl(40 10% 12%)',
              border: '1px solid hsl(40 5% 15%)',
            }}
          >
            {/* Page lines decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.07]">
              {Array.from({ length: 50 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute left-6 right-6 h-px bg-neutral-400"
                  style={{ top: `${(i + 1) * 2}rem` }}
                />
              ))}
            </div>

            {/* Left margin line */}
            <div className="absolute left-10 top-0 bottom-0 w-px bg-red-900/20" />

            {/* Textarea - Infinite scroll feel */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Begin your story..."
              className="w-full min-h-[80vh] bg-transparent text-neutral-200 placeholder-neutral-600 p-8 pl-14 resize-none focus:outline-none text-lg leading-[2rem]"
              style={{ 
                fontFamily: 'Georgia, serif',
                lineHeight: '2rem',
              }}
            />
          </div>
        </motion.div>
      </main>

      {/* Bottom Toolbar - Spotify Style */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, hsl(0 0% 0% / 0.95) 30%)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div 
            className="flex items-center justify-between p-3 rounded-xl"
            style={{
              background: 'linear-gradient(145deg, hsl(0 0% 10%) 0%, hsl(0 0% 6%) 100%)',
              border: '1px solid hsl(0 0% 15%)',
            }}
          >
            {/* Left: Word count */}
            <div className="text-xs text-neutral-500 tracking-wider">
              {content.split(/\s+/).filter(Boolean).length} words
            </div>

            {/* Center: Upload & Convert */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept=".txt,.md,.doc,.docx,.pdf,.json,.rtf"
                className="hidden"
              />
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingFile}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700 hover:border-red-900/50 hover:bg-red-900/10 transition-all duration-300 text-sm text-neutral-300"
              >
                {isProcessingFile ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                <span className="hidden md:inline">Upload</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={convertContent}
                disabled={isConverting || selectedLanguage === 'english'}
                className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-900/40 rounded-lg text-red-300 hover:bg-red-900/30 hover:border-red-900/60 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConverting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                <span className="hidden md:inline">Convert</span>
              </motion.button>
            </div>

            {/* Right: Language indicator */}
            <div className="text-xs text-neutral-500 tracking-wider">
              {languageLabels[selectedLanguage]}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save As Dialog */}
      <AnimatePresence>
        {showSaveAsDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowSaveAsDialog(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            >
              <div 
                className="p-6 rounded-xl"
                style={{
                  background: 'linear-gradient(145deg, hsl(0 0% 10%) 0%, hsl(0 0% 6%) 100%)',
                  border: '1px solid hsl(0 0% 15%)',
                  boxShadow: '0 25px 60px -15px hsl(0 0% 0% / 0.8)',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
                    Save Story As
                  </h3>
                  <button
                    onClick={() => setShowSaveAsDialog(false)}
                    className="p-1 hover:bg-neutral-800 rounded transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <input
                  type="text"
                  value={saveAsTitle}
                  onChange={(e) => setSaveAsTitle(e.target.value)}
                  placeholder="Enter story title..."
                  className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-red-900/50 mb-4"
                  style={{ fontFamily: 'Georgia, serif' }}
                  autoFocus
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSaveAsDialog(false)}
                    className="flex-1 py-3 border border-neutral-700 rounded-lg text-neutral-300 hover:bg-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveAs}
                    className="flex-1 py-3 bg-red-900/30 border border-red-900/50 rounded-lg text-red-300 hover:bg-red-900/50 transition-colors"
                  >
                    Save
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Uploaded File Panel */}
      <AnimatePresence>
        {uploadedFile && uploadedContent && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-4 top-24 bottom-24 w-80 z-40 overflow-hidden rounded-xl"
            style={{
              background: 'linear-gradient(145deg, hsl(0 0% 8%) 0%, hsl(0 0% 5%) 100%)',
              border: '1px solid hsl(0 0% 12%)',
            }}
          >
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-red-400" />
                <span className="text-sm truncate max-w-[180px]">{uploadedFile.name}</span>
              </div>
              <button
                onClick={() => {
                  setUploadedFile(null);
                  setUploadedContent('');
                }}
                className="p-1 hover:bg-neutral-700 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-4 h-[calc(100%-8rem)] overflow-y-auto text-sm text-neutral-300 leading-relaxed">
              {uploadedContent.substring(0, 2000)}
              {uploadedContent.length > 2000 && '...'}
            </div>
            
            <div className="p-4 border-t border-neutral-800 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={convertUploadedContent}
                disabled={selectedLanguage === 'english'}
                className="flex-1 py-2 text-xs bg-red-900/20 border border-red-900/40 rounded-lg text-red-300 hover:bg-red-900/30 transition-colors disabled:opacity-50"
              >
                Convert
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={useUploadedContent}
                className="flex-1 py-2 text-xs border border-neutral-600 rounded-lg text-neutral-300 hover:bg-neutral-800 transition-colors"
              >
                Add to Editor
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1 h-1 rounded-full bg-red-400/20 pointer-events-none"
          style={{
            left: `${20 + i * 20}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
};

export default WriterStudio;
