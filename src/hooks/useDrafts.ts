import { useState, useEffect, useCallback, useRef } from 'react';

export interface Draft {
  id: string;
  title: string;
  content: string;
  language: string;
  lastEdited: string;
  wordCount: number;
}

const DRAFTS_STORAGE_KEY = 'story-drafts';

// Generate a unique draft ID
const generateDraftId = () => `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useDrafts = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const draftsRef = useRef<Draft[]>([]);

  // Keep ref in sync with state for immediate access
  useEffect(() => {
    draftsRef.current = drafts;
  }, [drafts]);

  // Load drafts from localStorage on mount - with cleanup
  useEffect(() => {
    const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Draft[] = JSON.parse(stored);
        
        // Clean up: remove empty/untitled drafts with no content
        const cleaned = parsed.filter(d => 
          d.content && d.content.trim().length > 0
        );
        
        // Deduplicate: keep the most recent version based on title+content similarity
        const seen = new Map<string, Draft>();
        for (const draft of cleaned) {
          const key = `${draft.title}::${draft.content.trim().substring(0, 200)}`;
          const existing = seen.get(key);
          if (!existing || new Date(draft.lastEdited) > new Date(existing.lastEdited)) {
            seen.set(key, draft);
          }
        }
        
        const deduplicated = Array.from(seen.values())
          .sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
        
        // Save cleaned version back if different
        if (deduplicated.length !== parsed.length) {
          localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(deduplicated));
        }
        
        setDrafts(deduplicated);
        draftsRef.current = deduplicated;
      } catch (e) {
        console.error('Failed to parse drafts:', e);
      }
    }
  }, []);

  // Save drafts to localStorage
  const saveDraftsToStorage = useCallback((newDrafts: Draft[]) => {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(newDrafts));
    draftsRef.current = newDrafts;
    setDrafts(newDrafts);
  }, []);

  // Check if a draft exists by ID
  const draftExists = useCallback((id: string): boolean => {
    return draftsRef.current.some(d => d.id === id);
  }, []);

  // Get a draft by ID (using ref for immediate access)
  const getDraft = useCallback((id: string): Draft | undefined => {
    return draftsRef.current.find(d => d.id === id);
  }, []);

  // Create a new draft - returns the new draft ID
  const createDraft = useCallback((title: string, content: string, language: string): string => {
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const now = new Date().toISOString();
    const newId = generateDraftId();
    
    const newDraft: Draft = {
      id: newId,
      title: title || 'Untitled Story',
      content,
      language,
      lastEdited: now,
      wordCount,
    };
    
    const newDrafts = [newDraft, ...draftsRef.current];
    saveDraftsToStorage(newDrafts);
    
    return newId;
  }, [saveDraftsToStorage]);

  // Update an existing draft - returns true if successful
  const updateDraft = useCallback((id: string, title: string, content: string, language: string): boolean => {
    const existingDraft = draftsRef.current.find(d => d.id === id);
    if (!existingDraft) {
      return false;
    }

    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const now = new Date().toISOString();
    
    const newDrafts = draftsRef.current.map(d => 
      d.id === id 
        ? { ...d, title, content, language, lastEdited: now, wordCount }
        : d
    );
    
    saveDraftsToStorage(newDrafts);
    return true;
  }, [saveDraftsToStorage]);

  // Save draft - creates new if no ID, updates if ID exists
  // Returns the draft ID (new or existing)
  const saveDraft = useCallback((
    draftId: string | null, 
    title: string, 
    content: string, 
    language: string
  ): string => {
    // If we have an ID and the draft exists, update it
    if (draftId && draftExists(draftId)) {
      updateDraft(draftId, title, content, language);
      return draftId;
    }
    
    // Otherwise create a new draft
    return createDraft(title, content, language);
  }, [draftExists, updateDraft, createDraft]);

  // Delete a draft
  const deleteDraft = useCallback((id: string) => {
    const newDrafts = draftsRef.current.filter(d => d.id !== id);
    saveDraftsToStorage(newDrafts);
  }, [saveDraftsToStorage]);

  // Create a copy of an existing draft (Save as New)
  const duplicateDraft = useCallback((id: string): string | null => {
    const existingDraft = draftsRef.current.find(d => d.id === id);
    if (!existingDraft) return null;
    
    return createDraft(
      `${existingDraft.title} (Copy)`,
      existingDraft.content,
      existingDraft.language
    );
  }, [createDraft]);

  // Clear all drafts
  const clearAllDrafts = useCallback(() => {
    localStorage.removeItem(DRAFTS_STORAGE_KEY);
    draftsRef.current = [];
    setDrafts([]);
  }, []);

  return {
    drafts,
    saveDraft,
    createDraft,
    updateDraft,
    deleteDraft,
    getDraft,
    draftExists,
    duplicateDraft,
    clearAllDrafts,
  };
};
