/* ============================================================
   ECHOBREAKER — Internationalization (i18n) Engine
   Supports English (en), Arabic (ar - RTL), French (fr), Spanish (es)
   ============================================================ */

const i18n = {
  currentLang: 'en',

  translations: {
    en: {
      "nav_feed": "Feed",
      "nav_game": "Game",
      "nav_toolkit": "Toolkit",
      "nav_dashboard": "Dashboard",
      "nav_behind_curtain": "Behind the Curtain",
      "nav_back_simulator": "Back to Simulator",

      "onboarding_title": "Can You Escape Your Algorithm?",
      "onboarding_text": "Experience how social media algorithms learn from your clicks. Scroll and interact to see your feed change in real-time.",
      "onboarding_hint": "Every click teaches the algorithm what to show you — and what to suppress.",
      "btn_start_free": "Start Free Simulation",
      "btn_start_persona": "Guided Demo: Sports Fan",

      "guide_msg_1": "👋 This feed is already shaped by your interests. Scroll and like posts you find interesting.",
      "guide_msg_2": "📉 Notice the diversity bar dropping? The algorithm is narrowing your world.",
      "guide_msg_3": "🔍 Try the 'Behind the Curtain' button to see the algorithm's actual scores.",
      "guide_msg_4": "🎯 You've just experienced how echo chambers form. The algorithm showed you more of what you already liked — and hid everything else.",

      "status_interactions": "Your interactions:",
      "status_session": "Session:",
      "btn_like": "Like",
      "btn_liked": "Liked",

      "curtain_title": "Algorithm Scores",
      "curtain_subtitle": "Why you see what you see",
      "curtain_formula": "score = 0.4×affinity + 0.3×emotion + 0.2×engagement + 0.1×recency",
      "curtain_affinities_title": "Category Affinities",
      "curtain_top_ranked": "Top Ranked Content",
      "curtain_preview_label": "Preview: scores reflect content attributes, not your interactions yet.",
      "score_affinity": "Affinity",
      "score_emotion": "Emotion",
      "score_engagement": "Engagement",
      "score_recency": "Recency",
      "score_total": "TOTAL",

      "gauge_label": "Feed Diversity Level",
      "gauge_healthy": "Diverse Feed",
      "gauge_warning": "Narrowing",
      "gauge_danger": "Echo Chamber",

      "modal_echo_title": "You've Entered an Echo Chamber!",
      "modal_echo_desc": "The algorithm has narrowed your world based on your interactions.",
      "metric_time_label": "Time to Echo Chamber",
      "metric_cat_label": "Dominant Category",
      "metric_domination_label": "Feed Domination",
      "btn_next_analyze": "Next: Analyze",
      "modal_q2_title": "Why did this specific content dominate your feed?",
      "q2_option_views": "Because it's the most viewed content globally",
      "q2_option_algo": "Because the algorithm learned my preferences and filtered everything else out",
      "q2_option_ads": "Because it's paid advertisements",
      "q2_option_dontknow": "I don't know",
      "modal_q3_title": "Which action will you take next in your real social media apps?",
      "q3_option_diversify": "Actively search for topics I usually ignore to diversify my feed",
      "q3_option_verify": "Verify sources before believing sensational headlines",
      "q3_option_follow": "Follow accounts with different viewpoints",
      "q3_option_none": "No specific action",
      "btn_submit_impact": "Submit & See Results",

      "cat_health": "Health",
      "cat_politics": "Politics",
      "cat_technology": "Technology",
      "cat_conspiracy": "Conspiracy",
      "cat_sports": "Sports",
      "cat_science": "Science",
      "cat_lifestyle": "Lifestyle",
      "cat_entertainment": "Entertainment",

      "game_hero_badge": "Classroom Edition · MIL Role-Play",
      "game_hero_title": "Echo Escape — Classroom Card Game",
      "game_hero_sub": "An interactive classroom scenario arena & media literacy role-play experience for youth.",
      "tab_rulebook": "Teacher Rulebook",
      "tab_roles": "Role Cards Deck",
      "tab_framework": "4A MIL Framework",
      "tab_roadmap": "Roadmap",
      "roles_badge": "Character Roles",
      "roles_title": "Role Cards Deck",
      "roles_sub": "Distinct objectives and powers assigned to each student in the classroom role-play.",
      "framework_badge": "Pedagogical Basis",
      "framework_title": "The 4A Media Literacy Framework",
      "framework_sub": "Core UNESCO conceptual pillars explored through post-game debrief discussion.",
      "roadmap_badge": "Roadmap",
      "roadmap_title": "Phase 2: Localization & Inclusion",
      "roadmap_sub": "Extending reach to linguistically and culturally diverse communities.",
      "filter_all": "All Cards",
      "filter_misleading": "Misleading",
      "filter_credible": "Credible",
      "filter_lock_msg": "🔒 Filters locked to prevent cheating. Guess all 12 cards to unlock.",
      "btn_guess_credible": "✅ Credible",
      "btn_guess_misleading": "🚩 Misleading",
      "tracker_inspected": "Inspected:",
      "tracker_correct": "Correct:",
      "tracker_accuracy": "Accuracy:",

      "btn_open_toolkit": "Open Agency Toolkit →",
      "fan_algo_tag": "Algorithm",
      "fan_algo_title": "The Math Behind Your Feed",
      "fan_creator_tag": "Creator",
      "fan_creator_title": "Sensational Reach vs Truth",
      "fan_checker_tag": "Fact-Checker",
      "fan_checker_title": "Exposing Red Flags",
      "fan_user_tag": "User",
      "fan_user_title": "Reclaiming Feed Agency",
      "fan_analyzer_tag": "Scorekeeper",
      "badge_interactive_deck": "Interactive Card Deck",
      "verdict_question": "What's your verdict?",
      "scenario_label": "SCENARIO #",
      "showing_scenario_cards": "Showing {0} of {1} Scenario Cards",
      "verdict_you_were_right": "You were right!",
      "verdict_not_quite": "Not quite — this was actually",
      "label_red_flags": "Red Flags:",
      "label_discussion": "Discussion:",
      "facilitation_badge": "Classroom Facilitation",
      "facilitation_title": "Classroom Facilitation Guide",
      "facilitation_sub": "A structured 30-minute lesson flow designed for high schools and youth workshops.",
      "step1_title": "Setup & Role Assignment",
      "step1_body": "Divide students into groups of 4–6. Assign core roles: 1 Algorithm, 1 User, 1 Creator, 1 Fact-Checker. Remaining students become Audience Analyzers to log engagement math publicly.",
      "step2_title": "Play 3 System Rounds",
      "step2_body": "• Publish: Creator draws 3 cards & rates sensationalism. • Rank: Algorithm calculates totals & shows top 2 cards to User. • Verify: Fact-Checker inspects 1 card per round. • Log: Analyzers record categories on the scoreboard.",
      "step3_title": "Scoring & System Debrief",
      "step3_body": "• Algorithm + Creator win if User receives 3+ misleading cards uncaught. • Fact-Checker + User win if they catch 2+ misleading cards AND maintain 4+ different categories. • Otherwise: System Complexity Draw.",
      "debrief_tip": "Teacher Debrief Tip: Keep the Audience Analyzers' board hidden from the User until Round 3 ends. Revealing it right before scoring — 'Here is what the class saw the whole time that you never did' — creates your strongest debrief moment!",
      "cta_ready_title": "Ready for Real-World Feed Auditing?",
      "cta_ready_sub": "Help students audit their own social feeds with the Agency Toolkit — a step-by-step take-home checklist.",

      "role_algo_tag": "Algorithm",
      "role_user_tag": "Audience",
      "role_creator_tag": "Content Producer",
      "role_checker_tag": "MIL Guardian",
      "role_analyzer_tag": "Scorekeeper",

      "role_algo_title": "THE ALGORITHM",
      "role_algo_goal": "Goal: Maximum User Engagement",
      "role_algo_desc": "<strong>⚡ Mechanics:</strong> Add up engagement numbers on all 3 published cards. Reveal only the top 2 totals to the User. You cannot override the math.",
      "role_user_title": "THE USER",
      "role_user_goal": "Goal: Stay Informed & Spot Missing Info",
      "role_user_desc": "<strong>⚡ Mechanics:</strong> Once per round, ask \"What am I NOT seeing?\" — the Algorithm must reveal one hidden post from that round.",
      "role_creator_title": "THE CREATOR",
      "role_creator_goal": "Goal: Maximum Reach & Visibility",
      "role_creator_desc": "<strong>⚡ Mechanics:</strong> Draw 3 scenario cards each round. Rate them 1–5 on headline sensationalism before handing them to the Algorithm.",
      "role_checker_title": "THE FACT-CHECKER",
      "role_checker_goal": "Goal: Expose Misinformation",
      "role_checker_desc": "<strong>⚡ Mechanics:</strong> Once per round, flip 1 card to reveal its truth. If misleading, the Algorithm removes it from the feed.",
      "role_analyzer_title": "THE AUDIENCE ANALYZER",
      "role_analyzer_goal": "Goal: Log System Metrics",
      "role_analyzer_desc": "<strong>⚡ Mechanics:</strong> Log the 3 engagement totals and update the class Feed Tracker with the 2 shown categories. You are the scoreboard!",

      "fw_algo_title": "Algorithm",
      "fw_algo_quote": "\"Who decides what you see — and why?\"",
      "fw_algo_desc": "Recommendation systems select content to maximize time spent on platform, not truth. Understanding algorithmic control is the first step to reclaiming attention.",
      "fw_amp_title": "Amplification",
      "fw_amp_quote": "\"Why does outrage travel faster than nuance?\"",
      "fw_amp_desc": "Emotional content generates higher click-through rates. The algorithm rewards engagement, causing misinformation to naturally amplify at scale.",
      "fw_att_title": "Attention",
      "fw_att_quote": "\"Are you choosing, or is the feed choosing for you?\"",
      "fw_att_desc": "Every scroll is data. Algorithms track dwell time and reaction history, narrowing your world over time to what keeps you engaged longest.",
      "fw_agency_title": "Agency",
      "fw_agency_quote": "\"What can YOU actually do about it?\"",
      "fw_agency_desc": "Media literacy provides deliberate choice. Diversify sources, clear watch histories, and seek contrasting perspectives to transform from a passive scroll to an active citizen.",

      "roadmap_fr_title": "French (Phase 2)",
      "roadmap_fr_desc": "Francophone sub-Saharan Africa deployment. Aligned with UNESCO MIL curriculum frameworks used in West African educational systems.",
      "roadmap_es_title": "Spanish (Phase 3)",
      "roadmap_es_desc": "Latin American youth adaptation with region-specific misinformation case studies (health, political, migration-related content).",
      "roadmap_a11y_title": "Accessibility Audit",
      "roadmap_a11y_desc": "WCAG 2.1 AA compliance review. Screen reader navigation, keyboard-only operation, and high-contrast mode for visually impaired learners.",

      "verdict_tag_misleading": "MISLEADING",
      "verdict_tag_credible": "CREDIBLE",

      "toolkit_hero_badge": "Self-Guided Audit",
      "toolkit_hero_title": "Agency Toolkit — Take Back Control",
      "toolkit_hero_sub": "A practical guide to auditing your social media algorithms and reclaiming digital agency.",
      "btn_print_audit": "Print My Audit Sheet",
      "btn_reset_audit": "Reset Audit Progress",
      "completed_label": "Audit Tasks Completed",
      "reset_modal_title": "Reset Audit Progress?",
      "reset_modal_desc": "This will clear all completed audit checklist items and reset your progress badge.",
      "btn_cancel": "Cancel",
      "btn_confirm_reset": "Reset All Progress",

      "toolkit_badge": "Agency Toolkit",
      "toolkit_hero_title": "Take Back Control",
      "toolkit_hero_sub": "The algorithm shapes your feed based on past interactions. Use this step-by-step audit checklist to reset recommendation models and reclaim your digital agency.",
      "btn_print_audit": "Print My Audit Sheet",
      "btn_back_game": "Back to Game",
      "btn_reset_audit": "Reset Audit Progress",
      "nav_back_simulator": "Back to Simulator",
      "stamp_novice": "STAMP: NOVICE AUDITOR",
      "stamp_aware": "STAMP: FEED AWARE",
      "stamp_guardian": "STAMP: ALGORITHM GUARDIAN",
      "stamp_expert": "STAMP: DIGITAL AGENCY EXPERT",
      "stamp_master": "STAMP: MASTER AMBASSADOR",
      "actions_completed_label": "actions completed",
      "section_platform_audit": "Step-by-Step Platform Audit",
      "section_platform_actions": "Platform Checklists & Actions",
      "platform_tiktok_title": "TikTok Algorithm Audit",
      "platform_tiktok_time": "~3 min · 4 Action items",
      "platform_youtube_title": "YouTube Recommendation Audit",
      "platform_youtube_time": "~4 min · 5 Action items",
      "platform_instagram_title": "Instagram & Meta Ad Audit",
      "platform_instagram_time": "~4 min · 5 Action items",
      "platform_habits_title": "Critical Thinking & Sharing Habits",
      "platform_habits_time": "~5 min · 6 Action items",
      "diff_easy_1m": "Easy · 1 min",
      "diff_easy_2m": "Easy · 2 min",
      "diff_medium_2m": "Medium · 2 min",
      "diff_hard_2m": "Advanced · 2 min",
      "diff_hard_3m": "Advanced · 3 min",

      "tt1_title": "Clear your watch history",
      "tt1_desc": "Profile → Settings → Content preferences → Clear watch history. Resets the algorithm's short-term recommendation model.",
      "tt2_title": "Mark 3 \"Not Interested\" videos in non-preferred topics",
      "tt2_desc": "Long-press any video → \"Not Interested.\" Actively signals negative weight for unwanted clickbait.",
      "tt3_title": "Turn off Personalized Ads",
      "tt3_desc": "Settings → Privacy → Ads personalization → Off. Reduces cross-site tracking profiles.",
      "tt4_title": "Follow 2 accounts from categories you normally ignore",
      "tt4_desc": "Follow science or documentary channels to inject category diversity into your recommendation pool.",

      "yt1_title": "Pause Watch History in Google Account Settings",
      "yt1_desc": "myaccount.google.com → Data & Privacy → YouTube History → Turn Off. Prevents historical click logging.",
      "yt2_title": "Turn off Autoplay switch",
      "yt2_desc": "Disables automatic video progression so YOU choose what to watch next instead of the AI loop.",
      "yt3_title": "Remove 5 regretful videos from Watch History",
      "yt3_desc": "History → Remove clickbait videos that led down unhelpful rabbit holes.",
      "yt4_title": "Click \"Don't Recommend Channel\" on 3 outrage channels",
      "yt4_desc": "Three dots next to video → \"Don't recommend channel.\" Stronger negative signal than ignoring.",
      "yt5_title": "Subscribe to 1 educational or documentary channel",
      "yt5_desc": "Subscriptions send high-priority signals to YouTube's homepage candidate generator.",

      "ig1_title": "Turn off \"Similar Account Suggestions\"",
      "ig1_desc": "Settings → Account → Similar Account Suggestions → Off. Stops profile bubble clustering.",
      "ig2_title": "Mute 3 accounts triggering negative feelings",
      "ig2_desc": "Long-press post → Mute. Cleans your feed without the social friction of unfollowing.",
      "ig3_title": "Set a daily time limit reminder (e.g. 30 mins)",
      "ig3_desc": "Settings → Your activity → Time spent → Set daily reminder to break infinite scrolling.",
      "ig4_title": "Turn off \"Ads based on partner data\"",
      "ig4_desc": "Settings → Ad preferences → Ads outside Meta → Off. Prevents off-app behavior tracking.",
      "ig5_title": "Mark 3 Explore posts as \"Not Interested\"",
      "ig5_desc": "Explore grid → Three dots → Not Interested. Trains the recommendation system directly.",

      "hb1_title": "Read past the headline before sharing",
      "hb1_desc": "Misleading posts rely on emotional headlines that contradict article body details.",
      "hb2_title": "Cross-verify claims on trusted fact-check outlets",
      "hb2_desc": "Use Snopes, FactCheck.org, or national fact-checking registries before reposting.",
      "hb3_title": "Bookmark 1 trusted direct journalism source",
      "hb3_desc": "Access news directly rather than waiting for recommendation feeds to select it for you.",
      "hb4_title": "Notice emotional outrage before clicking",
      "hb4_desc": "Treat intense anger or fear as an algorithmic alert signal that content is optimizing for attention.",
      "hb5_title": "Teach 1 family member what a filter bubble is",
      "hb5_desc": "Teaching someone else is the highest level of learning. Show them the EchoBreaker simulator!",
      "hb6_title": "Create a 30-minute media-free morning routine",
      "hb6_desc": "Start your day without algorithmic input to protect baseline cognitive clarity.",

      "reflection_section_badge": "Self Assessment",
      "reflection_section_title": "Interactive Personal Reflection",
      "reflection_q1_title": "1. How aware are you now of how algorithms shape your feed?",
      "scale_q1_1": "1 — Unaware",
      "scale_q1_2": "2 — Slightly Aware",
      "scale_q1_3": "3 — Moderately Aware",
      "scale_q1_4": "4 — Very Aware",
      "scale_q1_5": "5 — Expert Guardian",
      "reflection_q1_ph": "What surprised you most during your feed audit?",
      "reflection_q2_title": "2. Which category dominates YOUR real social media feed?",
      "cat_sports": "Sports",
      "cat_health": "Health/Wellness",
      "cat_politics": "Politics",
      "cat_tech": "Technology",
      "cat_outrage": "Conspiracy/Outrage",
      "reflection_q2_ph": "Describe one action you will take to diversify your feed...",
      "reflection_q3_title": "3. Meta-Audit: The Irony of Persuasive Design",
      "reflection_q3_desc": "Did you notice the glowing badges, the 3D flip cards, and the \"Live\" pulsing dots in this app? We intentionally used <strong>standard persuasive design (gamification)</strong> to keep you engaged while teaching you how to resist it.<br><br>How does it feel to recognize these emotional triggers working on you right now? Is using persuasive design to teach algorithmic literacy acceptable, or concerning?",
      "reflection_q3_ph": "Reflect on your own emotional reaction to the badges and levels in this app...",
      "privacy_notice": "<strong>Your written reflections</strong> (the text you type above) are saved <strong>locally on your device only</strong> and are never transmitted to any server. However, when you complete the simulator's impact questionnaire on the Feed page, <strong>anonymous numerical metrics</strong> (time to echo chamber, dominant category, and your multiple-choice answers — no text) may be submitted to our secure Firebase database for aggregated impact measurement. No personal identifiers are ever collected. See the Command Center page for full transparency.",
      "reward_title": "Audit Completed! You are a Certified Master Algorithm Ambassador",
      "reward_sub": "You have completed all 20 audit actions across TikTok, YouTube, Instagram, and daily habits. Your information environment is now intentionally curated.",
      "btn_print_cert": "Print Official Certificate",
      "btn_view_telemetry": "View Global Telemetry",

      "dash_title": "Global MIL Impact Command Center",
      "dash_subtitle": "Aggregated, anonymized telemetry tracking youth algorithmic awareness and post-simulation pledges.",
      "dash_mode_badge": "ILLUSTRATIVE TEMPLATE · NOT LIVE DATA — This dashboard demonstrates how pilot impact data would be visualized after classroom deployment.",
      "dash_display": "Display:",
      "dash_btn_demo": "Sample Template",
      "dash_btn_live": "Live Pilot Data",
      "dash_btn_refresh": "Refresh",
      "dash_btn_print": "Print Report",
      "dash_banner_title": "Illustrative Template — Not Empirical Data",
      "dash_kpi_participants": "Total Pilot Participants",
      "dash_kpi_rules": "Identified Algorithm Rules",
      "dash_kpi_time": "Avg. Time to Echo Chamber",
      "dash_kpi_domination": "Feed Domination at Echo",
      "dash_kpi_pledged": "Pledged Audit Action",
      "dash_insight_title": "Key Educational Insight & Pedagogical Mechanics",
      "dash_insight_desc": "Interactive feed simulation demonstrates how recommendation AI turns engagement into filter bubbles. Live visual debugging (\"Behind the Curtain\") provides immediate feedback, reinforcing media and information literacy (MIL) concepts by letting learners see the math behind their feed.",
      "dash_chart_categories": "Most Common Echo Chamber Categories",
      "dash_chart_pledges": "Post-Simulation Behavioral Action Pledges",
      "dash_table_title": "Illustrative School Deployment Template",
      "dash_table_subtitle": "ILLUSTRATIVE TEMPLATE — Not Real Deployment Data",
      "dash_th_site": "Deployment Site",
      "dash_th_participants": "Participants",
      "dash_th_time": "Avg. Time to Echo",
      "dash_th_literacy": "Algorithmic Literacy Gain",
      "dash_th_pledges": "Audit Pledges",
      "dash_th_status": "Status",
      "dash_site_a": "Site A (Metropolitan High)",
      "dash_site_b": "Site B (Regional Academy)",
      "dash_site_c": "Online MIL Workshop",
      "dash_site_d": "Community Center Cohort",
      "dash_status_pending": "Pending",
      "btn_demo_mode": "Sample Template",
      "btn_live_mode": "Live Pilot Data",
      "btn_refresh": "Refresh",
      "btn_print_report": "Print Report",
      "kpi_total_users": "Total Pilot Participants",
      "kpi_knowledge": "Identified Algorithm Rules",
      "kpi_avg_time": "Avg. Time to Echo Chamber",
      "kpi_domination": "Feed Domination at Echo",
      "kpi_behavior": "Pledged Audit Action",
      "table_deployment_site": "Deployment Site",
      "table_status": "Status",
      "table_pending": "Pending"
    },

  },

  flags: {
    ar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" class="flag-svg"><rect width="450" height="600" fill="#006633"/><rect x="450" width="450" height="600" fill="#ffffff"/><path d="M 525,300 A 120,120 0 1,0 470,410 A 100,100 0 1,1 525,300 Z" fill="#d21034"/><polygon points="510,270 519,297 547,297 524,314 533,341 510,324 487,341 496,314 473,297 501,297" fill="#d21034"/></svg>`,
    en: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" class="flag-svg"><clipPath id="uk-clip"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="uk-diag"><path d="M0,0 L60,30 M60,0 L0,30"/></clipPath><g clip-path="url(#uk-clip)"><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#cf142b" stroke-width="4" clip-path="url(#uk-diag)"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#cf142b" stroke-width="6"/></g></svg>`,
    fr: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" class="flag-svg"><rect width="1" height="2" fill="#002395"/><rect x="1" width="1" height="2" fill="#ffffff"/><rect x="2" width="1" height="2" fill="#ed2939"/></svg>`,
    es: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" class="flag-svg"><rect width="750" height="500" fill="#c60b1e"/><rect y="125" width="750" height="250" fill="#ffc400"/></svg>`
  },

  options: [
    { code: 'en', label: 'English' }
  ],

  injectLanguageSelector() {
    return; // Removed language options per user request
    const headerRight = document.querySelector('.header-right');

    const wrapper = document.createElement('div');
    wrapper.id = 'eb-lang-select-wrapper';
    wrapper.className = 'lang-select-wrapper';

    const activeOpt = this.options.find(o => o.code === this.currentLang) || this.options[1];

    wrapper.innerHTML = `
      <button id="eb-lang-trigger" class="lang-trigger-btn" type="button" aria-haspopup="true" aria-expanded="false" title="Change Language">
        <span class="lang-flag-current">${this.flags[this.currentLang] || this.flags.en}</span>
        <span class="lang-label-current">${activeOpt.label}</span>
        <span class="lang-arrow">▾</span>
      </button>
      <div id="eb-lang-dropdown" class="lang-dropdown-menu" hidden>
        ${this.options.map(opt => `
          <button type="button" class="lang-menu-item ${opt.code === this.currentLang ? 'active' : ''}" data-lang="${opt.code}">
            <span class="flag-wrapper">${this.flags[opt.code]}</span>
            <span class="lang-name">${opt.label}</span>
          </button>
        `).join('')}
      </div>
    `;

    headerRight.insertBefore(wrapper, headerRight.firstChild);

    const trigger = wrapper.querySelector('#eb-lang-trigger');
    const dropdown = wrapper.querySelector('#eb-lang-dropdown');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !dropdown.hidden;
      dropdown.hidden = isOpen;
      trigger.setAttribute('aria-expanded', !isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        dropdown.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    dropdown.querySelectorAll('.lang-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const lang = item.getAttribute('data-lang');
        this.setLanguage(lang);
        dropdown.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
      });
    });
  },

  t(key) {
    const dict = this.translations[this.currentLang] || this.translations.en;
    return dict[key] || this.translations.en[key] || key;
  }
};

if (typeof document !== 'undefined') {
  localStorage.setItem('echobreaker_lang', 'en');
  i18n.currentLang = 'en';
  if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", () => {
      i18n.init();
      if (document.body) {
        document.body.classList.remove('rtl-mode');
        document.body.dir = 'ltr';
      }
    });
  } else {
    i18n.init();
    if (document.body) {
      document.body.classList.remove('rtl-mode');
      document.body.dir = 'ltr';
    }
  }
}

if (typeof window !== 'undefined') {
  window.i18n = i18n;
}
