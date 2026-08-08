/* ============================================================
   ECHOBREAKER — Diversity Indicator
   Shows how many categories are represented in the top 15 posts.
   100% = all 8 categories present = healthy diverse feed
   <30% = echo chamber forming
   ============================================================ */

const Diversity = {

  _needleEl: null,
  _readoutEl: null,

  init() {
    this._needleEl = document.getElementById("gauge-needle");
    this._readoutEl = document.getElementById("gauge-readout");
  },

  update() {
    const percent = ScoringEngine.getDiversityPercent(15);
    this._render(percent);
  },

  _render(percent) {
    if (!this._needleEl || !this._readoutEl) return;

    // Update needle position
    this._needleEl.style.left = percent + "%";

    // Update color based on level
    let color;
    if (percent > 60) {
      color = "var(--diversity-healthy)";   // Newsroom OK
    } else if (percent >= 30) {
      color = "var(--diversity-warning)";   // News Gold
    } else {
      color = "var(--diversity-danger)";    // Newsroom Alert
    }

    this._needleEl.style.backgroundColor = color;
    
    // Update readout to be raw number only
    this._readoutEl.textContent = percent;
  }
};

if (typeof window !== 'undefined') {
  window.Diversity = Diversity;
  window.addEventListener('languageChanged', () => {
    if (window.Diversity && window.Diversity.update) {
      window.Diversity.update();
    }
  });
}
