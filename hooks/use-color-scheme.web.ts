import { useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

import { useSettingsStore } from '@/store/settingsStore';

type Scheme = 'light' | 'dark';

function systemScheme(): Scheme {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}

export function useColorScheme(): Scheme {
  const themeSetting = useSettingsStore((s) => s.settings.theme);
  const [hydrated, setHydrated] = useState(false);
  const [system, setSystem] = useState<Scheme>(systemScheme);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystem(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => sub.remove();
  }, []);

  return useMemo(() => {
    if (!hydrated) {
      return 'light';
    }
    if (themeSetting === 'light') {
      return 'light';
    }
    if (themeSetting === 'dark') {
      return 'dark';
    }
    return system;
  }, [hydrated, themeSetting, system]);
}
