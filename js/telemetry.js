/* ============================================================
   ECHOBREAKER — Telemetry System
   Handles sending data to Firebase or LocalStorage with robust fallbacks
   ============================================================ */

const Telemetry = {
  db: null,
  isConnected: false,
  sessionId: null,
  
  init() {
    // Generate or retrieve anonymous session ID for privacy-preserving deduplication
    let sid = localStorage.getItem('echobreaker_session_id');
    if (!sid) {
      sid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('echobreaker_session_id', sid);
    }
    this.sessionId = sid;

    if (typeof isFirebaseEnabled !== 'undefined' && isFirebaseEnabled) {
      try {
        if (!firebase.apps || !firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
        this.db = firebase.database();
        
        // Listen to actual connection state for true offline mode detection
        this.db.ref('.info/connected').on('value', (snap) => {
          this.isConnected = snap.val() === true;
          if (this.isConnected) {
            console.log("🟢 Telemetry: Firebase Connected (Global Mode)");
          } else {
            console.log("🟠 Telemetry: Firebase Disconnected (Falling back to LocalStorage)");
          }
        });
      } catch (e) {
        console.error("Firebase initialization failed:", e);
        this.isConnected = false;
        this._initLocalMockData();
      }
    } else {
      console.log("🟠 Telemetry: Offline Mode (Saving to LocalStorage)");
      this.isConnected = false;
      this._initLocalMockData();
    }
  },

  _initLocalMockData() {
    if (!localStorage.getItem('echobreaker_impact_data')) {
      // Start with an empty array. No fake data!
      localStorage.setItem('echobreaker_impact_data', JSON.stringify([]));
    }
  },

  _saveLocally(payload) {
    this._initLocalMockData();
    const localData = JSON.parse(localStorage.getItem('echobreaker_impact_data') || "[]");
    localData.push(payload);
    localStorage.setItem('echobreaker_impact_data', JSON.stringify(localData));
    console.log("✅ Data saved locally (Offline Backup)");
  },

  async saveImpact(data) {
    const payload = {
      ...data,
      timestamp: Date.now(),
      anonymousSessionId: this.sessionId // Used purely for deduplication without PII
    };

    if (this.db && this.isConnected) {
      try {
        // Wrap push in a promise to properly catch network/rule rejections
        await this.db.ref('impact_results').push(payload);
        console.log("✅ Data saved to Firebase");
        return true; // True indicates successful server sync
      } catch (err) {
        console.error("❌ Firebase save error:", err);
        // Fallback to local storage if Firebase push fails (e.g. permissions, adblocker)
        this._saveLocally(payload);
        return false;
      }
    } else {
      // Offline fallback
      this._saveLocally(payload);
      return false;
    }
  },

  async getGlobalData() {
    if (this.db) {
      const fetchPromise = new Promise((resolve, reject) => {
        // Scalability: limit reads to the last 500 records instead of the entire tree
        this.db.ref('impact_results')
          .limitToLast(500)
          .once('value', 
            (snapshot) => {
              const data = snapshot.val();
              if (!data) return resolve([]);
              resolve(Object.values(data));
            },
            (error) => {
              reject(error);
            }
          );
      });

      // 6-second timeout to prevent UI hang if Firebase is blocked
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Firebase fetch timeout")), 6000)
      );

      try {
        return await Promise.race([fetchPromise, timeoutPromise]);
      } catch (err) {
        console.error("❌ Failed to fetch global data:", err);
        return null; // Return null to explicitly indicate failure, allowing UI fallback
      }
    } else {
      return JSON.parse(localStorage.getItem('echobreaker_impact_data') || "[]");
    }
  }
};
