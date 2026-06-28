import { useState, useCallback } from 'react';
import { VoiceStatus, CategorizeResult, RecordType } from '../types';
import { categorize, getDefaultTitle } from '../utils/categorize';

interface UseCategorizeReturn {
  result: CategorizeResult | null;
  showConfirm: boolean;
  categorizeText: (text: string) => void;
  confirmType: (type: RecordType) => void;
  reset: () => void;
  voiceStatus: VoiceStatus;
  setVoiceStatus: (s: VoiceStatus) => void;
}

export function useCategorize(): UseCategorizeReturn {
  const [result, setResult] = useState<CategorizeResult | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');

  const categorizeText = useCallback((text: string) => {
    if (!text.trim()) return;
    const cat = categorize(text);
    setResult(cat);
    setShowConfirm(true);
  }, []);

  const confirmType = useCallback((type: RecordType) => {
    if (!result) return;
    setResult({ ...result, type, title: type === result.type ? result.title : getDefaultTitle(type) });
    setShowConfirm(false);
  }, [result]);

  const reset = useCallback(() => {
    setResult(null);
    setShowConfirm(false);
  }, []);

  return { result, showConfirm, categorizeText, confirmType, reset, voiceStatus, setVoiceStatus };
}
