"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Header,
  SafetyVerdict,
  InstallPrompt,
  StatsGrid,
  AlertTimeline,
  HowItWorks,
  Footer,
  ScrollReveal,
  CrossPromoBanner,
  computeStats,
  filterAlertsByRegion,
  computePreAlertStatus,
  type ProcessedAlert,
  type SafetyStats,
  type SafetyRecommendation,
  type PreAlert,
  type PreAlertStatus,
} from "best-time-ui";
import NapSettings from "@/components/NapSettings";
import LocationSelector from "@/components/LocationSelector";
import { PreAlertCard } from "best-time-ui";
import { getRecommendation } from "@/lib/safety";
import { SleepType } from "@/lib/types";

const REFRESH_INTERVAL = 120_000;

function getOvernightPreAlertCount(preAlerts: PreAlert[], regionId: string): number {
  const now = new Date();
  const israelTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" })
  );
  const hour = israelTime.getHours();

  // Only show overnight report between 6am and 10am
  if (hour < 6 || hour >= 10) return 0;

  // Midnight today in Israel time
  const midnightToday = new Date(israelTime);
  midnightToday.setHours(0, 0, 0, 0);
  const midnightTs = midnightToday.getTime();

  // 6am today in Israel time
  const sixAm = new Date(israelTime);
  sixAm.setHours(6, 0, 0, 0);
  const sixAmTs = sixAm.getTime();

  return preAlerts.filter((pa) => {
    if (pa.timestamp < midnightTs || pa.timestamp > sixAmTs) return false;
    if (pa.alert_type !== "early_warning") return false;
    if (regionId === "all") return true;
    if (pa.regions.length === 0) return true;
    return pa.regions.includes(regionId);
  }).length;
}

