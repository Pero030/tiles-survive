import { useEffect, useRef, useState } from 'react';
import { fallbackFlagImagesByLanguage } from '../../data/flagImages.js';
import { getFlagImages } from '../../services/siteContent.js';
import { assetPath } from '../../utils/assetPath.js';

const scriptId = 'google-translate-script';
const elementId = 'google_translate_element';

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

const readTranslatedLanguage = () => {
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

  useEffect(() => {
    const attachChangeListener = () => {
      const select = wrapperRef.current?.querySelector('select.goog-te-combo');
      if (!select || select.dataset.tilesSurviveBound === 'true') {
        return;
      }

      select.dataset.tilesSurviveBound = 'true';
      if (selectedLanguage && select.value !== selectedLanguage) {
        select.value = selectedLanguage;
      }

      select.addEventListener('change', () => {
        setSelectedLanguage(select.value || 'en');
        setOpen(false);
        window.setTimeout(() => setSelectedLanguage(readTranslatedLanguage()), 600);
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

    return () => observer.disconnect();
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








