import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';

export type ThemeChoice = 'system' | 'light' | 'dark';

export function applyTheme(choice: ThemeChoice) {
  // 1. Couper temporairement les transitions pour basculer instantanément sans flash
  document.documentElement.classList.add('theme-transitioning');

  let resolvedTheme = choice;
  if (choice === 'system') {
    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  // 2. Mettre à jour l'attribut data-theme et la classe dark
  document.documentElement.setAttribute('data-theme', resolvedTheme);
  if (resolvedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // 3. Spécifier le color-scheme natif pour barres de défilement et formulaires
  document.documentElement.style.colorScheme = resolvedTheme;

  // 4. Mettre à jour la meta theme-color pour mobile et navigateurs
  const metaTheme = document.getElementById('theme-color-meta');
  if (metaTheme) {
    metaTheme.setAttribute('content', resolvedTheme === 'dark' ? '#0E1014' : '#F7F7F5');
  }

  // 5. Sauvegarder dans localStorage
  try {
    localStorage.setItem('cvstudio_theme', choice);
  } catch (e) {
    // Ignore les erreurs de stockage privé
  }

  // 6. Rétablir les transitions après un court délai
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning');
  }, 100);
}

export function getInitialThemeChoice(): ThemeChoice {
  try {
    const saved = localStorage.getItem('cvstudio_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved as ThemeChoice;
    }
  } catch (e) {}
  return 'system'; // Système par défaut strict
}

export interface ThemeMenuProps {
  currentTheme: ThemeChoice;
  onThemeChange: (theme: ThemeChoice) => void;
  className?: string;
  inverted?: boolean;
}

export const ThemeMenu: React.FC<ThemeMenuProps> = ({
  currentTheme,
  onThemeChange,
  className = '',
  inverted = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (choice: ThemeChoice) => {
    applyTheme(choice);
    onThemeChange(choice);
    setIsOpen(false);
  };

  const getTriggerIcon = () => {
    const iconClass = inverted ? 'w-4 h-4 text-[#ECEEF3]' : 'w-4 h-4 text-primary';
    if (currentTheme === 'light') return <Sun className={iconClass} />;
    if (currentTheme === 'dark') return <Moon className={iconClass} />;
    return <Laptop className={iconClass} />;
  };

  const options: { value: ThemeChoice; label: string; icon: React.ReactNode }[] = [
    { value: 'system', label: 'Système', icon: <Laptop className="w-4 h-4" /> },
    { value: 'light', label: 'Clair', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Sombre', icon: <Moon className="w-4 h-4" /> },
  ];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label="Changer le thème d'affichage"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer transition-colors ${
          inverted
            ? 'border border-white/20 bg-white/10 hover:bg-white/15 text-[#ECEEF3]'
            : 'border border-default bg-surface text-muted hover:text-primary hover:bg-surface-secondary'
        }`}
      >
        {getTriggerIcon()}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Options de thème"
          className="absolute right-0 mt-1.5 w-36 bg-surface border border-default rounded-lg shadow-dropdown py-1 z-50"
        >
          {options.map((option) => {
            const isSelected = currentTheme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between px-3 py-2 text-[13px] text-left cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-accent-soft text-accent font-medium'
                    : 'text-primary hover:bg-surface-secondary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-muted">{option.icon}</span>
                  <span>{option.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
