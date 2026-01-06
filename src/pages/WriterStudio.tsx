import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Languages, Sparkles, X, Loader2,
  Save, FolderOpen, Send, Check, ChevronDown
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useDrafts, Draft } from '@/hooks/useDrafts';

type Language = 'english' | 'telugu' | 'hindi';

const languageLabels: Record<Language, string> = {
  english: 'English',
  telugu: 'తెలుగు',
  hindi: 'हिंदी'
};

const SaveStatusIndicator = ({ status, lastSaved }: { status: 'idle' | 'saving' | 'saved'; lastSaved: Date | null }) => {
  if (status === 'idle' && !lastSaved) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center gap-2 text-xs tracking-wider ${
        status === 'saved' ? 'text-green-400/70' : 'text-neutral-500'
      }`}
    >
      {status === 'saving' ? (
        <>
          <Loader2 size={12} className="animate-spin" />
          <span>Saving...</span>
        </>
      ) : status === 'saved' ? (
        <>
          <Check size={12} />
          <span>Saved</span>
        </>
      ) : null}
    </motion.div>
  );
};

const WriterStudio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { autoSaveDraft, deleteDraft } = useDrafts();
  
  // Load draft from navigation state if present
  const initialDraft = location.state?.draft as Draft | undefined;
  
  const [content, setContent] = useState(initialDraft?.content || '');
  const [title, setTitle] = useState(initialDraft?.title || 'Untitled Story');
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(initialDraft?.id || null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>((initialDraft?.language as Language) || 'english');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    if (!content.trim() && !title.trim()) return;
    
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saving');
      const newId = autoSaveDraft(currentDraftId, title, content, selectedLanguage);
      if (newId && !currentDraftId) {
        setCurrentDraftId(newId);
      }
      setSaveStatus('saved');
      setLastSaved(new Date());
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [content, title, selectedLanguage, currentDraftId, autoSaveDraft]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // AI-powered language conversion
  const convertContent = useCallback(async () => {
    if (!content.trim()) {
      toast.error('Please write some content first');
      return;
    }
    
    setIsConverting(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/convert-language`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            text: content,
            targetLanguage: selectedLanguage,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Conversion failed');
      }

      const data = await response.json();
      
      // Animate content change
      setContent('');
      setTimeout(() => {
        setContent(data.convertedText);
        toast.success(`Converted to ${languageLabels[selectedLanguage]}`);
      }, 100);
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to convert text');
    } finally {
      setIsConverting(false);
    }
  }, [content, selectedLanguage]);

  // Publish story
  const handlePublish = useCallback(async () => {
    if (!content.trim()) {
      toast.error('Please write some content first');
      return;
    }
    if (!title.trim() || title === 'Untitled Story') {
      toast.error('Please give your story a title');
      return;
    }

    setIsPublishing(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/publish-story`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            title,
            content,
            language: selectedLanguage,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Publishing failed');
      }

      // Delete the draft since it's now published
      if (currentDraftId) {
        deleteDraft(currentDraftId);
      }

      toast.success('Story published successfully!');
      setShowPublishDialog(false);
      
      // Clear and navigate to stories
      setTimeout(() => {
        navigate('/stories');
      }, 1500);
    } catch (error) {
      console.error('Publishing error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to publish story');
    } finally {
      setIsPublishing(false);
    }
  }, [content, title, selectedLanguage, currentDraftId, deleteDraft, navigate]);

  // Manual save
  const handleManualSave = useCallback(() => {
    if (!content.trim()) {
      toast.error('Nothing to save');
      return;
    }
    
    setSaveStatus('saving');
    const newId = autoSaveDraft(currentDraftId, title, content, selectedLanguage);
    if (newId && !currentDraftId) {
      setCurrentDraftId(newId);
    }
    setSaveStatus('saved');
    setLastSaved(new Date());
    toast.success('Draft saved');
    
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [content, title, selectedLanguage, currentDraftId, autoSaveDraft]);

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return (
    <div 
      className="min-h-screen bg-black text-white overflow-x-hidden"
      style={{ perspective: '2000px' }}
    >
      {/* Ambient Background */}
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
          }}
        />
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 70% 80%, hsl(350 50% 10% / 0.2) 0%, transparent 60%)',
              'radial-gradient(ellipse at 60% 70%, hsl(350 50% 12% / 0.3) 0%, transparent 60%)',
              'radial-gradient(ellipse at 70% 80%, hsl(350 50% 10% / 0.2) 0%, transparent 60%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Header - Minimal */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4"
        style={{
          background: 'linear-gradient(180deg, hsl(0 0% 0%) 0%, transparent 100%)',
        }}
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/author')}
            className="p-2 rounded-full border border-neutral-700 hover:border-red-900/50 hover:bg-red-900/10 transition-all duration-300 text-neutral-400 hover:text-white"
          >
            <ArrowLeft size={18} />
          </motion.button>

          {/* Title & Status */}
          <div className="flex flex-col items-center gap-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg md:text-xl tracking-[0.08em] bg-transparent border-none text-center focus:outline-none text-white max-w-[200px] md:max-w-[300px]"
              style={{ fontFamily: 'Georgia, serif' }}
              placeholder="Story Title..."
            />
            <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} />
          </div>

          {/* Drafts Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/drafts')}
            className="p-2 rounded-full border border-neutral-700 hover:border-red-900/50 hover:bg-red-900/10 transition-all duration-300 text-neutral-400 hover:text-white"
          >
            <FolderOpen size={18} />
          </motion.button>
        </div>
      </motion.header>

      {/* Main Writing Area */}
      <main className="relative z-10 pt-24 pb-28 px-4 md:px-8 min-h-screen flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 max-w-3xl mx-auto w-full"
        >
          {/* Clean Paper-like Writing Surface */}
          <div 
            className="relative min-h-[75vh] rounded-lg overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, hsl(40 8% 8%) 0%, hsl(40 5% 6%) 100%)',
              boxShadow: '0 20px 60px -20px hsl(350 60% 12% / 0.3), inset 0 1px 0 hsl(40 10% 15%)',
              border: '1px solid hsl(40 5% 12%)',
            }}
          >
            {/* Subtle line guides */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
              {Array.from({ length: 40 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute left-8 right-8 h-px bg-neutral-400"
                  style={{ top: `${(i + 2) * 2}rem` }}
                />
              ))}
            </div>

            {/* Left margin accent */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-red-900/15" />

            {/* Writing Area */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Begin your story..."
              className="w-full min-h-[75vh] bg-transparent text-neutral-200 placeholder-neutral-600 p-8 pl-12 resize-none focus:outline-none text-lg leading-[2rem]"
              style={{ 
                fontFamily: 'Georgia, serif',
                lineHeight: '2rem',
              }}
              autoFocus
            />
          </div>
        </motion.div>
      </main>

      {/* Bottom Action Bar - Spotify Style */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, hsl(0 0% 0% / 0.98) 40%)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div 
            className="flex items-center justify-between p-3 rounded-xl"
            style={{
              background: 'linear-gradient(145deg, hsl(0 0% 11%) 0%, hsl(0 0% 7%) 100%)',
              border: '1px solid hsl(0 0% 16%)',
            }}
          >
            {/* Left: Word count */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-500 tracking-wider tabular-nums">
                {wordCount} words
              </span>
            </div>

            {/* Center: Actions */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-all duration-300 text-sm text-neutral-300"
                >
                  <Languages size={16} />
                  <span className="hidden sm:inline">{languageLabels[selectedLanguage]}</span>
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
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-0 mb-2 z-50 bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden shadow-2xl"
                      >
                        {(['english', 'telugu', 'hindi'] as Language[]).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => {
                              setSelectedLanguage(lang);
                              setIsLanguageMenuOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm hover:bg-red-900/20 transition-colors flex items-center gap-2 ${
                              selectedLanguage === lang ? 'text-red-400 bg-red-900/10' : 'text-neutral-300'
                            }`}
                          >
                            {selectedLanguage === lang && <Check size={14} />}
                            <span className={selectedLanguage === lang ? '' : 'ml-5'}>
                              {languageLabels[lang]}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Convert Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={convertContent}
                disabled={isConverting || !content.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-900/40 text-red-300 hover:from-red-900/40 hover:to-red-800/30 transition-all duration-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isConverting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                <span className="hidden sm:inline">Convert</span>
              </motion.button>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleManualSave}
                disabled={!content.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300 hover:bg-neutral-800 transition-all duration-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                <span className="hidden sm:inline">Save</span>
              </motion.button>

              {/* Publish Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowPublishDialog(true)}
                disabled={!content.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-900/40 to-emerald-800/30 border border-green-800/50 text-green-300 hover:from-green-900/50 hover:to-emerald-800/40 transition-all duration-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                <span className="hidden sm:inline">Publish</span>
              </motion.button>
            </div>

            {/* Right: Language indicator */}
            <div className="text-xs text-neutral-600 tracking-wider hidden sm:block">
              {selectedLanguage !== 'english' && languageLabels[selectedLanguage]}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Publish Confirmation Dialog */}
      <AnimatePresence>
        {showPublishDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={() => setShowPublishDialog(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            >
              <div 
                className="p-6 rounded-xl text-center"
                style={{
                  background: 'linear-gradient(145deg, hsl(0 0% 10%) 0%, hsl(0 0% 6%) 100%)',
                  border: '1px solid hsl(0 0% 15%)',
                  boxShadow: '0 30px 80px -20px hsl(0 0% 0% / 0.9)',
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-900/30 border border-green-800/50 flex items-center justify-center"
                >
                  <Send size={28} className="text-green-400" />
                </motion.div>
                
                <h3 
                  className="text-xl mb-2"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Publish Story?
                </h3>
                <p className="text-neutral-400 text-sm mb-6">
                  "{title}" will be visible to all readers
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPublishDialog(false)}
                    className="flex-1 py-3 border border-neutral-700 rounded-lg text-neutral-300 hover:bg-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="flex-1 py-3 bg-green-900/40 border border-green-800/50 rounded-lg text-green-300 hover:bg-green-900/60 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Send size={16} />
                        Publish
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Particles */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1 h-1 rounded-full bg-red-400/15 pointer-events-none"
          style={{
            left: `${25 + i * 25}%`,
            top: `${35 + (i % 2) * 30}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
};

export default WriterStudio;
