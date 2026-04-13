import { Tabs } from 'expo-router';
import { FileText, PenLine, Settings } from 'lucide-react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bg.secondary,
          borderTopColor: Colors.border.subtle,
          paddingTop: 4,
          height: 72,
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
            <View className="top-[-16px] flex-1 items-center">
              <Pressable
                onPress={props.onPress}
                onLongPress={props.onLongPress}
                accessibilityRole="button"
                accessibilityState={props.accessibilityState}
                accessibilityLabel="Новый пост"
                testID={props.testID}
                className="h-14 w-14 items-center justify-center rounded-full"
                style={{
                  backgroundColor: Colors.accent.primary,
                  elevation: 8,
                  shadowColor: '#000',
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
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
