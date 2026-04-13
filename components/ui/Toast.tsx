import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Colors } from '@/constants/colors';

import { AppText } from './AppText';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ShowToastOptions {
  message: string;
  variant: ToastVariant;
}

export interface ToastContextValue {
  showToast: (options: ShowToastOptions) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 2500;
const ANIM_IN_MS = 200;
const ANIM_OUT_MS = 200;

function toastBackground(variant: ToastVariant): string {
  switch (variant) {
    case 'success':
      return Colors.status.ok;
    case 'error':
      return Colors.status.error;
    case 'info':
      return Colors.accent.primary;
  }
}

function ToastSurface({
  options,
  onDismissComplete,
}: {
  options: ShowToastOptions;
  onDismissComplete: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-16);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const dismiss = useCallback(() => {
    opacity.value = withTiming(0, { duration: ANIM_OUT_MS });
    translateY.value = withTiming(
      -16,
      { duration: ANIM_OUT_MS },
      (finished) => {
        if (finished) {
          runOnJS(onDismissComplete)();
        }
      }
    );
  }, [onDismissComplete, opacity, translateY]);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: ANIM_IN_MS });
    translateY.value = withTiming(0, { duration: ANIM_IN_MS });
    const t = setTimeout(() => {
      dismiss();
    }, TOAST_DURATION_MS);
    return () => clearTimeout(t);
  }, [dismiss, opacity, translateY]);

  const bg = toastBackground(options.variant);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        animatedStyle,
        {
          position: 'absolute',
          left: 16,
          right: 16,
          top: insets.top + 8,
          maxWidth: width - 32,
          zIndex: 9999,
        },
      ]}
    >
      <View
        className="rounded-xl px-4 py-3 shadow-lg"
        style={{ backgroundColor: bg }}
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
      >
        <AppText variant="bodyMedium" color="#FFFFFF">
          {options.message}
        </AppText>
      </View>
    </Animated.View>
  );
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [active, setActive] = useState<ShowToastOptions | null>(null);

  const showToast = useCallback((options: ShowToastOptions) => {
    setActive(options);
  }, []);

  const handleDismissComplete = useCallback(() => {
    setActive(null);
  }, []);

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      <View className="flex-1">
        {children}
        {active ? (
          <ToastSurface
            key={`${active.message}-${active.variant}`}
            options={active}
            onDismissComplete={handleDismissComplete}
          />
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}
