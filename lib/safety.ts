import {
  type SafetyStats,
  type SafetyLevel,
  type SafetyRecommendation,
  type PreAlertStatus,
  calculateSafetyScore,
} from "best-time-ui";
import { type SleepType } from "./types";

/**
 * Sleep-specific safety recommendation.
 *
 * Two modes:
 *
 * NAP (15-90 min):
 *   - Shorter sleep, can be delayed if conditions are bad
 *   - Thresholds are stricter than shower but not extreme
 *   - "dangerous" = genuinely skip this nap, try again later
 *   - Pre-alert data: warningCount2h >= 2 downgrades verdict
 *
 * NIGHT SLEEP (confidence check):
 *   - Everyone sleeps at night regardless — this isn't about skipping sleep
 *   - It's about confidence level: how likely are you to be woken by sirens?
 *   - "safe" = quiet night expected, sleep confidently
 *   - "risky" = keep your shoes and phone nearby, sleep light
 *   - "dangerous" = expect interruptions, sleep in/near the shelter
 *   - Pre-alert data: warningCount6h >= 2 adds advisory message but doesn't change threshold
 */

export function getRecommendation(
  stats: SafetyStats,
  duration: number,
  wakeUpTime: number,
  sleepType: SleepType,
  preAlertStatus?: PreAlertStatus | null
): SafetyRecommendation {
  const { timeSinceLastAlert, averageGap, alertCount24h, trend } = stats;
  const effectiveDuration = duration + wakeUpTime;

  // Recompute safety score with pre-alert data for nap mode
  const safetyScore =
    sleepType === "nap" && preAlertStatus
      ? calculateSafetyScore(
          timeSinceLastAlert,
          averageGap,
          trend,
          alertCount24h,
          preAlertStatus
        )
      : stats.safetyScore;

  let level: SafetyLevel;

  if (sleepType === "nap") {
    // Nap mode — stricter than shower, gentler than night
    if (safetyScore < 50 || timeSinceLastAlert < effectiveDuration) {
      level = "dangerous";
    } else if (
      safetyScore > 75 &&
      timeSinceLastAlert > effectiveDuration * 2.5
    ) {
      level = "safe";
    } else {
      level = "risky";
    }

    // Pre-alert downgrade: warningCount2h >= 2 downgrades verdict by one level
    if (preAlertStatus && preAlertStatus.warningCount2h >= 2) {
      if (level === "safe") level = "risky";
      else if (level === "risky") level = "dangerous";
    }
  } else {
    // Night sleep — confidence assessment
    // Not "should I sleep?" but "how prepared should I be for alerts?"
    if (
      safetyScore < 40 ||
      (timeSinceLastAlert < 30 && alertCount24h > 8)
    ) {
      level = "dangerous";
    } else if (
      safetyScore > 80 &&
      timeSinceLastAlert > 120 &&
      averageGap > 90 &&
      alertCount24h <= 5
    ) {
      level = "safe";
    } else {
      level = "risky";
    }
  }

  const messages: Record<SleepType, Record<SafetyLevel, { en: string; he: string }>> = {
    nap: {
      safe: {
        en: "SAFE TO NAP NOW",
        he: "בטוח לנמנם עכשיו",
      },
      risky: {
        en: "RISKY TIME TO NAP",
        he: "זמן מסוכן לשינה",
      },
      dangerous: {
        en: "DO NOT NAP NOW",
        he: "אל תנמנמו עכשיו",
      },
    },
    night: {
      safe: {
        en: "QUIET NIGHT EXPECTED",
        he: "צפוי לילה שקט",
      },
      risky: {
        en: "KEEP SHOES NEARBY",
        he: "השאירו נעליים בקרבת מקום",
      },
      dangerous: {
        en: "SLEEP NEAR SHELTER",
        he: "ישנו ליד הממ״ד",
      },
    },
  };

  // Night mode with elevated pre-alert activity: override message to shelter advisory
  let messageEn = messages[sleepType][level].en;
  let messageHe = messages[sleepType][level].he;

  if (
    sleepType === "night" &&
    preAlertStatus &&
    preAlertStatus.warningCount6h >= 2
  ) {
    messageEn = "SLEEP NEAR YOUR SAFE ROOM TONIGHT";
    messageHe = "ישנו ליד המרחב המוגן הלילה";
  }

  return {
    level,
    score: safetyScore,
    message: messageEn,
    messageHe: messageHe,
  };
}
