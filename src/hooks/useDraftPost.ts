import { useEffect } from 'react';

interface DraftPost {
  content: string;
  mediaCount: number;
  isPrivate: boolean;
  timestamp: number;
}

const DRAFT_STORAGE_KEY = 'post-draft';
const DRAFT_EXPIRY_HOURS = 24;

/**
 * Hook to auto-save and load post drafts from localStorage
 */
export function useDraftPost(content: string, mediaCount: number, isPrivate: boolean) {
  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  };

  // Load draft
  const loadDraft = (): DraftPost | null => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!saved) return null;

      const draft: DraftPost = JSON.parse(saved);

      // Check if draft is expired
      const hoursSinceCreation = (Date.now() - draft.timestamp) / (1000 * 60 * 60);
      if (hoursSinceCreation > DRAFT_EXPIRY_HOURS) {
        clearDraft();
        return null;
      }

      return draft;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  };

  // Check if draft exists
  const hasDraft = (): boolean => {
    const draft = loadDraft();
    return draft !== null;
  };

  // Auto-save draft
  useEffect(() => {
    if (!content && mediaCount === 0) return; // Don't save empty drafts

    const draft: DraftPost = {
      content,
      mediaCount,
      isPrivate,
      timestamp: Date.now(),
    };

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  }, [content, mediaCount, isPrivate]);

  return {
    loadDraft,
    clearDraft,
    hasDraft,
  };
}
