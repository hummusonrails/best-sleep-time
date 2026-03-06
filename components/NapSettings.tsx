"use client";

import { useTranslation, useHaptics } from "best-time-ui";
import { SleepType } from "@/lib/types";

interface Props {
  sleepType: SleepType;
  duration: number;
  wakeUpTime: number;
  onSleepTypeChange: (type: SleepType) => void;
  onDurationChange: (duration: number) => void;
  onWakeUpTimeChange: (time: number) => void;
}

export default function NapSettings({
  sleepType,
  duration,
  wakeUpTime,
  onSleepTypeChange,
  onDurationChange,
  onWakeUpTimeChange,
}: Props) {
  const { t } = useTranslation();
  const { trigger } = useHaptics();

  const isNap = sleepType === "nap";

  // Nap: 15-90 min, Night: 3-9 hours (displayed as hours, stored as minutes)
  const minDuration = isNap ? 15 : 180;
  const maxDuration = isNap ? 90 : 540;
  const step = isNap ? 5 : 30;

  const durationLabel = isNap
    ? `${duration} ${t("minutes")}`
    : `${(duration / 60).toFixed(1)} ${t("hours")}`;

  const minLabel = isNap ? "15" : "3";
  const maxLabel = isNap ? "90" : "9";

  return (
    <section className="w-full max-w-md mx-auto px-4">
      {/* Nap / Night toggle */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => {
            trigger("light");
            onSleepTypeChange("nap");
            onDurationChange(30);
            onWakeUpTimeChange(2);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-500 ease-smooth ${
            isNap
              ? "bg-surface-2 text-cream"
              : "text-cream/40 hover:text-cream/60"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Half-moon icon for nap */}
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          <span className="font-mono text-sm">{t("nap")}</span>
        </button>

        <button
          onClick={() => {
            trigger("light");
            onSleepTypeChange("night");
            onDurationChange(420);
            onWakeUpTimeChange(3);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-500 ease-smooth ${
            !isNap
              ? "bg-surface-2 text-cream"
              : "text-cream/40 hover:text-cream/60"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Full moon + stars icon for night sleep */}
            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            <path d="M15 2l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
          </svg>
          <span className="font-mono text-sm">{t("night")}</span>
        </button>
      </div>

      {/* Duration slider */}
      <div className="card px-6 py-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-cream/50 uppercase tracking-wider">
            {isNap ? t("napDuration") : t("nightDuration")}
          </span>
          <span className="font-mono text-lg text-cream">
            {durationLabel}
          </span>
        </div>
        <input
          type="range"
          min={minDuration}
          max={maxDuration}
          step={step}
          value={duration}
          onChange={(e) => { trigger("selection"); onDurationChange(Number(e.target.value)); }}
          className="slider w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="font-mono text-xs text-cream/30">{minLabel}</span>
          <span className="font-mono text-xs text-cream/30">{maxLabel}</span>
        </div>
      </div>

      {/* Wake-up time slider */}
      <div className="mt-3">
        <div className="card px-6 py-5">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-xs text-cream/50 uppercase tracking-wider">
              {t("wakeUpTime")}
            </span>
            <span className="font-mono text-lg text-cream">
              {wakeUpTime} {t("minutes")}
            </span>
          </div>
          <p className="font-mono text-xs text-cream/25 mb-3">
            {isNap ? t("wakeUpTimeDesc") : t("nightWakeUpTimeDesc")}
          </p>
          <input
            type="range"
            min={1}
            max={5}
            value={wakeUpTime}
            onChange={(e) => { trigger("selection"); onWakeUpTimeChange(Number(e.target.value)); }}
            className="slider w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="font-mono text-xs text-cream/30">1</span>
            <span className="font-mono text-xs text-cream/30">5</span>
          </div>
        </div>
      </div>
    </section>
  );
}
