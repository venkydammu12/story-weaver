import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Languages, Sparkles, Loader2,
  Save, FolderOpen, Send, Check, ChevronDown,
  FileText, Clock, Trash2, Edit3, X, Copy
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useDrafts, Draft } from '@/hooks/useDrafts';
import { supabase } from '@/integrations/supabase/client';

// Format relative time helper
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

type Language = 'english' | 'telugu' | 'hindi';

const languageLabels: Record<Language, string> = {
  english: 'English',
  telugu: 'తెలుగు',
  hindi: 'हिंदी'
};

type SaveStatus = 'idle' | 'saving' | 'saved';

const SaveStatusIndicator = ({ status, lastSaved, draftId }: { 
  status: SaveStatus; 
  lastSaved: Date | null;
  draftId: string | null;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 text-xs tracking-wider"
    >
      {status === 'saving' ? (
        <span className="flex items-center gap-1.5 text-neutral-400">
          <Loader2 size={12} className="animate-spin" />
          <span>Saving...</span>
        </span>
      ) : status === 'saved' ? (
        <motion.span 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1.5 text-green-400/80"
        >
          <Check size={12} />
          <span>Draft • Saved</span>
        </motion.span>
      ) : draftId ? (
        <span className="text-neutral-500">Draft</span>
      ) : (
        <span className="text-neutral-600">New Story</span>
      )}
    </motion.div>
  );
};

