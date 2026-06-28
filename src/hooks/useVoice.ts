import { useState, useRef, useCallback } from 'react';
import Voice from 'react-native-voice';
import { VoiceStatus } from '../types';

interface UseVoiceReturn {
  status: VoiceStatus;
  text: string;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  reset: () => void;
}

export function useVoice(): UseVoiceReturn {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const partialRef = useRef('');

  const onSpeechResults = useCallback((e: any) => {
    if (e.value && e.value.length > 0) {
      setText(e.value[0]);
    }
    setStatus('idle');
  }, []);

  const onSpeechPartial = useCallback((e: any) => {
    if (e.value && e.value.length > 0) {
      partialRef.current = e.value[0];
      setText(e.value[0]);
    }
  }, []);

  const onSpeechError = useCallback((e: any) => {
    console.warn('Voice error:', e);
    setError(e.error?.message || '语音识别失败');
    setStatus('error');
  }, []);

  const onSpeechEnd = useCallback(() => {
    setStatus('processing');
  }, []);

  // 注册事件
  Voice.onSpeechResults = onSpeechResults;
  Voice.onSpeechPartial = onSpeechPartial;
  Voice.onSpeechError = onSpeechError;
  Voice.onSpeechEnd = onSpeechEnd;

  const startListening = useCallback(async () => {
    try {
      setError(null);
      setText('');
      partialRef.current = '';
      setStatus('listening');
      await Voice.start('zh-CN');
    } catch (err: any) {
      setError(err.message || '启动语音失败');
      setStatus('error');
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
      setStatus('processing');
    } catch (err: any) {
      // ignore
    }
  }, []);

  const reset = useCallback(() => {
    setText('');
    setError(null);
    setStatus('idle');
    partialRef.current = '';
  }, []);

  return { status, text, error, startListening, stopListening, reset };
}
