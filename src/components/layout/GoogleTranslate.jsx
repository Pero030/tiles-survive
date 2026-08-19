import { useEffect, useRef, useState } from 'react';
import { fallbackFlagImagesByLanguage } from '../../data/flagImages.js';
import { getFlagImages } from '../../services/siteContent.js';
import { assetPath } from '../../utils/assetPath.js';

const scriptId = 'google-translate-script';
const elementId = 'google_translate_element';
const storageKey = 'tiles-survive-language';

const notifyTranslationChange = () => {
  window.dispatchEvent(new CustomEvent('tiles-survive-translation-change'));
};

const normalizeLanguageCode = (languageCode) => String(languageCode || '')
  .trim()
  .replace(/^\/[^/]+\//, '')
  .split('|')[0]
  .toLowerCase();

const getFlagImageSourcesForLanguage = (languageCode) => {
  const remoteFlagImages = getFlagImages();
  const imagesByLanguage = remoteFlagImages.imagesByLanguage || fallbackFlagImagesByLanguage;
  const fallbackImage = remoteFlagImages.fallbackImage || 'fallback.png';
  const defaultLanguage = remoteFlagImages.defaultLanguage || 'en';
  const normalizedCode = normalizeLanguageCode(languageCode);

  if (!normalizedCode || normalizedCode === 'auto') {
    return {
      primary: assetPath(`/flags/${imagesByLanguage[defaultLanguage] || `${defaultLanguage}.png`}`),
      secondary: assetPath(`/flags/${fallbackImage}`),
    };
  }

  const baseCode = normalizedCode.split('-')[0];
  const primaryImage = imagesByLanguage[languageCode]
    || imagesByLanguage[normalizedCode]
    || imagesByLanguage[baseCode]
    || fallbackImage;
  const secondaryImage = imagesByLanguage[baseCode] || fallbackImage;

  return {
    primary: assetPath(`/flags/${primaryImage}`),
    secondary: assetPath(`/flags/${secondaryImage}`),
  };
};
const readCookie = (name) => document.cookie
  .split('; ')
  .find((cookie) => cookie.startsWith(`${name}=`))
  ?.split('=')[1] || '';

const writeGoogleTranslateCookie = (languageCode) => {
  const code = normalizeLanguageCode(languageCode) || 'en';
  const value = code === 'en' ? '/en/en' : `/en/${code}`;
  document.cookie = `googtrans=${value};path=/;max-age=31536000;SameSite=Lax`;
};

const readStoredLanguage = () => {
  if (typeof window === 'undefined') return '';
  return normalizeLanguageCode(window.localStorage.getItem(storageKey));
};

const storeSelectedLanguage = (languageCode) => {
  const code = normalizeLanguageCode(languageCode) || 'en';
  window.localStorage.setItem(storageKey, code);
  writeGoogleTranslateCookie(code);
  document.documentElement.lang = code;
};

const applyLanguageToSelect = (select, languageCode, shouldDispatch = false) => {
  const code = normalizeLanguageCode(languageCode) || 'en';
  if (!select || !code) {
    return false;
  }

  const hasOption = Array.from(select.options || []).some((option) => option.value === code);
  if (!hasOption) {
    return false;
  }

  if (select.value !== code) {
    select.value = code;
  }

  if (shouldDispatch) {
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  return true;
};

const readTranslatedLanguage = () => {
  const storedLanguage = readStoredLanguage();
  if (storedLanguage) {
    return storedLanguage;
  }

  const rawCookie = readCookie('googtrans');
  if (!rawCookie) {
    return 'en';
  }

  return decodeURIComponent(rawCookie).split('/').filter(Boolean).pop() || 'en';
};

export function GoogleTranslate() {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => readTranslatedLanguage());
  const flagSources = getFlagImageSourcesForLanguage(selectedLanguage);
  const wrapperRef = useRef(null);
  const appliedLanguageRef = useRef('');
  const repairTimeoutRef = useRef(null);

  useEffect(() => {
    storeSelectedLanguage(selectedLanguage);

    const applySelectedLanguage = (shouldDispatch = false, languageOverride = '') => {
      const select = wrapperRef.current?.querySelector('select.goog-te-combo');
      const languageToApply = languageOverride || readStoredLanguage() || selectedLanguage;
      const didApply = applyLanguageToSelect(select, languageToApply, shouldDispatch);

      if (didApply) {
        appliedLanguageRef.current = languageToApply;
        setSelectedLanguage(languageToApply);
      }

      return didApply;
    };

    const scheduleTranslationRepair = (delay = 350) => {
      window.clearTimeout(repairTimeoutRef.current);
      repairTimeoutRef.current = window.setTimeout(() => {
        const storedLanguage = readStoredLanguage() || selectedLanguage;
        if (!storedLanguage || storedLanguage === 'en') {
          return;
        }

        storeSelectedLanguage(storedLanguage);
        applySelectedLanguage(true, storedLanguage);
        window.setTimeout(notifyTranslationChange, 600);
      }, delay);
    };

    const retryApplySelectedLanguage = () => {
      let tries = 0;
      const intervalId = window.setInterval(() => {
        tries += 1;
        const storedLanguage = readStoredLanguage() || selectedLanguage;
        const shouldDispatch = storedLanguage !== 'en' && (appliedLanguageRef.current !== storedLanguage || tries === 4 || tries === 12);
        const didApply = applySelectedLanguage(shouldDispatch, storedLanguage);
        if ((didApply && (storedLanguage === 'en' || tries >= 12)) || tries >= 24) {
          window.clearInterval(intervalId);
        }
      }, 250);

      return intervalId;
    };

    const attachChangeListener = () => {
      const select = wrapperRef.current?.querySelector('select.goog-te-combo');
      if (!select || select.dataset.tilesSurviveBound === 'true') {
        applySelectedLanguage(false);
        return;
      }

      select.dataset.tilesSurviveBound = 'true';
      applySelectedLanguage(false);

      select.addEventListener('change', () => {
        const nextLanguage = select.value || 'en';
        storeSelectedLanguage(nextLanguage);
        setSelectedLanguage(nextLanguage);
        setOpen(false);
        window.setTimeout(notifyTranslationChange, 250);
        window.setTimeout(notifyTranslationChange, 1200);
      });
    };

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate || document.getElementById(elementId)?.dataset.ready === 'true') {
        attachChangeListener();
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
        },
        elementId,
      );

      const target = document.getElementById(elementId);
      if (target) {
        target.dataset.ready = 'true';
      }
      attachChangeListener();
      retryApplySelectedLanguage();
      scheduleTranslationRepair(700);
    };

    if (window.google?.translate) {
      window.googleTranslateElementInit();
    } else if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    const observer = new MutationObserver(attachChangeListener);
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current, { childList: true, subtree: true });
    }

    let lastLocation = window.location.href;
    const locationIntervalId = window.setInterval(() => {
      if (lastLocation !== window.location.href) {
        lastLocation = window.location.href;
        scheduleTranslationRepair(500);
      }
    }, 800);
    const repairOnFocus = () => scheduleTranslationRepair(250);
    window.addEventListener('focus', repairOnFocus);
    document.addEventListener('visibilitychange', repairOnFocus);

    const retryIntervalId = retryApplySelectedLanguage();

    return () => {
      observer.disconnect();
      window.clearInterval(retryIntervalId);
      window.clearInterval(locationIntervalId);
      window.clearTimeout(repairTimeoutRef.current);
      window.removeEventListener('focus', repairOnFocus);
      document.removeEventListener('visibilitychange', repairOnFocus);
    };
  }, [selectedLanguage]);


  useEffect(() => {
    const stopGoogleTranslateHover = (event) => {
      if (event.target?.closest?.('.goog-text-highlight')) {
        event.stopImmediatePropagation();
      }
    };

    ['mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousemove'].forEach((eventName) => {
      document.addEventListener(eventName, stopGoogleTranslateHover, true);
    });

    return () => {
      ['mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'mousemove'].forEach((eventName) => {
        document.removeEventListener(eventName, stopGoogleTranslateHover, true);
      });
    };
  }, []);
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const closeOnOutsideClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [open]);

  return (
    <div className={open ? 'global-translate is-open' : 'global-translate'} ref={wrapperRef} translate="no">
      <button className="translate-globe-button" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Choose language">
        <img
          key={selectedLanguage}
          className="translate-flag"
          src={flagSources.primary}
          alt=""
          aria-hidden="true"
          onLoad={(event) => {
            delete event.currentTarget.dataset.fallbackStage;
          }}
          onError={(event) => {
            if (event.currentTarget.dataset.fallbackStage === 'secondary') {
              event.currentTarget.dataset.fallbackStage = 'final';
              event.currentTarget.src = assetPath('/flags/fallback.png');
              return;
            }
            event.currentTarget.dataset.fallbackStage = 'secondary';
            event.currentTarget.src = flagSources.secondary;
          }}
        />
      </button>
      <div className="translate-dropdown">
        <div id={elementId} />
      </div>
    </div>
  );
}








