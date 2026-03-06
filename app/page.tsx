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
  type ProcessedAlert,
  type SafetyStats,
  type SafetyRecommendation,
} from "best-time-ui";
import NapSettings from "@/components/NapSettings";
import LocationSelector from "@/components/LocationSelector";
import { getRecommendation } from "@/lib/safety";
import { SleepType } from "@/lib/types";

const REFRESH_INTERVAL = 30_000;

export default function Home() {
  const [alerts, setAlerts] = useState<ProcessedAlert[]>([]);
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

  // Initial fetch + polling
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  // Effective duration: sleep time + wake-up buffer
  const effectiveDuration = duration + wakeUpTime;

  // Recompute stats when filtered alerts or duration change
  useEffect(() => {
    const newStats = computeStats(filteredAlerts);
    setStats(newStats);
    setRecommendation(getRecommendation(newStats, duration, wakeUpTime, sleepType));
  }, [filteredAlerts, effectiveDuration, sleepType, duration, wakeUpTime]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-xl">
        <ScrollReveal direction="down">
          <Header />
        </ScrollReveal>
        <CrossPromoBanner
          href="https://bestshowertime.com"
          name="Best Shower Time"
          promptEn="Need a shower too? Check out"
          promptHe="גם צריכים להתקלח? בדקו את"
        />
        <CrossPromoBanner
          href="https://bestwalkingtime.com"
          name="Best Walk Time"
          promptEn="Going for a walk? Check out"
          promptHe="יוצאים לטיול? בדקו את"
        />

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
          <ScrollReveal delay={100} className="w-full">
            <AlertTimeline alerts={filteredAlerts} />
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
