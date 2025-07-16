// Zen menu expanding popup animation
(function() {
  // Read settings from preferences.json (Sine/Zen exposes them on window.modPrefs or similar)
  const defaultSpeed = 350;
  let animationSpeed = defaultSpeed;
  let forceOverride = true;
  let settingsSource = 'default';
  try {
    const prefs = window.modPrefs || window.preferences || {};
    if (prefs.animationSpeed) animationSpeed = prefs.animationSpeed;
    if (prefs.forceOverride !== undefined) forceOverride = prefs.forceOverride;
    settingsSource = 'window.modPrefs or window.preferences';
  } catch (e) {
    console.warn('[ExpandingMenu] Could not read settings:', e);
  }
  console.log('[ExpandingMenu] Settings:', {animationSpeed, forceOverride, settingsSource});

  // Inject CSS override if needed
  function injectAnimationCSS() {
    const styleId = 'zen-popup-animation-override';
    let style = document.getElementById(styleId);
    if (style) style.remove(); // Always re-inject to ensure it's last
    style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      #PanelUI-popup.zen-popup-animating, #appMenu-popup.zen-popup-animating, .zen-popup-animating {
        transition: height ${animationSpeed}ms cubic-bezier(0.4, 0.2, 0.55, 1) !important;
        will-change: height !important;
        overflow: hidden !important;
      }
      #PanelUI-popup.zen-popup-expanded, #appMenu-popup.zen-popup-expanded, .zen-popup-expanded {
        /* Optionally add more styles here */
      }
    `;
    document.head.appendChild(style);
    console.log('[ExpandingMenu] Injected animation CSS with speed', animationSpeed);
  }

  // Utility to animate popup height
  function animateZenPopup(popup) {
    if (!popup) {
      console.warn('[ExpandingMenu] No popup found to animate');
      return;
    }
    const panelView = popup.querySelector('.panel-view');
    if (!panelView) {
      console.warn('[ExpandingMenu] No .panel-view found in popup', popup);
      return;
    }
    popup.classList.add('zen-popup-animating');
    popup.style.height = '0px';
    popup.style.overflow = 'hidden';
    // Force reflow
    void popup.offsetWidth;
    // Measure final height
    const finalHeight = panelView.scrollHeight;
    popup.style.setProperty('--zen-popup-final-height', finalHeight + 'px');
    popup.classList.add('zen-popup-expanded');
    popup.style.height = finalHeight + 'px';
    // Clean up after transition
    function cleanup() {
      popup.classList.remove('zen-popup-animating', 'zen-popup-expanded');
      popup.style.height = '';
      popup.style.overflow = '';
      popup.removeEventListener('transitionend', cleanup);
    }
    popup.addEventListener('transitionend', cleanup);
    console.log('[ExpandingMenu] Animated popup', popup, 'to height', finalHeight);
  }

  // Attach to menu popup open events
  function setupZenPopupAnimation() {
    if (forceOverride) injectAnimationCSS();
    // Try both known popups and any visible .panel-view parent
    const popups = [
      document.getElementById('PanelUI-popup'),
      document.getElementById('appMenu-popup'),
      ...Array.from(document.querySelectorAll('.panel-view')).map(el => el.closest('panel, .popup, .menupopup, .panel, .popup-panel, .popup-group, .popup-container, .popup-box, .popupset, .popupsetbox, .popupset-panel, .popupset-popup, .popupset-group, .popupset-container, .popupset-box')).filter(Boolean)
    ].filter(Boolean);
    if (popups.length === 0) {
      console.warn('[ExpandingMenu] No popups found to attach animation');
    }
    popups.forEach(popup => {
      popup.addEventListener('popupshowing', function handler(e) {
        animateZenPopup(popup);
      });
    });
    console.log('[ExpandingMenu] Animation attached to popups:', popups);
  }

  if (document.readyState === 'complete') setupZenPopupAnimation();
  else window.addEventListener('DOMContentLoaded', setupZenPopupAnimation);
})(); 