export default function Home() {
  const [alerts, setAlerts] = useState<ProcessedAlert[]>([]);
  const [preAlerts, setPreAlerts] = useState<PreAlert[]>([]);
  const [preAlertStatus, setPreAlertStatus] = useState<PreAlertStatus | null>(null);
  const [stats, setStats] = useState<SafetyStats | null>(null);
  const [recommendation, setRecommendation] = useState<SafetyRecommendation | null>(null);
  const [sleepType, setSleepType] = useState<SleepType>("nap");
  const [duration, setDuration] = useState(30);
  const [wakeUpTime, setWakeUpTime] = useState(2);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Persist location in localStorage
  useEffect(() => {
    const savedRegion = localStorage.getItem("bslt-region");
    const savedCity = localStorage.getItem("bslt-city");
    if (savedRegion) setSelectedRegion(savedRegion);
    if (savedCity) setSelectedCity(savedCity);
  }, []);

  useEffect(() => {
    localStorage.setItem("bslt-region", selectedRegion);
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem("bslt-city", selectedCity);
    } else {
      localStorage.removeItem("bslt-city");
    }
  }, [selectedCity]);

  // Extract unique cities from alert data for the search
  const availableCities = useMemo(() => {
    const citySet = new Set<string>();
    for (const alert of alerts) {
      for (const city of alert.cities) {
        citySet.add(city);
      }
    }
    return Array.from(citySet).sort();
  }, [alerts]);

  // Filter alerts by selected location
  const filteredAlerts = useMemo(() => {
    if (selectedCity) {
      return alerts.filter((a) => a.cities.some((c) => c.includes(selectedCity)));
    }
    return alerts.filter((a) => filterAlertsByRegion(a.cities, selectedRegion));
  }, [alerts, selectedRegion, selectedCity]);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/alerts");
      const data: ProcessedAlert[] = await res.json();
      setAlerts(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    }
  }, []);

  const fetchPreAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/pre-alerts");
      const data: PreAlert[] = await res.json();
      setPreAlerts(data);
    } catch (error) {
      console.error("Failed to fetch pre-alerts:", error);
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchAlerts();
    fetchPreAlerts();
    const interval = setInterval(() => {
      fetchAlerts();
      fetchPreAlerts();
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAlerts, fetchPreAlerts]);

  // Compute pre-alert status when pre-alerts or region change
  useEffect(() => {
    if (preAlerts.length === 0) {
      setPreAlertStatus(null);
      return;
    }
    const regionForFilter = selectedRegion === "all" ? null : selectedRegion;
    setPreAlertStatus(computePreAlertStatus(preAlerts, regionForFilter));
  }, [preAlerts, selectedRegion]);

  // Effective duration: sleep time + wake-up buffer
  const effectiveDuration = duration + wakeUpTime;

  // Recompute stats when filtered alerts or duration change
  useEffect(() => {
    const newStats = computeStats(filteredAlerts);
    setStats(newStats);
    setRecommendation(
      getRecommendation(newStats, duration, wakeUpTime, sleepType, preAlertStatus)
    );
  }, [filteredAlerts, effectiveDuration, sleepType, duration, wakeUpTime, preAlertStatus]);

  // Pre-alert banner logic
  const overnightCount = useMemo(
    () => getOvernightPreAlertCount(preAlerts, selectedRegion),
    [preAlerts, selectedRegion]
  );

  const showNightShelterBanner =
    sleepType === "night" && preAlertStatus !== null && preAlertStatus.warningCount6h >= 2;
  const showNapDelayBanner =
    sleepType === "nap" && preAlertStatus !== null && preAlertStatus.warningCount2h >= 2;
  const showOvernightBanner = overnightCount > 0;

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-xl">
        <ScrollReveal direction="down">
          <Header />
        </ScrollReveal>
        <CrossPromoBanner
          sites={[
            { href: "https://bestshowertime.com", name: "Best Shower Time", promptEn: "Need a shower too? Check out", promptHe: "גם צריכים להתקלח? בדקו את" },
            { href: "https://bestwalkingtime.com", name: "Best Walk Time", promptEn: "Going for a walk? Check out", promptHe: "יוצאים לטיול? בדקו את" },
          ]}
        />

        {/* Pre-alert warning banners */}
        {showNightShelterBanner && (
          <div className="mx-4 mb-4 rounded-lg bg-amber-900/60 border border-amber-500/40 px-4 py-3 text-center text-sm">
            <p className="text-amber-200 font-medium">
              Multiple advance warnings detected this evening — sleep near your safe room
            </p>
            <p className="text-amber-300/80 text-xs mt-1" dir="rtl">
              זוהו מספר אזהרות מוקדמות הערב — ישנו ליד המרחב המוגן
            </p>
          </div>
        )}
        {showNapDelayBanner && (
          <div className="mx-4 mb-4 rounded-lg bg-amber-900/60 border border-amber-500/40 px-4 py-3 text-center text-sm">
            <p className="text-amber-200 font-medium">
              Recent warning activity — consider delaying your nap
            </p>
            <p className="text-amber-300/80 text-xs mt-1" dir="rtl">
              פעילות אזהרה לאחרונה — שקלו לדחות את התנומה
            </p>
          </div>
        )}
        {showOvernightBanner && !showNightShelterBanner && !showNapDelayBanner && (
          <div className="mx-4 mb-4 rounded-lg bg-blue-900/40 border border-blue-500/30 px-4 py-3 text-center text-sm">
            <p className="text-blue-200 font-medium">
              {overnightCount} warning event{overnightCount !== 1 ? "s" : ""} occurred overnight in your area
            </p>
            <p className="text-blue-300/80 text-xs mt-1" dir="rtl">
              {overnightCount} אירועי אזהרה התרחשו בלילה באזורכם
            </p>
          </div>
        )}

        <main className="flex flex-col items-center gap-10 pb-10">
          <ScrollReveal>
            <SafetyVerdict recommendation={recommendation} />
          </ScrollReveal>
          <ScrollReveal direction="left" delay={100}>
            <NapSettings
              sleepType={sleepType}
              duration={duration}
              wakeUpTime={wakeUpTime}
              onSleepTypeChange={setSleepType}
              onDurationChange={setDuration}
              onWakeUpTimeChange={setWakeUpTime}
            />
          </ScrollReveal>
          <ScrollReveal direction="right" delay={50}>
            <InstallPrompt />
          </ScrollReveal>
          <ScrollReveal direction="right" delay={100} className="relative z-10">
            <LocationSelector
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
              availableCities={availableCities}
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
            />
          </ScrollReveal>
          <ScrollReveal delay={150} className="w-full">
            <StatsGrid stats={stats} />
          </ScrollReveal>
          {preAlertStatus && (
            <ScrollReveal>
              <PreAlertCard preAlertStatus={preAlertStatus} preAlerts={preAlerts} />
            </ScrollReveal>
          )}
          <ScrollReveal delay={100} className="w-full">
            <AlertTimeline alerts={filteredAlerts} preAlerts={preAlerts} />
          </ScrollReveal>
          <ScrollReveal>
            <HowItWorks />
          </ScrollReveal>
        </main>

        <ScrollReveal>
          <Footer
            lastUpdated={lastUpdated}
            sisterSites={[
              {
                href: "https://bestshowertime.com",
                nameEn: "Best Shower Time",
                nameHe: "הזמן הטוב למקלחת",
              },
              {
                href: "https://bestwalkingtime.com",
                nameEn: "Best Walk Time",
                nameHe: "הזמן הטוב לטיול",
              },
            ]}
          />
        </ScrollReveal>
      </div>
    </div>
  );
}
