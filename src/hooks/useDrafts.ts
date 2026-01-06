import { useState, useEffect, useCallback } from 'react';

export interface Draft {
  id: string;
  title: string;
  content: string;
  language: string;
  lastEdited: string;
  wordCount: number;
}

const DRAFTS_STORAGE_KEY = 'story-drafts';

export const useDrafts = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  // Load drafts from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (stored) {
      try {
        setDrafts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse drafts:', e);
      }
    }
  }, []);

  // Save drafts to localStorage whenever they change
  const saveDraftsToStorage = useCallback((newDrafts: Draft[]) => {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(newDrafts));
    setDrafts(newDrafts);
  }, []);

  const saveDraft = useCallback((draft: Omit<Draft, 'id' | 'lastEdited' | 'wordCount'> & { id?: string }) => {
    const wordCount = draft.content.split(/\s+/).filter(Boolean).length;
    const now = new Date().toISOString();
    
    setDrafts(current => {
      let newDrafts: Draft[];
      
      if (draft.id) {
        // Update existing draft
        newDrafts = current.map(d => 
          d.id === draft.id 
            ? { ...d, ...draft, lastEdited: now, wordCount }
            : d
        );
      } else {
        // Create new draft
        const newDraft: Draft = {
          id: `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: draft.title,
          content: draft.content,
          language: draft.language,
          lastEdited: now,
          wordCount,
        };
        newDrafts = [newDraft, ...current];
      }
      
      saveDraftsToStorage(newDrafts);
      return newDrafts;
    });
  }, [saveDraftsToStorage]);

  const deleteDraft = useCallback((id: string) => {
    setDrafts(current => {
      const newDrafts = current.filter(d => d.id !== id);
      saveDraftsToStorage(newDrafts);
      return newDrafts;
    });
  }, [saveDraftsToStorage]);

  const getDraft = useCallback((id: string) => {
    return drafts.find(d => d.id === id);
  }, [drafts]);

  const autoSaveDraft = useCallback((id: string | null, title: string, content: string, language: string) => {
    if (!content.trim() && !title.trim()) return null;
    
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const now = new Date().toISOString();
    
    let draftId = id;
    
    setDrafts(current => {
      let newDrafts: Draft[];
      
      if (id) {
        // Update existing draft
        newDrafts = current.map(d => 
          d.id === id 
            ? { ...d, title, content, language, lastEdited: now, wordCount }
            : d
        );
      } else {
        // Create new draft
        draftId = `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newDraft: Draft = {
          id: draftId,
          title: title || 'Untitled Story',
          content,
          language,
          lastEdited: now,
          wordCount,
        };
        newDrafts = [newDraft, ...current];
      }
      
      saveDraftsToStorage(newDrafts);
      return newDrafts;
    });
    
    return draftId;
  }, [saveDraftsToStorage]);

  return {
    drafts,
    saveDraft,
    deleteDraft,
    getDraft,
    autoSaveDraft,
  };
};
