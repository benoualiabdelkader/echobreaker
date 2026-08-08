/* ============================================================
   ECHOBREAKER — Feed Renderer + Interaction Tracking
   - Renders post cards into the feed container
   - Handles like button clicks
   - Tracks dwell time via IntersectionObserver
   - Loads posts in batches of 20 (infinite scroll)
   ============================================================ */

const Feed = {

  _container: null,
  _observer: null,
  _dwellTimers: {},
  _batchSize: 20,
  _currentBatch: 0,
  _currentRanked: [],

  init() {
    this._container = document.getElementById("feed-container");
    this._setupIntersectionObserver();
    this._setupScrollListener();
  },

  render() {
    const ranked = ScoringEngine.rankAll();
    this._currentRanked = ranked;
    this._currentBatch = 0;

    // Clear existing
    this._container.innerHTML = "";
    if (this._observer) {
      this._observer.disconnect();
    }
    this._dwellTimers = {};

    // Render first batch
    this._renderBatch();
  },

  _renderBatch() {
    const start = this._currentBatch * this._batchSize;
    const end = Math.min(start + this._batchSize, this._currentRanked.length);

    if (start >= this._currentRanked.length) return;

    for (let i = start; i < end; i++) {
      const item = this._currentRanked[i];
      const card = this._createPostCard(item.post);
      this._container.appendChild(card);
      this._observer.observe(card);
    }

    this._currentBatch++;
  },

  _getCategoryIcon(category) {
    return "";  // CSS handles category labels
  },

  _createPostCard(post) {
    const card = document.createElement("article");
    card.className = "post-card";
    card.setAttribute("data-post-id", post.id);
    card.setAttribute("data-category", post.category);

    const catIcon = this._getCategoryIcon(post.category);
    const translatedCat = (typeof i18n !== 'undefined' && i18n.t) ? i18n.t('cat_' + post.category) : post.category;

    // Category tag
    const tag = document.createElement("div");
    tag.className = "post-category-tag";
    tag.setAttribute("data-category", post.category);
    tag.textContent = `${catIcon} ${translatedCat}`;
    card.appendChild(tag);

    // Image hero container
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "post-image-placeholder";
    imgWrapper.setAttribute("data-category", post.category);

    const realImg = document.createElement("img");
    realImg.className = "post-real-image";
    realImg.alt = "";
    realImg.loading = "eager";

    const imgSrc = post.imageUrl || (typeof getFallbackImage === 'function' ? getFallbackImage(post.category, post.headline) : "");
    realImg.src = imgSrc;

    realImg.onerror = () => {
      if (typeof getFallbackImage === 'function') {
        realImg.src = getFallbackImage(post.category, post.headline || post.category);
      }
    };

    imgWrapper.appendChild(realImg);
    card.appendChild(imgWrapper);

    // Translated Headline
    const finalHeadline = this._getTranslatedText(post, 'headline');

    const headline = document.createElement("h3");
    headline.className = "post-headline";
    headline.textContent = finalHeadline;
    card.appendChild(headline);

    // Translated Body
    const finalBody = this._getTranslatedText(post, 'body');

    const body = document.createElement("p");
    body.className = "post-body";
    body.textContent = finalBody;
    card.appendChild(body);

    // Actions row
    const actions = document.createElement("div");
    actions.className = "post-actions";

    // Like button (interactive)
    const likeBtn = document.createElement("button");
    likeBtn.className = "btn-like";
    likeBtn.setAttribute("data-post-id", post.id);
    likeBtn.setAttribute("aria-label", "Like this post");

    const isLiked = ScoringEngine.isLiked(post.id);
    if (isLiked) {
      likeBtn.classList.add("liked");
    }

    const heart = document.createElement("span");
    heart.className = "eb-icon eb-icon-heart-outline like-heart";
    if (isLiked) { heart.className = "eb-icon eb-icon-heart like-heart"; } else { heart.className = "eb-icon eb-icon-heart-outline like-heart"; }

    const likeCount = document.createElement("span");
    likeCount.className = "like-count";
    const hasInteractions = ScoringEngine.userState.totalInteractions > 0;
    likeCount.textContent = hasInteractions ? (this._baseEngagement(post, 12, 180) + (isLiked ? 1 : 0)) : "—";

    likeBtn.appendChild(heart);
    likeBtn.appendChild(likeCount);

    likeBtn.addEventListener("click", () => {
      if (likeBtn.classList.contains("liked")) {
        ScoringEngine.unlike(post.id);
        likeBtn.classList.remove("liked");
        heart.className = "eb-icon eb-icon-heart-outline like-heart";
        likeCount.textContent = this._baseEngagement(post, 12, 180);
      } else {
        ScoringEngine.like(post.id);
        likeBtn.classList.add("liked");
        heart.className = "eb-icon eb-icon-heart like-heart";
        likeCount.textContent = this._baseEngagement(post, 12, 180) + 1;
      }
    });

    actions.appendChild(likeBtn);

    // Comment count (display only)
    const commentSpan = document.createElement("span");
    commentSpan.className = "post-engagement";
    commentSpan.innerHTML = ""; // clear
    const commentIcon = document.createElement("span"); commentIcon.className = "eb-icon eb-icon-comment";
    const commentCount = document.createElement("span");
    commentCount.textContent = hasInteractions ? this._baseEngagement(post, 3, 45) : "—";
    commentSpan.appendChild(commentIcon);
    commentSpan.appendChild(commentCount);
    actions.appendChild(commentSpan);

    // Share count (display only)
    const shareSpan = document.createElement("span");
    shareSpan.className = "post-engagement";
    const shareIcon = document.createElement("span"); shareIcon.className = "eb-icon eb-icon-share"; shareIcon.style.marginRight = "6px";
    const shareCount = document.createElement("span");
    shareCount.textContent = hasInteractions ? this._baseEngagement(post, 1, 30) : "—";
    shareSpan.appendChild(shareIcon);
    shareSpan.appendChild(shareCount);
    actions.appendChild(shareSpan);

    card.appendChild(actions);

    return card;
  },

  _getTranslatedText(post, field) {
    const lang = (typeof i18n !== 'undefined' && i18n.currentLang) ? i18n.currentLang : 'en';
    if (lang === 'en') return post[field];

    const propKey = field + '_' + lang;
    if (post[propKey]) return post[propKey];

    if (typeof i18n !== 'undefined' && i18n.t) {
      const key1 = `${post.id}_${field}`;
      const key2 = `post_${post.id}_${field}`;

      let trans = i18n.t(key1);
      if (trans && trans !== key1 && !trans.startsWith('post_')) return trans;

      trans = i18n.t(key2);
      if (trans && trans !== key2 && !trans.startsWith('post_')) return trans;
    }

    return post[field];
  },

  // Engagement display: deterministic from post id + engagement_potential
  // Uses smaller, realistic numbers that scale with the post's actual potential score
  _baseEngagement(post, minVal, maxVal) {
    let hash = 0;
    for (let i = 0; i < post.id.length; i++) {
      hash = ((hash << 5) - hash) + post.id.charCodeAt(i);
      hash = hash & hash;
    }
    const range = maxVal - minVal;
    const variation = Math.abs(hash % (range + 1));
    const score = Math.min(post.engagement_potential, 10) / 10;
    const value = Math.round(minVal + variation * score);
    return value.toString();
  },

  // --- Dwell Time Tracking ---

  _setupIntersectionObserver() {
    this._observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const postId = entry.target.getAttribute("data-post-id");
        if (!postId) continue;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          // Post is >50% visible — start timer
          if (!this._dwellTimers[postId] && !ScoringEngine.userState.dwelledPostIds.has(postId)) {
            this._dwellTimers[postId] = setTimeout(() => {
              ScoringEngine.dwell(postId);
              delete this._dwellTimers[postId];
            }, 2000);
          }
        } else {
          // Post left viewport — cancel timer
          if (this._dwellTimers[postId]) {
            clearTimeout(this._dwellTimers[postId]);
            delete this._dwellTimers[postId];
          }
        }
      }
    }, {
      threshold: 0.5
    });
  },

  // --- Infinite Scroll ---

  _setupScrollListener() {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this._checkLoadMore();
          ticking = false;
        });
        ticking = true;
      }
    });
  },

  _checkLoadMore() {
    const scrollBottom = window.innerHeight + window.scrollY;
    const docHeight = document.documentElement.scrollHeight;

    // Load more when within 300px of bottom
    if (docHeight - scrollBottom < 300) {
      this._renderBatch();
    }
  }
};

if (typeof window !== 'undefined') {
  window.Feed = Feed;
  window.addEventListener('languageChanged', () => {
    if (window.Feed && window.Feed._container) {
      window.Feed.render();
    }
  });
}
