/* ============================================================
   ECHOBREAKER — Impact Measurement Module
   Handles the pre/post assessment modal when an echo chamber
   is reached to evaluate learning gains.
   ============================================================ */

const Impact = {
  _hasTriggered: false,
  _currentStep: 1,
  _data: {
    timeToEchoChamberMs: 0,
    dominantCategory: "",
    dominationPercent: 0,
    knowledgeAnswer: null,
    behaviorAnswer: null
  },

  init() {
    this._bindEvents();
  },

  _bindEvents() {
    // Step 1 -> Step 2
    document.getElementById("btn-impact-next-1")?.addEventListener("click", () => {
      this._goToStep(2);
    });

    // Step 2 -> Step 3
    document.getElementById("btn-impact-next-2")?.addEventListener("click", () => {
      this._goToStep(3);
    });

    // Step 3 -> Step 4
    document.getElementById("btn-impact-submit")?.addEventListener("click", () => {
      this._submitData();
      this._goToStep(4);
    });

    // Close Modal
    document.getElementById("btn-impact-close")?.addEventListener("click", () => {
      document.getElementById("impact-modal").classList.add("hidden");
    });

    // Radio button logic for Step 2
    const knowRadios = document.querySelectorAll('input[name="knowledge_q"]');
    knowRadios.forEach(radio => {
      radio.addEventListener("change", (e) => {
        this._data.knowledgeAnswer = e.target.value;
        this._updateRadioStyles('knowledge_q');
        document.getElementById("btn-impact-next-2").disabled = false;
        document.getElementById("btn-impact-next-2").classList.remove("btn-disabled");
      });
    });

    // Radio button logic for Step 3
    const behRadios = document.querySelectorAll('input[name="behavior_q"]');
    behRadios.forEach(radio => {
      radio.addEventListener("change", (e) => {
        this._data.behaviorAnswer = e.target.value;
        this._updateRadioStyles('behavior_q');
        document.getElementById("btn-impact-submit").disabled = false;
        document.getElementById("btn-impact-submit").classList.remove("btn-disabled");
      });
    });
  },

  _updateRadioStyles(name) {
    const options = document.querySelectorAll(`input[name="${name}"]`);
    options.forEach(opt => {
      if (opt.checked) {
        opt.closest('.quiz-option').classList.add('selected');
      } else {
        opt.closest('.quiz-option').classList.remove('selected');
      }
    });
  },

  _goToStep(step) {
    document.getElementById(`impact-step-${this._currentStep}`).classList.add("hidden");
    document.getElementById(`impact-step-${step}`).classList.remove("hidden");
    this._currentStep = step;
  },

  checkTrigger() {
    if (this._hasTriggered) return;

    const interactions = ScoringEngine.userState.totalInteractions;
    // Require at least 5 interactions to prevent instant triggering on load
    if (interactions < 5) return;

    const diversity = ScoringEngine.getDiversityPercent(15);
    
    // Trigger condition: Diversity drops to 35% or lower (Echo Chamber threshold)
    if (diversity <= 35) {
      this._hasTriggered = true;
      this._triggerModal();
    }
  },

  _triggerModal() {
    // 1. Calculate Passive Metrics
    const timeTaken = Date.now() - ScoringEngine.userState.sessionStartTime;
    this._data.timeToEchoChamberMs = timeTaken;
    
    const mins = Math.floor(timeTaken / 60000);
    const secs = Math.floor((timeTaken % 60000) / 1000);
    const timeStr = mins + ":" + (secs < 10 ? "0" : "") + secs;

    // Find dominant category from top 15
    const ranked = ScoringEngine.rankAll().slice(0, 15);
    const counts = {};
    let maxCount = 0;
    let maxCat = "";

    ranked.forEach(r => {
      const cat = r.post.category;
      counts[cat] = (counts[cat] || 0) + 1;
      if (counts[cat] > maxCount) {
        maxCount = counts[cat];
        maxCat = cat;
      }
    });

    this._data.dominantCategory = maxCat;
    this._data.dominationPercent = Math.round((maxCount / 15) * 100);

    // 2. Populate DOM
    document.getElementById("metric-time").textContent = timeStr;
    document.getElementById("metric-category").textContent = maxCat.charAt(0).toUpperCase() + maxCat.slice(1);
    document.getElementById("metric-domination").textContent = this._data.dominationPercent + "%";

    // 3. Show Modal
    document.getElementById("impact-modal").classList.remove("hidden");
  },

  async _submitData() {
    // Disable beforeunload warning so normal post-session navigation proceeds smoothly
    if (typeof App !== 'undefined' && App.disableBeforeUnload) {
      App.disableBeforeUnload();
    }
    // Print locally for debugging
    console.group("🚀 ECHO CHAMBER IMPACT DATA (PILOT STUDY)");
    console.log("Time to Echo Chamber:", (this._data.timeToEchoChamberMs / 1000).toFixed(1) + "s");
    console.log("Dominant Category:", this._data.dominantCategory);
    console.log("Feed Domination:", this._data.dominationPercent + "%");
    console.log("Knowledge Check (Correct=algorithm):", this._data.knowledgeAnswer);
    console.log("Behavioral Intention:", this._data.behaviorAnswer);
    console.groupEnd();

    // Send to Global Database (or LocalStorage)
    let isSavedToServer = false;
    if (typeof Telemetry !== 'undefined') {
      isSavedToServer = await Telemetry.saveImpact(this._data);
    }

    // Show personalized feedback on Step 4
    const feedbackEl = document.getElementById("impact-result-feedback");
    const iconEl = document.getElementById("impact-result-icon");
    const titleEl = document.getElementById("impact-result-title");

    if (feedbackEl) {
      const isCorrect = this._data.knowledgeAnswer === "algorithm";
      feedbackEl.style.display = "block";

      const networkWarning = !isSavedToServer ? 
        `<div style="margin-bottom:12px; padding:8px; background:rgba(184, 134, 46, 0.15); border:1px solid #B8862E; border-radius:6px; color:#7A5620; font-size:12px; text-align:center;">
          ⚠️ <strong>Network Issue:</strong> Could not reach Firebase server. Your data has been securely saved to your local device instead.
        </div>` : '';

        if (isCorrect) {
          const badgeCorrect = `<div style="margin-top:16px; text-align:center;">
            <div class="audit-stamp">✓ VERIFIED · ALGORITHMIC AMBASSADOR</div>
            <p style="font-size:12px; color:var(--news-ink-muted); margin-top:8px; margin-bottom:12px;">You accurately identified recommendation AI mechanics.</p>
            <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
              <a href="toolkit.html" class="btn-primary-cta" style="padding:6px 14px; font-size:12px;">🎒 Agency Toolkit</a>
              <a href="dashboard.html" class="btn-secondary-cta" style="padding:6px 14px; font-size:12px;">📊 Global Dashboard</a>
            </div>
          </div>`;

          iconEl.textContent = "🎯";
          titleEl.textContent = "Correct! You Understand the Algorithm.";
          feedbackEl.style.background = "rgba(92, 122, 107, 0.12)";
          feedbackEl.style.border = "1px solid rgba(92, 122, 107, 0.3)";
          feedbackEl.style.color = "var(--news-ink)";
          feedbackEl.innerHTML = networkWarning + `<strong style="color:#5C7A6B">✅ Correct!</strong> The content dominated your feed because the algorithm <strong>learned your preferences</strong> from your interactions — likes, pauses, and scrolling patterns. It then filtered out everything else.` + badgeCorrect;
        } else {
          const badgeExplorer = `<div style="margin-top:16px; text-align:center;">
            <div class="audit-stamp stamp-warning">⚠ AUDIT · ALGORITHMIC EXPLORER</div>
            <p style="font-size:12px; color:var(--news-ink-muted); margin-top:8px; margin-bottom:12px;">Good effort! Review the insight above to see how recommendation AI operates.</p>
            <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
              <a href="toolkit.html" class="btn-primary-cta" style="padding:6px 14px; font-size:12px;">🎒 Agency Toolkit</a>
              <a href="dashboard.html" class="btn-secondary-cta" style="padding:6px 14px; font-size:12px;">📊 Global Dashboard</a>
            </div>
          </div>`;

          iconEl.textContent = "💡";
          titleEl.textContent = "Impact Recorded — Here's What Really Happened";
          feedbackEl.style.background = "rgba(168, 65, 46, 0.12)";
          feedbackEl.style.border = "1px solid rgba(168, 65, 46, 0.3)";
          feedbackEl.style.color = "var(--news-ink)";
          feedbackEl.innerHTML = networkWarning + `<strong style="color:#A8412E">💡 The real answer:</strong> The content dominated because the algorithm <strong>learned your preferences</strong>. It tracked what you liked and paused on, built a model of you, then filtered out everything that didn't match.` + badgeExplorer;
        }
    }
  }
};
