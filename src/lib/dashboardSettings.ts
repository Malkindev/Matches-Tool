export type MarketMode = 'Balanced' | 'Aggressive' | 'Cautious';

export interface DashboardSettings {
  volatility: number;
  pulse: number;
  marketMode: MarketMode;
  currentDigit: number | null;
  history: number[];
  lastUpdatedAt: string;
  countdown: number;
  selectedVolatilityLabel: string;
}

const STORAGE_KEY = 'magisk-dashboard-settings';

const DEFAULT_SETTINGS: DashboardSettings = {
  volatility: 72,
  pulse: 14,
  marketMode: 'Balanced',
  currentDigit: null,
  history: [],
  lastUpdatedAt: 'Awaiting signal',
  countdown: 30,
  selectedVolatilityLabel: 'Volatility 75 (1s)',
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function getDashboardSettings(): DashboardSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(stored) as Partial<DashboardSettings>;
    const history = Array.isArray(parsed.history) ? parsed.history.slice(0, 12) : DEFAULT_SETTINGS.history;

    const volatility = clamp(parsed.volatility ?? DEFAULT_SETTINGS.volatility, 0, 100);
    const selectedVolatilityLabel = parsed.selectedVolatilityLabel || DEFAULT_SETTINGS.selectedVolatilityLabel;

    return {
      volatility,
      pulse: clamp(parsed.pulse ?? DEFAULT_SETTINGS.pulse, 8, 30),
      marketMode: parsed.marketMode ?? DEFAULT_SETTINGS.marketMode,
      currentDigit: parsed.currentDigit ?? DEFAULT_SETTINGS.currentDigit,
      history,
      lastUpdatedAt: parsed.lastUpdatedAt ?? DEFAULT_SETTINGS.lastUpdatedAt,
      countdown: clamp(parsed.countdown ?? DEFAULT_SETTINGS.countdown, 1, 30),
      selectedVolatilityLabel,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveDashboardSettings(partial: Partial<DashboardSettings>): DashboardSettings {
  const nextSettings = {
    ...getDashboardSettings(),
    ...partial,
    history: partial.history ?? getDashboardSettings().history,
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
    window.dispatchEvent(new Event('magisk-dashboard-settings-updated'));
  }

  return nextSettings;
}

export function updateDashboardSettings(partial: Partial<DashboardSettings>): DashboardSettings {
  return saveDashboardSettings(partial);
}

export function subscribeDashboardSettings(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleStorage = () => callback();
  const handleCustomEvent = () => callback();

  window.addEventListener('storage', handleStorage);
  window.addEventListener('magisk-dashboard-settings-updated', handleCustomEvent);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('magisk-dashboard-settings-updated', handleCustomEvent);
  };
}
