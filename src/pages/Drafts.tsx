import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText, Trash2, Clock, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDrafts, Draft } from '@/hooks/useDrafts';
import { toast } from 'sonner';

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

const DraftCard = ({ 
  draft, 
  onOpen, 
  onDelete,
  onRename,
  index 
}: { 
  draft: Draft; 
  onOpen: () => void; 
  onDelete: () => void;
  onRename: (newTitle: string) => void;
  index: number;
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(draft.title);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleRenameSubmit = () => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== draft.title) {
      onRename(trimmed);
    } else {
      setRenameValue(draft.title);
    }
    setIsRenaming(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative"
    >
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        className="p-6 rounded-xl cursor-pointer transition-all duration-300"
        style={{
          background: 'linear-gradient(145deg, hsl(0 0% 10%) 0%, hsl(0 0% 6%) 100%)',
          border: '1px solid hsl(0 0% 15%)',
          boxShadow: '0 10px 40px -10px hsl(0 0% 0% / 0.5)',
        }}
        onClick={onOpen}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-900/20 border border-red-900/30">
              <FileText size={18} className="text-red-400" />
            </div>
            <div>
              {isRenaming ? (
                <input
                  ref={inputRef}
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={handleRenameSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubmit();
                    if (e.key === 'Escape') { setRenameValue(draft.title); setIsRenaming(false); }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                  className="text-lg text-white font-medium bg-transparent border-b border-red-900/50 outline-none max-w-[250px]"
                  style={{ fontFamily: 'Georgia, serif' }}
                />
              ) : (
                <h3 
                  className="text-lg text-white font-medium truncate max-w-[250px]"
                  style={{ fontFamily: 'Georgia, serif' }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsRenaming(true);
                  }}
                >
                  {draft.title}
                </h3>
              )}
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-neutral-500 flex items-center gap-1">
                  <Clock size={12} />
                  {formatRelativeTime(draft.lastEdited)}
                </span>
                <span className="text-xs text-neutral-600">•</span>
                <span className="text-xs text-neutral-500">
                  {draft.wordCount} words
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="p-2 rounded-lg hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-white"
            >
              <Edit3 size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="p-2 rounded-lg hover:bg-red-900/20 transition-colors text-neutral-400 hover:text-red-400"
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>
        
        <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
          {draft.content.substring(0, 150)}
          {draft.content.length > 150 && '...'}
        </p>
      </motion.div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center rounded-xl z-10"
            style={{ background: 'hsl(0 0% 5% / 0.95)' }}
          >
            <div className="text-center p-4">
              <p className="text-white mb-4">Delete this draft?</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 text-sm border border-neutral-600 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 text-sm bg-red-900/50 border border-red-900 rounded-lg text-red-300 hover:bg-red-900/70 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Drafts = () => {
  const navigate = useNavigate();
  const { drafts, deleteDraft, updateDraft, getDraft } = useDrafts();

  const handleOpenDraft = (draft: Draft) => {
    navigate('/write', { state: { draft } });
  };

  const handleDeleteDraft = (id: string) => {
    deleteDraft(id);
    toast.success('Draft deleted');
  };

  const handleRenameDraft = (id: string, newTitle: string) => {
    const draft = getDraft(id);
    if (draft) {
      updateDraft(id, newTitle, draft.content, draft.language);
      toast.success('Draft renamed');
    }
  };

  return (
    <div 
      className="min-h-screen bg-black text-white"
      style={{ perspective: '2000px' }}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, hsl(350 40% 6% / 0.4) 0%, transparent 50%)',
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, hsl(0 0% 0% / 0.8) 100%)',
          }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
        style={{
          background: 'linear-gradient(180deg, hsl(0 0% 0%) 0%, transparent 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/write')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm tracking-wider">Back to Editor</span>
          </motion.button>
          
          <h1 
            className="text-xl tracking-[0.1em]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Drafts
          </h1>
          
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {drafts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <FileText size={48} className="mx-auto text-neutral-600 mb-4" />
              <h2 
                className="text-xl text-neutral-400 mb-2"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                No drafts yet
              </h2>
              <p className="text-sm text-neutral-500 mb-6">
                Start writing and your drafts will appear here
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/write')}
                className="px-6 py-3 bg-red-900/30 border border-red-900/50 rounded-lg text-red-300 hover:bg-red-900/50 transition-colors"
              >
                Start Writing
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {drafts.map((draft, index) => (
                  <DraftCard
                    key={draft.id}
                    draft={draft}
                    index={index}
                    onOpen={() => handleOpenDraft(draft)}
                    onDelete={() => handleDeleteDraft(draft.id)}
                    onRename={(newTitle) => handleRenameDraft(draft.id, newTitle)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Drafts;
