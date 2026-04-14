import { Tabs } from 'expo-router';
import { FileText, PenLine, Settings } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';

const TAB_BAR_BASE_HEIGHT = 56;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);
  const tabBarHeight = TAB_BAR_BASE_HEIGHT + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bg.secondary,
          borderTopColor: Colors.border.subtle,
          paddingTop: 6,
          height: tabBarHeight,
          paddingBottom: bottomInset,
        },
        tabBarActiveTintColor: Colors.accent.primary,
        tabBarInactiveTintColor: Colors.text.tertiary,
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Посты',
          tabBarIcon: ({ color, size }) => (
            <FileText size={size ?? 24} color={color} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="editor"
        options={{
          title: 'Новый',
          tabBarIcon: () => (
            <PenLine size={26} color="#FFFFFF" strokeWidth={1.8} />
          ),
          tabBarLabel: 'Новый',
          tabBarButton: (props) => (
            <View className="top-[-22px] flex-1 items-center">
              <Pressable
                onPress={props.onPress}
                onLongPress={props.onLongPress}
                accessibilityRole="button"
                accessibilityState={props.accessibilityState}
                accessibilityLabel="Новый пост"
                testID={props.testID}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                className="h-14 w-14 items-center justify-center rounded-full"
                style={{
                  backgroundColor: Colors.accent.primary,
                  elevation: 10,
                  shadowColor: '#000',
                  shadowOpacity: 0.28,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 3 },
                }}
              >
                <PenLine size={26} color="#FFFFFF" strokeWidth={1.8} />
              </Pressable>
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  color: Colors.text.tertiary,
                }}
              >
                Новый
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Настройки',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size ?? 24} color={color} strokeWidth={1.8} />
          ),
        }}
      />
    </Tabs>
  );
}
