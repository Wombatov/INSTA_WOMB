import React, { memo, useCallback, useEffect } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useThemeColors } from '@/hooks/use-theme-colors';

import { AppText } from './AppText';

const SPRING = { damping: 22, stiffness: 280 };

export interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const { height: SCREEN_H } = Dimensions.get('window');

export const BottomSheet = memo<BottomSheetProps>(
  ({ isVisible, onClose, children, title }) => {
    const theme = useThemeColors();
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();
    const translateY = useSharedValue(SCREEN_H);
    const backdropOpacity = useSharedValue(0);

    const sheetMaxHeight = Math.min(SCREEN_H * 0.75, height * 0.75);
    const hiddenOffset = sheetMaxHeight + 48;

    useEffect(() => {
      if (isVisible) {
        translateY.value = withSpring(0, SPRING);
        backdropOpacity.value = withSpring(1, SPRING);
      } else {
        translateY.value = withSpring(hiddenOffset, SPRING);
        backdropOpacity.value = withSpring(0, SPRING);
      }
    }, [backdropOpacity, hiddenOffset, isVisible, translateY]);

    const backdropStyle = useAnimatedStyle(() => ({
      opacity: backdropOpacity.value * 0.55,
    }));

    const sheetStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    const handleRequestClose = useCallback(() => {
      onClose();
    }, [onClose]);

    return (
      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        onRequestClose={handleRequestClose}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0"
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Закрыть панель"
          >
            <Animated.View
              className="absolute inset-0"
              style={[{ backgroundColor: '#000000' }, backdropStyle]}
            />
          </Pressable>
          <Animated.View
            className="overflow-hidden rounded-t-2xl px-4 pt-3"
            style={[
              {
                maxHeight: sheetMaxHeight,
                paddingBottom: insets.bottom + 16,
                backgroundColor: theme.bg.elevated,
              },
              sheetStyle,
            ]}
          >
            {title ? (
              <View
                className="mb-3 pb-3"
                style={{ borderBottomWidth: 1, borderBottomColor: theme.border.subtle }}
              >
                <AppText variant="sectionTitle" className="text-center">
                  {title}
                </AppText>
              </View>
            ) : null}
            {children}
          </Animated.View>
        </View>
      </Modal>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';
