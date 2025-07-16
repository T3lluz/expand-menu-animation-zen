// Zen menu expanding popup animation
(function() {
  // Read settings from preferences.json (Sine/Zen exposes them on window.modPrefs or similar)
  const defaultSpeed = 350;
  let animationSpeed = defaultSpeed;
  let forceOverride = true;
  try {
    const prefs = window.modPrefs || window.preferences || {};
    if (prefs.animationSpeed) animationSpeed = prefs.animationSpeed;
    if (prefs.forceOverride !== undefined) forceOverride = prefs.forceOverride;
  } catch (e) {}

  // Inject CSS override if needed
  function injectAnimationCSS() {
    const styleId = 'zen-popup-animation-override';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      #PanelUI-popup.zen-popup-animating, #appMenu-popup.zen-popup-animating {
        transition: height ${animationSpeed}ms cubic-bezier(0.4, 0.2, 0.55, 1) !important;
        will-change: height !important;
        overflow: hidden !important;
      }
      #PanelUI-popup.zen-popup-expanded, #appMenu-popup.zen-popup-expanded {
        /* Optionally add more styles here */
      }
    `;
    document.head.appendChild(style);
  }

  // Utility to animate popup height
  function animateZenPopup(popup) {
    if (!popup) return;
    const panelView = popup.querySelector('.panel-view');
    if (!panelView) return;

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
  }

  // Attach to menu popup open events
  function setupZenPopupAnimation() {
    if (forceOverride) injectAnimationCSS();
    const popups = [
      document.getElementById('PanelUI-popup'),
      document.getElementById('appMenu-popup')
    ].filter(Boolean);
    popups.forEach(popup => {
      popup.addEventListener('popupshowing', function handler(e) {
        animateZenPopup(popup);
      });
    });
  }

  if (document.readyState === 'complete') setupZenPopupAnimation();
  else window.addEventListener('DOMContentLoaded', setupZenPopupAnimation);
})(); 