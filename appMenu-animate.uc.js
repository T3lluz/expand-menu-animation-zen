alert("ExpandingMenu mod loaded!");
// Expanding Popup ZenMenu for Sine/Zen
(function() {
  // Log to confirm script is running
  console.log('[ExpandingMenu] Script loaded!');

  // Try to read settings from Sine/Zen mod loader
  let animationSpeed = 350;
  try {
    let prefs = window.modPrefs || window.preferences || {};
    if (prefs.animationSpeed) animationSpeed = prefs.animationSpeed;
    console.log('[ExpandingMenu] Settings:', prefs);
  } catch (e) {
    console.warn('[ExpandingMenu] Could not read settings:', e);
  }

  // Inject CSS override for animation
  function injectAnimationCSS() {
    const styleId = 'zen-popup-animation-override';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `#PanelUI-popup.zen-popup-animating {\n  transition: height ${animationSpeed}ms cubic-bezier(0.4, 0.2, 0.55, 1) !important;\n  will-change: height !important;\n  overflow: hidden !important;\n}`;
    document.head.appendChild(style);
    console.log('[ExpandingMenu] Animation CSS injected');
  }

  // Animate the popup when it opens
  function animateZenPopup(popup) {
    if (!popup) return;
    const panelView = popup.querySelector('.panel-view');
    if (!panelView) return;
    popup.classList.add('zen-popup-animating');
    popup.style.height = '0px';
    popup.style.overflow = 'hidden';
    void popup.offsetWidth;
    const finalHeight = panelView.scrollHeight;
    popup.style.height = finalHeight + 'px';
    function cleanup() {
      popup.classList.remove('zen-popup-animating');
      popup.style.height = '';
      popup.style.overflow = '';
      popup.removeEventListener('transitionend', cleanup);
    }
    popup.addEventListener('transitionend', cleanup);
  }

  // Listen for popupshowing event
  function setup() {
    injectAnimationCSS();
    const popup = document.getElementById('PanelUI-popup');
    if (popup) {
      popup.addEventListener('popupshowing', function(e) {
        animateZenPopup(popup);
        console.log('[ExpandingMenu] Popup animation triggered');
      });
      console.log('[ExpandingMenu] Listener attached to PanelUI-popup');
    } else {
      console.warn('[ExpandingMenu] PanelUI-popup not found');
    }
  }

  // Wait for DOMContentLoaded if needed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})(); 