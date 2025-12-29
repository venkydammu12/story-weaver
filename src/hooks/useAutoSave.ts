import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions {
  storyId: string | null;
  content: string;
  title: string;
  language: string;
  debounceMs?: number;
}

export const useAutoSave = ({
  storyId,
  content,
  title,
  language,
  debounceMs = 1500,
}: UseAutoSaveOptions) => {
  const { user } = useAuth();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(storyId);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  const saveStory = useCallback(async () => {
    if (!user) return;

    setSaveStatus('saving');

    try {
      const wordCount = content.split(/\s+/).filter(Boolean).length;

      if (currentStoryId) {
        // Update existing story
        const { error } = await supabase
          .from('stories')
          .update({
            content,
            title,
            language,
            word_count: wordCount,
          })
          .eq('id', currentStoryId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new story
        const { data, error } = await supabase
          .from('stories')
          .insert({
            user_id: user.id,
            content,
            title,
            language,
            word_count: wordCount,
          })
          .select('id')
          .single();

        if (error) throw error;
        if (data) {
          setCurrentStoryId(data.id);
        }
      }

      setSaveStatus('saved');
      setLastSaved(new Date());

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error saving story:', error);
      setSaveStatus('error');
    }
  }, [user, currentStoryId, content, title, language]);

  // Debounced auto-save
  useEffect(() => {
    // Skip the first render to avoid saving empty content
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only auto-save if there's content and a user
    if (!content.trim() || !user) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      saveStory();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, title, language, debounceMs, saveStory, user]);

  const manualSave = useCallback(async (customTitle?: string) => {
    if (!user) return;

    setSaveStatus('saving');

    try {
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      const finalTitle = customTitle || title;

      if (currentStoryId) {
        const { error } = await supabase
          .from('stories')
          .update({
            content,
            title: finalTitle,
            language,
            word_count: wordCount,
          })
          .eq('id', currentStoryId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('stories')
          .insert({
            user_id: user.id,
            content,
            title: finalTitle,
            language,
            word_count: wordCount,
          })
          .select('id')
          .single();

        if (error) throw error;
        if (data) {
          setCurrentStoryId(data.id);
        }
      }

      setSaveStatus('saved');
      setLastSaved(new Date());

      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);

      return true;
    } catch (error) {
      console.error('Error saving story:', error);
      setSaveStatus('error');
      return false;
    }
  }, [user, currentStoryId, content, title, language]);

  return {
    saveStatus,
    lastSaved,
    currentStoryId,
    manualSave,
    setCurrentStoryId,
  };
};
