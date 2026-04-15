import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { type Href, router } from 'expo-router';
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eye, FileText, Hash } from 'lucide-react-native';

import { Colors } from '@/constants/colors';
import { AppText } from '@/components/ui/AppText';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/store/settingsStore';
import { INSTAGRAM_LIMITS } from '@/utils/instagramLimits';

const AnimatedFlatList = Animated.FlatList;

interface SlideItem {
  key: string;
  title: string;
  body: string;
  Icon: React.ComponentType<{
    size: number;
    color: string;
    strokeWidth?: number;
  }>;
  iconSize: number;
}

const SLIDES: SlideItem[] = [
  {
    key: 'write',
    title: 'Пиши без страха потерять',
    body:
      'Все твои подписи хранятся в одном месте. Без облака, без регистрации.',
    Icon: FileText,
    iconSize: 88,
  },
  {
    key: 'preview',
    title: 'Видь пост до публикации',
    body:
      'Превью показывает, как Instagram обрежет твою подпись.',
    Icon: Eye,
    iconSize: 72,
  },
  {
    key: 'limits',
    title: 'Следи за лимитами',
    body: `Счётчик символов и хэштегов в реальном времени. ${INSTAGRAM_LIMITS.CAPTION_MAX} / ${INSTAGRAM_LIMITS.HASHTAG_MAX} — ни один лимит не пройдёт незамеченным.`,
    Icon: Hash,
    iconSize: 72,
  },
];

const OnboardingSlide = memo(
  ({
    item,
    index,
    scrollX,
    width,
  }: {
    item: SlideItem;
    index: number;
    scrollX: SharedValue<number>;
    width: number;
  }) => {
    const theme = useThemeColors();
    const { Icon, iconSize } = item;
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ];
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.35, 1, 0.35],
        Extrapolation.CLAMP
      );
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.92, 1, 0.92],
        Extrapolation.CLAMP
      );
      return { opacity, transform: [{ scale }] };
    });

    return (
      <Animated.View
        style={[{ width, flex: 1 }, animatedStyle]}
        className="justify-center px-6"
      >
        <View className="items-center">
          <View accessibilityElementsHidden importantForAccessibility="no">
            <Icon
              size={iconSize}
              color={theme.accent.primary}
              strokeWidth={1.8}
            />
          </View>
          <AppText
            variant="screenTitle"
            className="mt-8 text-center"
            accessibilityRole="header"
          >
            {item.title}
          </AppText>
          <AppText
            variant="body"
            color={theme.text.secondary}
            className="mt-4 text-center"
          >
            {item.body}
          </AppText>
        </View>
      </Animated.View>
    );
  }
);

OnboardingSlide.displayName = 'OnboardingSlide';

const OnboardingDot = memo(
  ({
    index,
    scrollX,
    width,
  }: {
    index: number;
    scrollX: SharedValue<number>;
    width: number;
  }) => {
    const style = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ];
      const active = interpolate(
        scrollX.value,
        inputRange,
        [0, 1, 0],
        Extrapolation.CLAMP
      );
      return {
        width: interpolate(active, [0, 1], [8, 22]),
        opacity: interpolate(active, [0, 1], [0.35, 1]),
        backgroundColor: Colors.accent.primary,
      };
    });

    return (
      <Animated.View
        style={[{ height: 8, borderRadius: 4 }, style]}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
    );
  }
);

OnboardingDot.displayName = 'OnboardingDot';

export default function OnboardingScreen() {
  const theme = useThemeColors();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollX = useSharedValue(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState('');
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardInset(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardInset(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const listRef = useRef<Animated.FlatList<SlideItem>>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / width);
      setSlideIndex(Math.min(Math.max(idx, 0), SLIDES.length - 1));
    },
    [width]
  );

  const openUsernameStep = useCallback(() => {
    setUsernameDraft(settings.username);
    setUsernameModalVisible(true);
  }, [settings.username]);

  const handlePrimaryPress = useCallback(() => {
    if (slideIndex < SLIDES.length - 1) {
      const next = slideIndex + 1;
      listRef.current?.scrollToIndex({ index: next, animated: true });
      return;
    }
    openUsernameStep();
  }, [openUsernameStep, slideIndex]);

  const completeOnboarding = useCallback(() => {
    const trimmed = usernameDraft.trim();
    updateSettings({
      onboardingComplete: true,
      username: trimmed.length > 0 ? trimmed : settings.username,
    });
    setUsernameModalVisible(false);
    router.replace('/(tabs)' as Href);
  }, [settings.username, updateSettings, usernameDraft]);

  const isLastSlide = slideIndex === SLIDES.length - 1;
  const primaryLabel = isLastSlide ? 'Начать' : 'Далее';

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.bg.primary }}
      edges={['top', 'bottom']}
    >
      <AnimatedFlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <OnboardingSlide
            item={item}
            index={index}
            scrollX={scrollX}
            width={width}
          />
        )}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        accessibilityLabel={`Знакомство с INstaWomb, шаг ${slideIndex + 1} из ${SLIDES.length}`}
        accessibilityHint="Проведите влево или вправо, чтобы перейти к следующему или предыдущему шагу"
      />

      <View className="items-center px-6 pb-2">
        <View className="mb-6 flex-row items-center gap-2">
          {SLIDES.map((s, i) => (
            <OnboardingDot
              key={s.key}
              index={i}
              scrollX={scrollX}
              width={width}
            />
          ))}
        </View>
        <Button
          label={primaryLabel}
          onPress={handlePrimaryPress}
          variant="primary"
          size="lg"
        />
      </View>

      <Modal
        visible={usernameModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setUsernameModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="flex-1 bg-black/60"
            onPress={() => setUsernameModalVisible(false)}
            accessibilityLabel="Закрыть окно ввода имени"
            accessibilityRole="button"
          />
          <View
            className="rounded-t-3xl"
            style={{
              marginBottom:
                keyboardInset > 0
                  ? keyboardInset
                  : Math.max(insets.bottom, 12),
              backgroundColor: theme.bg.secondary,
              maxHeight: '88%',
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 24,
                paddingBottom: 24,
              }}
            >
              <AppText variant="sectionTitle" className="mb-2">
                Имя в превью
              </AppText>
              <AppText
                variant="caption"
                color={theme.text.secondary}
                className="mb-4"
              >
                Как отображать имя в превью поста (можно изменить позже в
                настройках).
              </AppText>
              <TextInput
                value={usernameDraft}
                onChangeText={setUsernameDraft}
                placeholder="username"
                placeholderTextColor={theme.text.tertiary}
                className="mb-6 min-h-12 rounded-xl px-3 py-2"
                style={{
                  color: theme.text.primary,
                  backgroundColor: theme.bg.tertiary,
                }}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
                accessibilityLabel="Имя пользователя для превью"
                accessibilityHint="Отображается в карточке превью, как в Instagram"
              />
              <Button
                label="Продолжить"
                onPress={completeOnboarding}
                variant="primary"
                size="lg"
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
