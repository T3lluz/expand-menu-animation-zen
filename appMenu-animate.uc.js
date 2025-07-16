// Zen menu expanding popup animation
(function() {
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