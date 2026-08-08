/* ============================================================
   ECHOBREAKER — Behind the Curtain Panel
   Shows REAL algorithm scores — this is the core educational
   transparency feature. Numbers must match actual feed ranking.
   ============================================================ */

const Curtain = {

  _panel: null,
  _toggleBtn: null,
  _scoresContainer: null,
  _affinitiesContainer: null,
  _isOpen: false,

  init() {
    this._panel = document.getElementById("curtain-panel");
    this._toggleBtn = document.getElementById("curtain-toggle");
    this._scoresContainer = document.getElementById("curtain-scores");
    this._affinitiesContainer = document.getElementById("affinity-bars");
    this._closeBtn = document.getElementById("btn-close-curtain");

    this._toggleBtn.addEventListener("click", () => this.toggle());
    if (this._closeBtn) {
      this._closeBtn.addEventListener("click", () => {
        if (this._isOpen) this.toggle();
      });
    }
  },

  toggle() {
    this._isOpen = !this._isOpen;

    if (this._isOpen) {
      this._panel.classList.add("open");
      this._panel.setAttribute("aria-hidden", "false");
      this._toggleBtn.classList.add("active");
      document.querySelector(".app-main").classList.add("curtain-open");
      this.render();
    } else {
      this._panel.classList.remove("open");
      this._panel.setAttribute("aria-hidden", "true");
      this._toggleBtn.classList.remove("active");
      document.querySelector(".app-main").classList.remove("curtain-open");
    }
  },

  render() {
    if (!this._isOpen) return;
    this._renderDemoIndicator();
    this._renderScores();
    this._renderAffinities();
  },

  _renderDemoIndicator() {
    const existing = document.getElementById("curtain-demo-label");
    if (existing) existing.remove();
    const interactions = ScoringEngine.userState.totalInteractions;
    if (interactions === 0) {
      const label = document.createElement("div");
      label.id = "curtain-demo-label";
      label.style.cssText = "background:rgba(184,134,46,0.15);border:1px solid rgba(184,134,46,0.3);border-radius:var(--radius-card);padding:8px 14px;margin-bottom:16px;font-size:12px;color:#B8862E;font-weight:600;";
      label.textContent = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t("curtain_preview_label") : "Preview: scores reflect content attributes, not your interactions yet.";
      const container = document.getElementById("curtain-scores");
      container.parentNode.insertBefore(label, container);
    }
  },

  _renderScores() {
    const ranked = ScoringEngine.rankAll();
    const top8 = ranked.slice(0, 8);

    this._scoresContainer.innerHTML = "";

    for (const item of top8) {
      const breakdown = ScoringEngine.getScoreBreakdown(item.post);
      breakdown.post = item.post;
      const card = this._createScoreCard(breakdown);
      this._scoresContainer.appendChild(card);
    }
  },

  _createScoreCard(breakdown) {
    const card = document.createElement("div");
    card.className = "score-card";

    // Headline (truncated to 42 chars)
    const headline = document.createElement("div");
    headline.className = "score-card-headline";
    
    let raw = breakdown.headline;
    if (typeof Feed !== 'undefined' && Feed._getTranslatedText && breakdown.post) {
      raw = Feed._getTranslatedText(breakdown.post, 'headline');
    } else if (typeof i18n !== 'undefined' && i18n.currentLang && breakdown.post) {
      const lang = i18n.currentLang;
      if (lang !== 'en' && breakdown.post['headline_' + lang]) {
        raw = breakdown.post['headline_' + lang];
      }
    }

    headline.textContent = raw.length > 42
      ? raw.substring(0, 42).replace(/\s+\S*$/, "") + "…"
      : raw;
    card.appendChild(headline);

    // Category tag
    const catTag = document.createElement("span");
    catTag.className = "score-card-category";
    const translatedCat = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('cat_' + breakdown.category) : breakdown.category;
    catTag.textContent = translatedCat;
    catTag.style.backgroundColor = this._getCategoryColor(breakdown.category);
    card.appendChild(catTag);

    // Score rows
    const components = [
      { label: (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('score_affinity') : "Affinity", value: breakdown.components.category_affinity },
      { label: (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('score_emotion') : "Emotion", value: breakdown.components.emotional_resonance },
      { label: (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('score_engagement') : "Engagement", value: breakdown.components.engagement_potential },
      { label: (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('score_recency') : "Recency", value: breakdown.components.recency_boost }
    ];

    for (const comp of components) {
      card.appendChild(this._createScoreRow(comp.label, comp.value));
    }

    // Total score
    const totalRow = document.createElement("div");
    totalRow.className = "score-total";

    const totalLabel = document.createElement("span");
    totalLabel.className = "score-total-label";
    totalLabel.textContent = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('score_total') : "TOTAL";

    const totalValue = document.createElement("span");
    totalValue.className = "score-total-value";
    totalValue.textContent = breakdown.total.toFixed(2);

    totalRow.appendChild(totalLabel);
    totalRow.appendChild(totalValue);
    card.appendChild(totalRow);

    return card;
  },

  _createScoreRow(label, value) {
    const row = document.createElement("div");
    row.className = "score-row";

    const labelEl = document.createElement("span");
    labelEl.className = "score-label";
    labelEl.textContent = label;

    const barTrack = document.createElement("div");
    barTrack.className = "score-bar-track";
    const barFill = document.createElement("div");
    barFill.className = "score-bar-fill";
    barFill.style.width = (Math.min(value, 1) * 100) + "%";
    barTrack.appendChild(barFill);

    const valueEl = document.createElement("span");
    valueEl.className = "score-value";
    valueEl.textContent = value.toFixed(2);

    row.appendChild(labelEl);
    row.appendChild(barTrack);
    row.appendChild(valueEl);

    return row;
  },

  _renderAffinities() {
    const affinities = ScoringEngine.getCategoryAffinities();

    this._affinitiesContainer.innerHTML = "";

    for (const aff of affinities) {
      const row = document.createElement("div");
      row.className = "affinity-row";

      const label = document.createElement("span");
      label.className = "affinity-label";
      const translatedCat = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('cat_' + aff.category) : aff.category;
      label.textContent = translatedCat;

      const barTrack = document.createElement("div");
      barTrack.className = "affinity-bar-track";
      const barFill = document.createElement("div");
      barFill.className = "affinity-bar-fill";
      barFill.style.width = (aff.normalized * 100) + "%";
      barFill.style.backgroundColor = this._getCategoryColor(aff.category);
      barTrack.appendChild(barFill);

      const value = document.createElement("span");
      value.className = "affinity-value";
      value.textContent = aff.normalized.toFixed(2);

      row.appendChild(label);
      row.appendChild(barTrack);
      row.appendChild(value);

      this._affinitiesContainer.appendChild(row);
    }
  },

  _getCategoryColor(category) {
    const colors = {
      politics: "#4A74C4",
      science: "#5C7A6B",
      entertainment: "#8B7E5A",
      health: "#A8412E",
      conspiracy: "#EF4444",
      sports: "var(--news-accent)",
      lifestyle: "#8B6F47",
      technology: "#4A5568"
    };
    return colors[category] || "#6B7280";
  }
};

if (typeof window !== 'undefined') {
  window.Curtain = Curtain;
  window.addEventListener('languageChanged', () => {
    if (window.Curtain && window.Curtain.render) {
      window.Curtain.render();
    }
  });
}
