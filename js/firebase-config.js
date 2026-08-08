/* ============================================================
   ECHOBREAKER — Telemetry & Database Configuration
   ------------------------------------------------------------
   Project  : EchoBreaker
   Firebase : echobreaker-997d8
   Region   : default-rtdb (us-central1)
   API      : Compat (v8 namespace — firebase.initializeApp())
   ------------------------------------------------------------
   SECURITY NOTE: Client API keys are public by design in Firebase.
   Server-side database security is strictly enforced via Realtime
   Database Security Rules (see database.rules.json in repository):
     - Root read/write access is disabled ('.read': false, '.write': false).
     - Public write access is scoped strictly to 'impact_results/$entry_id'.
     - Write-once policy ('!data.exists()') prevents overwriting entries.
     - Strict schema validation enforces required fields and numeric ranges.
   ============================================================ */

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAGfFIpDrXeBl43_bSuDJlbV_4nmv5NZVs",
  authDomain:        "echobreaker-997d8.firebaseapp.com",
  databaseURL:       "https://echobreaker-997d8-default-rtdb.firebaseio.com",
  projectId:         "echobreaker-997d8",
  storageBucket:     "echobreaker-997d8.firebasestorage.app",
  messagingSenderId: "636249735405",
  appId:             "1:636249735405:web:a8a626b7a00b8bbdc78ce4",
  measurementId:     "G-KXB6RPF53S"
};

// Firebase is active — credentials are live and secured by server-side rules
const isFirebaseEnabled =
  Object.keys(FIREBASE_CONFIG).length > 0 &&
  FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY_HERE";
