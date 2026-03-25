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
  },
};

export const translations = mergeTranslations(sharedTranslations, siteTranslations);
