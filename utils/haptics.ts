import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

async function safeHaptic(run: () => Promise<void>): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  try {
    await run();
  } catch {
    /* haptics недоступны на части устройств/эмуляторов */
  }
}

/** Копирование в буфер — лёгкий отклик */
export function hapticsCopy(): Promise<void> {
  return safeHaptic(() =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  );
}

/** Успешное сохранение */
export function hapticsSaveSuccess(): Promise<void> {
  return safeHaptic(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  );
}

/** Удаление */
export function hapticsDeleteHeavy(): Promise<void> {
  return safeHaptic(() =>
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
  );
}
