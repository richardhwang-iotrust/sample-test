import { cache } from "react";
import {
  defaultDashboardContent,
  type ActivityItem,
  type DashboardContent,
  type RevenuePoint,
  type Stat,
  type TeamRow,
} from "@/data/mock-dashboard";
import { getRedis, REDIS_KEYS } from "@/lib/redis";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function isStat(value: unknown): value is Stat {
  return (
    isRecord(value) &&
    typeof value.title === "string" &&
    typeof value.value === "string" &&
    typeof value.delta === "string" &&
    typeof value.detail === "string"
  );
}

function isRevenuePoint(value: unknown): value is RevenuePoint {
  return (
    isRecord(value) &&
    typeof value.month === "string" &&
    typeof value.revenue === "number" &&
    typeof value.pipeline === "number"
  );
}

function isActivityItem(value: unknown): value is ActivityItem {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.time === "string" &&
    (value.tone === "default" || value.tone === "success" || value.tone === "accent")
  );
}

function isTeamRow(value: unknown): value is TeamRow {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.owner === "string" &&
    typeof value.stage === "string" &&
    typeof value.health === "string" &&
    typeof value.mrr === "string"
  );
}

function isDashboardContent(value: unknown): value is DashboardContent {
  return (
    isRecord(value) &&
    Array.isArray(value.stats) &&
    value.stats.every(isStat) &&
    Array.isArray(value.revenueSeries) &&
    value.revenueSeries.every(isRevenuePoint) &&
    Array.isArray(value.recentActivities) &&
    value.recentActivities.every(isActivityItem) &&
    Array.isArray(value.projectTable) &&
    value.projectTable.every(isTeamRow)
  );
}

async function fetchFromRedis(): Promise<DashboardContent | null> {
  try {
    const redis = getRedis();
    const data = await redis.get<DashboardContent>(REDIS_KEYS.DASHBOARD_CONTENT);
    if (data && isDashboardContent(data)) return data;
    return null;
  } catch {
    return null;
  }
}

function getDriveFileUrl(fileId: string) {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

async function fetchFromDrive(): Promise<DashboardContent | null> {
  const fileId = process.env.GOOGLE_DRIVE_DASHBOARD_FILE_ID?.trim();
  if (!fileId) return null;

  try {
    const response = await fetch(getDriveFileUrl(fileId), {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;

    const json: unknown = await response.json();
    if (!isDashboardContent(json)) return null;
    return json;
  } catch {
    return null;
  }
}

export const getDashboardContent = cache(async (): Promise<DashboardContent> => {
  const fromRedis = await fetchFromRedis();
  if (fromRedis) return fromRedis;

  const fromDrive = await fetchFromDrive();
  if (fromDrive) return fromDrive;

  return defaultDashboardContent;
});

export async function getDashboardSourceLabel(): Promise<string> {
  try {
    const redis = getRedis();
    const data = await redis.get(REDIS_KEYS.DASHBOARD_CONTENT);
    if (data) return "Redis";
  } catch {
    // Redis 미설정 시 무시
  }

  if (process.env.GOOGLE_DRIVE_DASHBOARD_FILE_ID) return "Google Drive";
  return "Built-in sample data";
}
