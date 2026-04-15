import Constants from 'expo-constants';
import React, { useCallback } from 'react';
import { Linking as RNLinking, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppSettings } from '@/types';

import { AppText } from '@/components/ui/AppText';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useSettingsStore } from '@/store/settingsStore';

const PRIVACY_URL = 'https://captioncraft.app/privacy';

function ThemeOption({
  label,
  value,
  active,
  onSelect,
}: {
  label: string;
  value: AppSettings['theme'];
  active: boolean;
  onSelect: (v: AppSettings['theme']) => void;
}) {
  const theme = useThemeColors();
  return (
    <Pressable
      onPress={() => onSelect(value)}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`Тема ${label}`}
      className="min-h-12 flex-1 items-center justify-center rounded-lg px-2 py-2"
      style={{
        backgroundColor: active ? theme.accent.subtle : theme.bg.tertiary,
        borderWidth: active ? 1 : 0,
        borderColor: active ? theme.accent.primary : 'transparent',
      }}
    >
      <AppText
        variant="label"
        color={active ? theme.accent.light : theme.text.secondary}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const theme = useThemeColors();
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const version =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.0';

  const openPrivacy = useCallback(() => {
    void RNLinking.openURL(PRIVACY_URL);
  }, []);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: theme.bg.primary }}
      edges={['top']}
    >
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <AppText variant="sectionTitle" className="mb-4 mt-2">
          Настройки
        </AppText>

        <AppText variant="label" color={theme.text.secondary} className="mb-1">
          Имя в превью Instagram
        </AppText>
        <TextInput
          value={settings.username}
          onChangeText={(username) => updateSettings({ username })}
          placeholder="username"
          placeholderTextColor={theme.text.tertiary}
          className="mb-6 min-h-12 rounded-xl px-3 py-2"
          style={{
            color: theme.text.primary,
            backgroundColor: theme.bg.secondary,
          }}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel="Имя аккаунта для превью"
        />

        <AppText variant="label" color={theme.text.secondary} className="mb-2">
          Тема
        </AppText>
        <View className="mb-6 flex-row gap-2">
          <ThemeOption
            label="Светлая"
            value="light"
            active={settings.theme === 'light'}
            onSelect={(t) => updateSettings({ theme: t })}
          />
          <ThemeOption
            label="Тёмная"
            value="dark"
            active={settings.theme === 'dark'}
            onSelect={(t) => updateSettings({ theme: t })}
          />
          <ThemeOption
            label="Системная"
            value="system"
            active={settings.theme === 'system'}
            onSelect={(t) => updateSettings({ theme: t })}
          />
        </View>

        <View
          className="mb-6 rounded-xl p-4"
          style={{ backgroundColor: theme.bg.secondary }}
        >
          <AppText variant="bodyMedium" className="mb-1">
            О приложении
          </AppText>
          <AppText variant="caption" color={theme.text.secondary}>
            Версия {version}
          </AppText>
          <Pressable
            onPress={openPrivacy}
            accessibilityRole="link"
            accessibilityLabel="Политика конфиденциальности"
            className="mt-3 min-h-12 justify-center"
          >
            <AppText variant="bodyMedium" color={theme.accent.primary}>
              Политика конфиденциальности
            </AppText>
          </Pressable>
        </View>

        <View
          className="rounded-xl p-4"
          style={{ backgroundColor: theme.bg.secondary }}
        >
          <AppText variant="bodyMedium" className="mb-1">
            Pro версия
          </AppText>
          <AppText variant="caption" color={theme.text.secondary}>
            Расширенные функции появятся здесь после подключения покупок в
            приложении.
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
