import React, { memo, useCallback } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Colors } from '@/constants/colors';

import { AppText } from './AppText';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ComponentType<{ size: number; color: string }>;
  disabled?: boolean;
  loading?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-12 px-3 py-2 rounded-lg',
  md: 'min-h-12 px-4 py-3 rounded-xl',
  lg: 'min-h-14 px-6 py-3.5 rounded-xl',
};

function variantClasses(variant: ButtonVariant): string {
  switch (variant) {
    case 'primary':
      return 'bg-[#A855F7] active:bg-[#7C3AED]';
    case 'secondary':
      return 'bg-[#242424] border border-[#383838] active:bg-[#2C2C2C]';
    case 'ghost':
      return 'bg-transparent active:bg-[#242424]';
    case 'danger':
      return 'bg-[#DC2626] active:bg-[#B91C1C]';
  }
}

function labelColor(variant: ButtonVariant): string {
  switch (variant) {
    case 'primary':
    case 'danger':
      return '#FFFFFF';
    case 'secondary':
      return Colors.text.primary;
    case 'ghost':
      return Colors.accent.primary;
  }
}

export const Button = memo<ButtonProps>(
  ({
    label,
    onPress,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    disabled = false,
    loading = false,
  }) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
      if (!disabled && !loading) {
        scale.value = withSpring(0.97, { damping: 20, stiffness: 400 });
      }
    }, [disabled, loading, scale]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, { damping: 20, stiffness: 400 });
    }, [scale]);

    const isBusy = disabled || loading;
    const textColor = labelColor(variant);

    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isBusy}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: isBusy, busy: loading }}
        className={`flex-row items-center justify-center gap-2 ${sizeClasses[size]} ${variantClasses(variant)}`}
        style={animatedStyle}
      >
        {loading ? (
          <ActivityIndicator
            color={
              variant === 'primary' || variant === 'danger'
                ? '#FFFFFF'
                : Colors.accent.primary
            }
            size="small"
          />
        ) : (
          <>
            {Icon ? <Icon size={20} color={textColor} /> : null}
            <AppText
              variant="bodyMedium"
              color={textColor}
              className="text-center"
            >
              {label}
            </AppText>
          </>
        )}
      </AnimatedPressable>
    );
  }
);

Button.displayName = 'Button';