const WriterStudio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { drafts, saveDraft, deleteDraft, draftExists, duplicateDraft } = useDrafts();
  
  // Load draft from navigation state if present
  const initialDraft = location.state?.draft as Draft | undefined;
  
  const [content, setContent] = useState(initialDraft?.content || '');
  const [title, setTitle] = useState(initialDraft?.title || '');
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(initialDraft?.id || null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>((initialDraft?.language as Language) || 'english');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showDraftsPanel, setShowDraftsPanel] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitleInput, setSaveTitleInput] = useState('');
  const [deletingDraftId, setDeletingDraftId] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentDraftIdRef = useRef<string | null>(currentDraftId);

  // Keep ref in sync
  useEffect(() => {
    currentDraftIdRef.current = currentDraftId;
  }, [currentDraftId]);

  // Auto-save logic - only saves if we have an existing draft ID
  useEffect(() => {
    if (!content.trim()) return;
    if (!currentDraftId) return; // Don't auto-save if no draft exists yet
    
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      // Double-check we still have the same draft ID
      if (currentDraftIdRef.current && draftExists(currentDraftIdRef.current)) {
        setSaveStatus('saving');
        
        saveDraft(
          currentDraftIdRef.current, 
          title || 'Untitled Story', 
          content, 
          selectedLanguage
        );
        
        setSaveStatus('saved');
        setLastSaved(new Date());
        
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    }, 1500);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [content, title, selectedLanguage, currentDraftId, saveDraft, draftExists]);

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
    if (!title.trim()) {
      toast.error('Please give your story a title');
      return;
    }

    setIsPublishing(true);

    try {
      // Get authenticated session for the request
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error('Please sign in to publish stories');
        setIsPublishing(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/publish-story`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            title: title.trim().slice(0, 200),
            content: content.trim().slice(0, 100000),
            language: selectedLanguage,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Publishing failed');
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

  // Open save dialog for manual save (only when no draft exists or changing title)
  const handleSaveClick = useCallback(() => {
    if (!content.trim()) {
      toast.error('Nothing to save');
      return;
    }

    // If draft already exists, just save directly
    if (currentDraftId && draftExists(currentDraftId)) {
      setSaveStatus('saving');
      saveDraft(currentDraftId, title || 'Untitled Story', content, selectedLanguage);
      setSaveStatus('saved');
      setLastSaved(new Date());
      toast.success('Draft saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      return;
    }

    // No draft exists - show dialog to get title
    setSaveTitleInput(title || '');
    setShowSaveDialog(true);
  }, [content, title, currentDraftId, draftExists, saveDraft, selectedLanguage]);

  // Create new draft with title from dialog
  const handleCreateDraft = useCallback(() => {
    const finalTitle = saveTitleInput.trim() || 'Untitled Story';
    
    setSaveStatus('saving');
    setTitle(finalTitle);
    
    // Create new draft and get the ID
    const newId = saveDraft(null, finalTitle, content, selectedLanguage);
    setCurrentDraftId(newId);
    currentDraftIdRef.current = newId;
    
    setSaveStatus('saved');
    setLastSaved(new Date());
    setShowSaveDialog(false);
    toast.success('Draft created');
    
    setTimeout(() => setSaveStatus('idle'), 2000);
  }, [content, saveTitleInput, selectedLanguage, saveDraft]);

  // Save as new draft (duplicate)
  const handleSaveAsNew = useCallback(() => {
    if (!content.trim()) {
      toast.error('Nothing to save');
      return;
    }

    const newTitle = title ? `${title} (Copy)` : 'Untitled Story';
    const newId = saveDraft(null, newTitle, content, selectedLanguage);
    
    setCurrentDraftId(newId);
    currentDraftIdRef.current = newId;
    setTitle(newTitle);
    
    toast.success('Saved as new draft');
  }, [content, title, selectedLanguage, saveDraft]);

  // Open a draft for editing
  const handleOpenDraft = useCallback((draft: Draft) => {
    setContent(draft.content);
    setTitle(draft.title);
    setCurrentDraftId(draft.id);
    currentDraftIdRef.current = draft.id;
    setSelectedLanguage((draft.language as Language) || 'english');
    setShowDraftsPanel(false);
    setSaveStatus('idle');
    setLastSaved(null);
    toast.success('Draft opened');
  }, []);

  // Start a new story (clear editor)
  const handleNewStory = useCallback(() => {
    setContent('');
    setTitle('');
    setCurrentDraftId(null);
    currentDraftIdRef.current = null;
    setSelectedLanguage('english');
    setSaveStatus('idle');
    setLastSaved(null);
    setShowDraftsPanel(false);
    toast.success('New story started');
  }, []);

  // Delete a draft
  const handleDeleteDraft = useCallback((id: string) => {
    deleteDraft(id);
    setDeletingDraftId(null);
    if (currentDraftId === id) {
      setCurrentDraftId(null);
      currentDraftIdRef.current = null;
      setContent('');
      setTitle('');
      setSaveStatus('idle');
      setLastSaved(null);
    }
    toast.success('Draft deleted');
  }, [deleteDraft, currentDraftId]);

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
            <SaveStatusIndicator status={saveStatus} lastSaved={lastSaved} draftId={currentDraftId} />
          </div>

          {/* Drafts Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDraftsPanel(true)}
            className="relative p-2 rounded-full border border-neutral-700 hover:border-red-900/50 hover:bg-red-900/10 transition-all duration-300 text-neutral-400 hover:text-white"
          >
            <FolderOpen size={18} />
            {drafts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-900 text-[10px] rounded-full flex items-center justify-center text-red-200">
                {drafts.length}
              </span>
            )}
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
                onClick={handleSaveClick}
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

            {/* Right: Save as New option (only if draft exists) */}
            <div className="hidden sm:block">
              {currentDraftId && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveAsNew}
                  className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors flex items-center gap-1"
                >
                  <Copy size={12} />
                  Save as New
                </motion.button>
              )}
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
                  "{title || 'Untitled Story'}" will be visible to all readers
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

      {/* Save Draft Dialog (only for new drafts) */}
      <AnimatePresence>
        {showSaveDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50"
              onClick={() => setShowSaveDialog(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
            >
              <div 
                className="p-6 rounded-xl"
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
                  className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-900/30 border border-red-900/40 flex items-center justify-center"
                >
                  <Save size={24} className="text-red-400" />
                </motion.div>
                
                <h3 
                  className="text-xl mb-2 text-center"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Create Draft
                </h3>
                <p className="text-neutral-400 text-sm mb-5 text-center">
                  Give your story a title to save it
                </p>
                
                <input
                  type="text"
                  value={saveTitleInput}
                  onChange={(e) => setSaveTitleInput(e.target.value)}
                  placeholder="Story title..."
                  className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-red-900/50 mb-5"
                  style={{ fontFamily: 'Georgia, serif' }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateDraft();
                  }}
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSaveDialog(false)}
                    className="flex-1 py-3 border border-neutral-700 rounded-lg text-neutral-300 hover:bg-neutral-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateDraft}
                    className="flex-1 py-3 bg-red-900/40 border border-red-900/50 rounded-lg text-red-300 hover:bg-red-900/60 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    Create Draft
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Drafts Side Panel */}
      <AnimatePresence>
        {showDraftsPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowDraftsPanel(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm z-50 overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, hsl(0 0% 6%) 0%, hsl(0 0% 4%) 100%)',
                borderLeft: '1px solid hsl(0 0% 12%)',
              }}
            >
              {/* Panel Header */}
              <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-900/20 border border-red-900/30">
                    <FolderOpen size={18} className="text-red-400" />
                  </div>
                  <h2 
                    className="text-lg"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Drafts
                  </h2>
                  {drafts.length > 0 && (
                    <span className="text-xs text-neutral-500">({drafts.length})</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNewStory}
                    className="px-3 py-1.5 text-xs rounded-lg border border-neutral-700 hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white flex items-center gap-1.5"
                  >
                    <Edit3 size={12} />
                    New Story
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDraftsPanel(false)}
                    className="p-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Drafts List */}
              <div className="overflow-y-auto h-[calc(100vh-80px)] p-4">
                {drafts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <FileText size={40} className="mx-auto text-neutral-700 mb-3" />
                    <p className="text-neutral-500 text-sm mb-1">No drafts yet</p>
                    <p className="text-neutral-600 text-xs">Your saved stories will appear here</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {drafts.map((draft, index) => (
                      <motion.div
                        key={draft.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative"
                      >
                        <motion.div
                          whileHover={{ scale: 1.02, x: -4 }}
                          className="p-4 rounded-xl cursor-pointer transition-all duration-300"
                          style={{
                            background: currentDraftId === draft.id 
                              ? 'linear-gradient(145deg, hsl(350 30% 12%) 0%, hsl(350 20% 8%) 100%)'
                              : 'linear-gradient(145deg, hsl(0 0% 9%) 0%, hsl(0 0% 6%) 100%)',
                            border: currentDraftId === draft.id 
                              ? '1px solid hsl(350 40% 25%)'
                              : '1px solid hsl(0 0% 14%)',
                          }}
                          onClick={() => handleOpenDraft(draft)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 
                                  className="text-sm text-white font-medium truncate"
                                  style={{ fontFamily: 'Georgia, serif' }}
                                >
                                  {draft.title}
                                </h4>
                                {currentDraftId === draft.id && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/30 text-red-400 border border-red-900/40">
                                    Current
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                                <Clock size={11} />
                                <span>{formatRelativeTime(draft.lastEdited)}</span>
                                <span className="text-neutral-700">•</span>
                                <span>{draft.wordCount} words</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDraft(draft);
                                }}
                                className="p-1.5 rounded-lg hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-white"
                              >
                                <Edit3 size={14} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingDraftId(draft.id);
                                }}
                                className="p-1.5 rounded-lg hover:bg-red-900/30 transition-colors text-neutral-400 hover:text-red-400"
                              >
                                <Trash2 size={14} />
                              </motion.button>
                            </div>
                          </div>
                          
                          <p className="text-xs text-neutral-500 mt-2 line-clamp-2">
                            {draft.content.substring(0, 100)}
                            {draft.content.length > 100 && '...'}
                          </p>
                        </motion.div>

                        {/* Delete Confirmation Overlay */}
                        <AnimatePresence>
                          {deletingDraftId === draft.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 flex items-center justify-center rounded-xl z-10"
                              style={{ background: 'hsl(0 0% 5% / 0.95)' }}
                            >
                              <div className="text-center p-3">
                                <p className="text-white text-sm mb-3">Delete draft?</p>
                                <div className="flex gap-2 justify-center">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeletingDraftId(null);
                                    }}
                                    className="px-3 py-1.5 text-xs border border-neutral-600 rounded-lg hover:bg-neutral-800 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteDraft(draft.id);
                                    }}
                                    className="px-3 py-1.5 text-xs bg-red-900/50 border border-red-900 rounded-lg text-red-300 hover:bg-red-900/70 transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Particles */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1 h-1 rounded-full bg-red-500/20 pointer-events-none"
          style={{
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i,
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
