import React, { memo, useMemo } from 'react';
import { Text } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme-colors';
import { getTruncatedCaption } from '@/utils/instagramLimits';

const HASHTAG_SPLIT = /(#[\w\u0400-\u04FF]+)/;

export interface CaptionPreviewProps {
  text: string;
  isExpanded: boolean;
  onToggle: () => void;
  /** Не показывать «скрыть» в конце (режим «Полный» в превью-карточке) */
  suppressCollapseHint?: boolean;
  /** Жирное имя перед подписью (как @username в Instagram) */
  usernamePrefix?: string;
}

function renderWithHashtags(
  body: string,
  baseColor: string,
  accentColor: string
): React.ReactNode {
  const parts = body.split(HASHTAG_SPLIT);
  return parts.map((part, index) => {
    const isTag = /^#[\w\u0400-\u04FF]+$/.test(part);
    return (
      <Text
        key={`${index}-${part.slice(0, 16)}`}
        style={isTag ? { color: accentColor } : { color: baseColor }}
      >
        {part}
      </Text>
    );
  });
}

function UsernameBold({
  name,
  baseColor,
}: {
  name: string;
  baseColor: string;
}) {
  return (
    <Text style={{ fontWeight: '700', color: baseColor }}>{name}</Text>
  );
}

export const CaptionPreview = memo<CaptionPreviewProps>(
  ({
    text,
    isExpanded,
    onToggle,
    suppressCollapseHint = false,
    usernamePrefix,
  }) => {
    const theme = useThemeColors();
    const { visible, isTruncated } = useMemo(
      () => getTruncatedCaption(text),
      [text]
    );

    const baseColor = theme.text.primary;
    const accentColor = theme.accent.primary;

    const showUser = usernamePrefix !== undefined && usernamePrefix.length > 0;

    if (!isTruncated) {
      return (
        <Text style={{ color: baseColor }}>
          {showUser ? (
            <UsernameBold name={usernamePrefix ?? ''} baseColor={baseColor} />
          ) : null}
          {showUser ? <Text style={{ color: baseColor }}>{' '}</Text> : null}
          {renderWithHashtags(text, baseColor, accentColor)}
        </Text>
      );
    }

    if (!isExpanded) {
      return (
        <Text style={{ color: baseColor }}>
          {showUser ? (
            <UsernameBold name={usernamePrefix ?? ''} baseColor={baseColor} />
          ) : null}
          {showUser ? <Text style={{ color: baseColor }}>{' '}</Text> : null}
          {renderWithHashtags(visible, baseColor, accentColor)}
          <Text
            onPress={onToggle}
            style={{ color: accentColor }}
            suppressHighlighting
          >
            ...ещё
          </Text>
        </Text>
      );
    }

    return (
      <Text style={{ color: baseColor }}>
        {showUser ? (
          <UsernameBold name={usernamePrefix ?? ''} baseColor={baseColor} />
        ) : null}
        {showUser ? <Text style={{ color: baseColor }}>{' '}</Text> : null}
        {renderWithHashtags(text, baseColor, accentColor)}
        {!suppressCollapseHint ? (
          <Text
            onPress={onToggle}
            style={{ color: theme.text.secondary }}
            suppressHighlighting
          >
            {' '}
            скрыть
          </Text>
        ) : null}
      </Text>
    );
  }
);

CaptionPreview.displayName = 'CaptionPreview';
