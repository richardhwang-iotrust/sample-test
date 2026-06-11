import { NextResponse } from "next/server";
import { getRedis, REDIS_KEYS } from "@/lib/redis";
import { DashboardContentSchema } from "@/lib/schemas";
import { defaultDashboardContent, type DashboardContent } from "@/data/mock-dashboard";

export async function GET() {
  try {
    const redis = getRedis();
    const data = await redis.get<DashboardContent>(REDIS_KEYS.DASHBOARD_CONTENT);
    return NextResponse.json(data ?? defaultDashboardContent);
  } catch (error) {
    console.error("Dashboard GET error:", error);
    return NextResponse.json(defaultDashboardContent);
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const result = DashboardContentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "입력값이 올바르지 않습니다.", issues: result.error.issues },
        { status: 400 },
      );
    }

    const redis = getRedis();
    await redis.set(REDIS_KEYS.DASHBOARD_CONTENT, result.data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Dashboard POST error:", error);
    return NextResponse.json({ error: "저장에 실패했습니다." }, { status: 500 });
  }
}
