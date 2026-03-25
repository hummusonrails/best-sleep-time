import { sharedTranslations, mergeTranslations, type Translations } from "best-time-ui";

const siteTranslations: Translations = {
  en: {
    appName: "Best Sleep Time",
    appNameSub: "הזמן הטוב לשינה",
    nap: "Nap",
    night: "Night Sleep",
    napDuration: "Nap Duration",
    nightDuration: "Sleep Duration",
    wakeUpTime: "Wake-up Time",
    wakeUpTimeDesc: "Time to wake up, orient yourself, and reach shelter",
    nightWakeUpTimeDesc: "Time to wake from deep sleep and reach shelter",
    location: "Location",
    hours: "hours",
    dataSource: "Data source: Tzeva Adom / Pikud HaOref",
    howItWorksContent:
      "This app analyzes real-time rocket alert data from Pikud HaOref to help you sleep with confidence. Two modes: Nap (15-90 min) tells you whether it's safe to nap now or better to wait. Night Sleep is a confidence check — you're going to sleep regardless, but it tells you how prepared to be: on a quiet night, sleep soundly; on an active night, keep shoes and phone nearby or sleep in the safe room. The score factors in time since the last alert, average gaps, frequency trends, and 24-hour alert counts.",
    "prealert.sleepNearShelter":
      "Multiple advance warnings detected this evening — sleep near your safe room",
    "prealert.delayNap":
      "Recent warning activity — consider delaying your nap",
    "prealert.overnightReport":
      "{count} warning events occurred overnight in your area",
    "prealert.statusTitle": "Pre-Alert Intelligence",
    "prealert.last2h": "last 2h",
    "prealert.last6h": "last 6h",
    "prealert.exitCleared": "All clear",
    "prealert.tapDetails": "Tap for details",
    "prealert.modalTitle": "Pre-Alert Details",
    "prealert.modalDesc": "Pre-alerts are cell broadcast warnings sent by the Home Front Command when missile launches are detected, minutes before sirens may activate. During sleep you have slower reaction time — consider sleeping near your safe room on active nights, and keep shoes and phone within reach.",
    "prealert.regionNote.nationwide": "These warnings were issued nationwide (no specific region targeted).",
    "prealert.regionNote.regional": "These warnings were detected in or near your selected region.",
    "prealert.scoreImpact": "Score Impact",
    "prealert.scoreImpact.active": "Active warnings cap your safety score at 35, making the verdict 'dangerous'. Sleep in or near your safe room tonight.",
    "prealert.scoreImpact.multi": "Multiple recent warnings cap your score at 55, preventing a 'safe' verdict. For naps, consider delaying. For night sleep, keep shoes and phone nearby.",
    "prealert.scoreImpact.exit": "The most recent event was declared over. A small bonus is applied to your score — lighter sleep may still be wise for the next hour.",
    "prealert.scoreImpact.low": "Low-level warning activity has a mild effect on your score. Sleep normally but stay aware.",
    "prealert.close": "Close",
  },
  he: {
    appName: "הזמן הטוב לשינה",
    appNameSub: "Best Sleep Time",
    nap: "תנומה",
    night: "שינת לילה",
    napDuration: "משך התנומה",
    nightDuration: "משך השינה",
    wakeUpTime: "זמן התעוררות",
    wakeUpTimeDesc: "זמן להתעורר, להתמצא ולהגיע לממ״ד",
    nightWakeUpTimeDesc: "זמן להתעורר משינה עמוקה ולהגיע לממ״ד",
    location: "מיקום",
    hours: "שעות",
    dataSource: "מקור נתונים: צבע אדום / פיקוד העורף",
    howItWorksContent:
      "האפליקציה מנתחת נתוני התרעות בזמן אמת מפיקוד העורף כדי לעזור לכם לישון בביטחון. שני מצבים: תנומה (15-90 דקות) אומרת לכם אם בטוח לנמנם עכשיו או עדיף לחכות. שינת לילה היא בדיקת ביטחון — אתם הולכים לישון בכל מקרה, אבל היא אומרת כמה מוכנים להיות: בלילה שקט, ישנו בשלווה; בלילה פעיל, השאירו נעליים וטלפון בקרבת מקום או ישנו בממ״ד. הציון מבוסס על הזמן מאז ההתרעה האחרונה, מרווחים ממוצעים, מגמות תדירות וכמות התרעות ב-24 שעות.",
    "prealert.sleepNearShelter":
      "זוהו מספר אזהרות מוקדמות הערב — ישנו ליד המרחב המוגן",
    "prealert.delayNap":
      "פעילות אזהרה לאחרונה — שקלו לדחות את התנומה",
    "prealert.overnightReport":
      "{count} אירועי אזהרה התרחשו בלילה באזורכם",
    "prealert.statusTitle": "מודיעין טרום-התרעה",
    "prealert.last2h": "2 שעות אחרונות",
    "prealert.last6h": "6 שעות אחרונות",
    "prealert.exitCleared": "סיום אירוע",
    "prealert.tapDetails": "לחצו לפרטים",
    "prealert.modalTitle": "פרטי התרעה מוקדמת",
    "prealert.modalDesc": "התרעות מוקדמות הן הודעות שידור סלולרי שנשלחות על ידי פיקוד העורף כאשר מזוהים שיגורי טילים, דקות לפני שצפירות עלולות להתחיל. בזמן שינה זמן התגובה שלכם איטי יותר — שקלו לישון ליד המרחב המוגן בלילות פעילים, והשאירו נעליים וטלפון בהישג יד.",
    "prealert.regionNote.nationwide": "אזהרות אלו הופצו ברמה ארצית (ללא אזור מסוים).",
    "prealert.regionNote.regional": "אזהרות אלו זוהו באזור שבחרתם או בסמוך לו.",
    "prealert.scoreImpact": "השפעה על הציון",
    "prealert.scoreImpact.active": "אזהרות פעילות מגבילות את ציון הבטיחות ל-35, והציון הופך ל׳מסוכן׳. ישנו בממ״ד או בקרבתו הלילה.",
    "prealert.scoreImpact.multi": "מספר אזהרות אחרונות מגבילות את הציון ל-55, ומונעות ציון ׳בטוח׳. לתנומה — שקלו לדחות. לשינת לילה — השאירו נעליים וטלפון בקרבת מקום.",
    "prealert.scoreImpact.exit": "האירוע האחרון הוכרז כסיום. בונוס קטן מתווסף לציון — שינה קלה עדיין מומלצת לשעה הקרובה.",
    "prealert.scoreImpact.low": "פעילות אזהרה ברמה נמוכה משפיעה במידה מתונה על הציון. ישנו כרגיל אך הישארו ערניים.",
    "prealert.close": "סגור",
  },
};

export const translations = mergeTranslations(sharedTranslations, siteTranslations);
