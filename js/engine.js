/* ============================================================
   ECHOBREAKER — Scoring Engine
   
   FORMULA (DO NOT CHANGE THESE WEIGHTS):
   score = (0.40 × category_affinity) +
           (0.30 × emotional_resonance) +
           (0.20 × engagement_potential) +
           (0.10 × recency_boost)
   ============================================================ */

const ScoringEngine = {

  // --- User State (in-memory only, lost on reload) ---
  userState: {
    categoryAffinities: {
      health: 0, politics: 0, entertainment: 0,
      conspiracy: 0, science: 0, sports: 0,
      lifestyle: 0, technology: 0
    },
    emotionalAffinities: {
      anger: 0, fear: 0, joy: 0, surprise: 0,
      neutral: 0, sadness: 0, outrage: 0
    },
    likedPostIds: new Set(),
    dwelledPostIds: new Set(),
    totalInteractions: 0,
    sessionStartTime: Date.now()
  },

  // --- Listeners ---
  _listeners: [],

  onChange(callback) {
    this._listeners.push(callback);
  },

  _notify() {
    for (const cb of this._listeners) {
      cb();
    }
  },

  // --- Interactions ---

  like(postId) {
    if (this.userState.likedPostIds.has(postId)) return;

    const post = CONTENT_POOL.find(p => p.id === postId);
    if (!post) return;

    this.userState.likedPostIds.add(postId);
    this.userState.categoryAffinities[post.category] += 1.0;
    this.userState.emotionalAffinities[post.emotional_tone] += 0.5;
    this.userState.totalInteractions += 1;
    this._notify();
  },

  unlike(postId) {
    if (!this.userState.likedPostIds.has(postId)) return;

    const post = CONTENT_POOL.find(p => p.id === postId);
    if (!post) return;

    this.userState.likedPostIds.delete(postId);
    this.userState.categoryAffinities[post.category] = Math.max(0, this.userState.categoryAffinities[post.category] - 1.0);
    this.userState.emotionalAffinities[post.emotional_tone] = Math.max(0, this.userState.emotionalAffinities[post.emotional_tone] - 0.5);
    // Explicit Design Decision: totalInteractions measures overall platform engagement (unliking is an active action itself), so totalInteractions is not decremented.
    this._notify();
  },

  dwell(postId) {
    if (this.userState.dwelledPostIds.has(postId)) return;

    const post = CONTENT_POOL.find(p => p.id === postId);
    if (!post) return;

    this.userState.dwelledPostIds.add(postId);
    this.userState.categoryAffinities[post.category] += 0.3;
    this.userState.emotionalAffinities[post.emotional_tone] += 0.15;
    this.userState.totalInteractions += 1;
    this._notify();
  },

  isLiked(postId) {
    return this.userState.likedPostIds.has(postId);
  },

  // --- Scoring ---

  scorePost(post) {
    const catAff = this._normalizeCategoryAffinity(post.category);
    const emoRes = this._normalizeEmotionalResonance(post.emotional_tone);
    const engPot = post.engagement_potential / 10;
    const recBoost = this._recencyBoost(post);

    const total = (0.40 * catAff) +
                  (0.30 * emoRes) +
                  (0.20 * engPot) +
                  (0.10 * recBoost);

    return {
      total: total,
      components: {
        category_affinity: catAff,
        emotional_resonance: emoRes,
        engagement_potential: engPot,
        recency_boost: recBoost
      }
    };
  },

  getScoreBreakdown(post) {
    const score = this.scorePost(post);
    return {
      postId: post.id,
      headline: post.headline,
      category: post.category,
      total: score.total,
      components: score.components
    };
  },

  rankAll() {
    const scored = CONTENT_POOL.map(post => {
      const score = this.scorePost(post);
      return {
        post: post,
        score: score.total,
        components: score.components
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored;
  },

  // --- Persona Loading ---

  loadPersona(personaName) {
    if (personaName === "sports_fan") {
      this.userState.categoryAffinities.sports = 3.0;
      this.userState.categoryAffinities.health = 0.5;
      this.userState.emotionalAffinities.joy = 1.0;
      this.userState.emotionalAffinities.surprise = 0.5;
    }
    this._notify();
  },

  // --- Normalization Helpers ---

  _normalizeCategoryAffinity(category) {
    const affinities = this.userState.categoryAffinities;
    const maxAff = Math.max(...Object.values(affinities));

    if (maxAff === 0) return 0.5; // neutral at start

    return affinities[category] / maxAff;
  },

  _normalizeEmotionalResonance(tone) {
    const affinities = this.userState.emotionalAffinities;
    const maxAff = Math.max(...Object.values(affinities));

    if (maxAff === 0) return 0.5; // neutral at start

    return affinities[tone] / maxAff;
  },

  _recencyBoost(post) {
    if (typeof post.publishedHoursAgo === 'number') {
      return Math.max(0.1, Math.min(1.0, 1.0 - (post.publishedHoursAgo / 24)));
    }
    // Fair neutral recency score so array index position does not create artificial category bias
    return 0.5;
  },

  // --- Diversity ---

  getDiversityPercent(topN) {
    const ranked = this.rankAll();
    const top = ranked.slice(0, topN || 15);
    const categories = new Set(top.map(r => r.post.category));
    return Math.round((categories.size / 8) * 100);
  },

  // --- Category Affinities (for curtain panel) ---

  getCategoryAffinities() {
    const affinities = this.userState.categoryAffinities;
    const maxAff = Math.max(...Object.values(affinities), 1);

    const sorted = Object.entries(affinities)
      .map(([cat, val]) => ({
        category: cat,
        raw: val,
        normalized: val / maxAff
      }))
      .sort((a, b) => b.raw - a.raw);

    return sorted;
  }
};

if (typeof window !== 'undefined') {
  window.ScoringEngine = ScoringEngine;
}
