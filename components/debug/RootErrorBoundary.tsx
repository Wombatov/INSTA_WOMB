import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  info: ErrorInfo | null;
}

/**
 * Ловит падения рендера в релизе (иначе — белый экран без текста).
 */
export class RootErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    this.setState({ info });
  }

  private handleRetry = (): void => {
    this.setState({ error: null, info: null });
  };

  override render(): ReactNode {
    const { error, info } = this.state;
    if (error) {
      return (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 64,
            backgroundColor: Colors.bg.primary,
          }}
        >
          <Text
            style={{
              color: Colors.status.error,
              fontSize: 18,
              fontWeight: '600',
              marginBottom: 12,
            }}
          >
            Ошибка запуска
          </Text>
          <Text
            style={{
              color: Colors.text.secondary,
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            {error.message}
          </Text>
          {info?.componentStack ? (
            <ScrollView style={{ flex: 1, marginBottom: 16 }}>
              <Text
                selectable
                style={{
                  color: Colors.text.tertiary,
                  fontSize: 11,
                  fontFamily: 'monospace',
                }}
              >
                {info.componentStack}
              </Text>
            </ScrollView>
          ) : null}
          <Pressable
            onPress={this.handleRetry}
            accessibilityRole="button"
            accessibilityLabel="Повторить"
            style={{
              minHeight: 48,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              paddingVertical: 12,
              backgroundColor: Colors.accent.primary,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Повторить</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
