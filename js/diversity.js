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

    // Update needle width cleanly as a progress fill bar
    this._needleEl.style.width = Math.max(5, Math.min(100, percent)) + "%";
    this._needleEl.style.left = "0";

    // Update color based on level
    let color;
    if (percent > 60) {
      color = "#27ae60";   // Healthy Green
    } else if (percent >= 35) {
      color = "#d35400";   // Warning Amber
    } else {
      color = "#a8412e";   // Echo Chamber Red Alert
    }

    this._needleEl.style.backgroundColor = color;
    
    // Update readout text with percentage symbol
    this._readoutEl.textContent = percent + "%";
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
