/* ============================================================
   ECHOBREAKER — App Entry Point
   Initializes all modules, handles onboarding,
   session timer, interaction counter, guided tooltips.
   ============================================================ */

const App = {

  _sessionSeconds: 0,
  _sessionTimer: null,
  _guideStep: 0,
  _isPersonaMode: false,
  _tooltipEl: null,

  init() {
    // Initialize modules
    Feed.init();
    Diversity.init();
    Curtain.init();
    if (typeof Impact !== 'undefined') Impact.init();
    if (typeof Telemetry !== 'undefined') Telemetry.init();

    // Render initial feed (default ranking, no preferences)
    Feed.render();
    Diversity.update();

    // Wire up engine change listener
    ScoringEngine.onChange(() => {
      Feed.render();
      Diversity.update();
      Curtain.render();
      this._updateInteractionCount();
      this._checkGuideStep();
      if (typeof Impact !== 'undefined') Impact.checkTrigger();
    });

    // Wire up onboarding buttons
    document.getElementById("btn-start-free").addEventListener("click", () => {
      this._hideOnboarding();
      this._startSession();
    });

    document.getElementById("btn-start-persona").addEventListener("click", () => {
      this._hideOnboarding();
      this._startPersonaMode();
    });
  },

  // --- Onboarding ---

  _hideOnboarding() {
    const banner = document.getElementById("onboarding-banner");
    banner.classList.add("hidden");
    setTimeout(() => {
      banner.style.display = "none";
    }, 400); // match fadeSlideOut duration
  },

  // --- Session ---

  _startSession() {
    this._sessionSeconds = 0;
    this._sessionTimer = setInterval(() => {
      this._sessionSeconds++;
      this._updateSessionTime();
    }, 1000);
  },

  _updateSessionTime() {
    const mins = Math.floor(this._sessionSeconds / 60);
    const secs = this._sessionSeconds % 60;
    const el = document.getElementById("session-time");
    if (el) {
      el.textContent = mins + ":" + (secs < 10 ? "0" : "") + secs;
    }
  },

  _updateInteractionCount() {
    const el = document.getElementById("interaction-count");
    if (el) {
      el.textContent = ScoringEngine.userState.totalInteractions;
    }
  },

  // --- Persona Mode (Sports Fan) ---

  _startPersonaMode() {
    this._isPersonaMode = true;
    this._guideStep = 0;

    // Load persona preferences
    ScoringEngine.loadPersona("sports_fan");

    // Start session timer
    this._startSession();

    // Show first tooltip after 3 seconds
    setTimeout(() => {
      this._showGuideTooltip(this._getGuideMessage(1));
      this._guideStep = 1;
    }, 3000);
  },

  // --- Guided Tooltips ---

  _guideMessages: [
    "", // step 0 = not started
    "👋 This feed is already shaped by your interests. Scroll and like posts you find interesting.",
    "📉 Notice the diversity bar dropping? The algorithm is narrowing your world.",
    "🔍 Try the \"Behind the Curtain\" button to see the algorithm's actual scores.",
    "🎯 You've just experienced how echo chambers form. The algorithm showed you more of what you already liked — and hid everything else."
  ],

  _getGuideMessage(step) {
    const key = 'guide_msg_' + step;
    if (typeof i18n !== 'undefined' && i18n.t) {
      const trans = i18n.t(key);
      if (trans && trans !== key && !trans.startsWith('guide_msg_')) return trans;
    }
    return this._guideMessages[step] || "";
  },

  _guideThresholds: [0, 0, 3, 5, 8], // interaction count triggers

  _checkGuideStep() {
    if (!this._isPersonaMode) return;

    const interactions = ScoringEngine.userState.totalInteractions;

    // Check if we should advance to next step
    if (this._guideStep === 1 && interactions >= 3 && !this._tooltipEl) {
      this._guideStep = 2;
      this._showGuideTooltip(this._getGuideMessage(2));
    } else if (this._guideStep === 2 && interactions >= 5 && !this._tooltipEl) {
      this._guideStep = 3;
      this._showGuideTooltip(this._getGuideMessage(3));
    } else if (this._guideStep === 3 && interactions >= 8 && !this._tooltipEl) {
      this._guideStep = 4;
      this._showGuideTooltip(this._getGuideMessage(4));
    }
  },

  _showGuideTooltip(message) {
    // Don't show if there's already a tooltip
    if (this._tooltipEl) return;

    const tooltip = document.createElement("div");
    tooltip.className = "guide-tooltip";

    const text = document.createElement("div");
    text.className = "guide-tooltip-text";
    text.textContent = message;

    const dismissBtn = document.createElement("button");
    dismissBtn.className = "btn-dismiss";
    dismissBtn.textContent = "Got it";
    dismissBtn.addEventListener("click", () => {
      tooltip.style.animation = "fadeSlideOut 0.3s ease forwards";
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
        this._tooltipEl = null;
      }, 300);
    });

    tooltip.appendChild(text);
    tooltip.appendChild(dismissBtn);

    // Floating Fixed Viewport Overlay — Always visible regardless of scroll
    tooltip.style.position = "fixed";
    tooltip.style.top = "80px";
    tooltip.style.left = "50%";
    tooltip.style.transform = "translateX(-50%)";
    tooltip.style.zIndex = "9999";
    tooltip.style.boxShadow = "0 8px 32px rgba(0,0,0,0.6)";

    document.body.appendChild(tooltip);
    this._tooltipEl = tooltip;
  },

  _beforeUnloadHandler(e) {
    if (typeof ScoringEngine !== 'undefined' && ScoringEngine.userState.totalInteractions > 0 && (!typeof Impact !== 'undefined' && !Impact._hasTriggered)) {
      e.preventDefault();
      e.returnValue = "Your active simulation session progress will be reset. Are you sure you want to leave?";
      return e.returnValue;
    }
  },

  disableBeforeUnload() {
    window.removeEventListener("beforeunload", this._beforeUnloadHandler);
  }
};

// --- Initialize on page load ---
document.addEventListener("DOMContentLoaded", () => {
  App.init();

  // Session Protection: Warn before accidental refresh during active session
  window.addEventListener("beforeunload", App._beforeUnloadHandler);
});

window.addEventListener("languageChanged", () => {
  if (typeof App !== 'undefined' && App._tooltipEl && App._guideStep > 0) {
    const textEl = App._tooltipEl.querySelector(".guide-tooltip-text");
    if (textEl) {
      textEl.textContent = App._getGuideMessage(App._guideStep);
    }
  }
});
