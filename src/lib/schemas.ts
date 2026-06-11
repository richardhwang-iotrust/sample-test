import { z } from "zod";

export const StatSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요"),
  value: z.string().min(1, "값을 입력하세요"),
  delta: z.string().min(1, "변화량을 입력하세요"),
  detail: z.string().min(1, "설명을 입력하세요"),
});

export const RevenuePointSchema = z.object({
  month: z.string().min(1, "월을 입력하세요"),
  revenue: z.number().nonnegative("0 이상의 숫자를 입력하세요"),
  pipeline: z.number().nonnegative("0 이상의 숫자를 입력하세요"),
});

export const ActivityItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "제목을 입력하세요"),
  description: z.string().min(1, "설명을 입력하세요"),
  time: z.string().min(1, "시간을 입력하세요"),
  tone: z.enum(["default", "success", "accent"]),
});

export const TeamRowSchema = z.object({
  name: z.string().min(1, "프로젝트명을 입력하세요"),
  owner: z.string().min(1, "담당자를 입력하세요"),
  stage: z.string().min(1, "단계를 입력하세요"),
  health: z.string().min(1, "상태를 입력하세요"),
  mrr: z.string().min(1, "MRR을 입력하세요"),
});

export const DashboardContentSchema = z.object({
  stats: z.array(StatSchema).min(1, "최소 1개의 지표가 필요합니다"),
  revenueSeries: z.array(RevenuePointSchema).min(1, "최소 1개의 데이터 포인트가 필요합니다"),
  recentActivities: z.array(ActivityItemSchema),
  projectTable: z.array(TeamRowSchema),
});

export type DashboardContentInput = z.infer<typeof DashboardContentSchema>;
