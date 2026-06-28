import { useState, useRef, useCallback, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { VoiceStatus } from '../types';

// 尝试加载原生语音模块（Expo Go 中不可用）
let Voice: any = null;
try {
  Voice = require('react-native-voice').default;
} catch (e) {
  // Expo Go 中没有原生模块，用浏览器 Web Speech API 或手动输入
}

interface UseVoiceReturn {
  status: VoiceStatus;
  text: string;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  reset: () => void;
  hasNativeVoice: boolean;
}

export function useVoice(): UseVoiceReturn {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const partialRef = useRef('');
  const hasNativeVoice = Voice !== null;

  // --- 原生语音事件 ---
  useEffect(() => {
    if (!Voice) return;

    const onResults = (e: any) => {
      if (e.value?.length) {
        setText(e.value[0]);
      }
      setStatus('idle');
    };
    const onPartial = (e: any) => {
      if (e.value?.length) {
        partialRef.current = e.value[0];
        setText(e.value[0]);
      }
    };
    const onError = (e: any) => {
      setError(e.error?.message || '语音识别失败');
      setStatus('error');
    };
    const onEnd = () => setStatus('processing');

    Voice.onSpeechResults = onResults;
    Voice.onSpeechPartial = onPartial;
    Voice.onSpeechError = onError;
    Voice.onSpeechEnd = onEnd;

    return () => {
      Voice.onSpeechResults = null;
      Voice.onSpeechPartial = null;
      Voice.onSpeechError = null;
      Voice.onSpeechEnd = null;
    };
  }, []);

  const startListening = useCallback(async () => {
    if (!Voice) {
      setError('原生语音模块不可用（Expo Go 模式），请使用手动输入');
      setStatus('error');
      return;
    }
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
    if (!Voice) return;
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

  return { status, text, error, startListening, stopListening, reset, hasNativeVoice };
}
