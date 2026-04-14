import * as Crypto from 'expo-crypto';

/** Стабильные UUID на iOS/Android/Web без полифилла `getRandomValues` для пакета `uuid`. */
export function createId(): string {
  return Crypto.randomUUID();
}
