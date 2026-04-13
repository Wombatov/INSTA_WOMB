import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';

import { hapticsCopy } from '@/utils/haptics';

const COPIED_MS = 2000;

export function useCopyToClipboard(text: string) {
  const [isCopied, setIsCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const copy = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(text);
      await hapticsCopy();
      setIsCopied(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setIsCopied(false);
        timerRef.current = null;
      }, COPIED_MS);
    } catch {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [text]);

  return { copy, isCopied };
}
