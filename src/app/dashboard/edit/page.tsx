"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import type { DashboardContent, ActivityItem, TeamRow, RevenuePoint, Stat } from "@/data/mock-dashboard";

type SaveState = "idle" | "saving" | "success" | "error";

function Field({
  label,
  value,
  onChange,
  type = "text",
  error,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: "text" | "number";
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "rounded-lg border px-3 py-2 text-sm text-gray-900 outline-none transition",
          "bg-white dark:bg-gray-900 dark:text-gray-100",
          "placeholder:text-gray-400 dark:placeholder:text-gray-600",
          "focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 dark:focus:border-indigo-500 dark:focus:ring-indigo-500",
          error
            ? "border-red-400 dark:border-red-600"
            : "border-gray-200 dark:border-gray-700",
        ].join(" ")}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      {children}
    </div>
  );
}

export default function EditPage() {
  const [data, setData] = useState<DashboardContent | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d: DashboardContent) => setData(d))
      .catch(console.error);
  }, []);

  function updateStat(index: number, field: keyof Stat, value: string) {
    if (!data) return;
    const stats = data.stats.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    setData({ ...data, stats });
  }

  function updateRevenue(index: number, field: keyof RevenuePoint, value: string) {
    if (!data) return;
    const revenueSeries = data.revenueSeries.map((r, i) =>
      i === index
        ? { ...r, [field]: field === "month" ? value : Number(value) }
        : r,
    );
    setData({ ...data, revenueSeries });
  }

  function addRevenue() {
    if (!data) return;
    setData({
      ...data,
      revenueSeries: [...data.revenueSeries, { month: "", revenue: 0, pipeline: 0 }],
    });
  }

  function removeRevenue(index: number) {
    if (!data) return;
    setData({ ...data, revenueSeries: data.revenueSeries.filter((_, i) => i !== index) });
  }

  function updateActivity(index: number, field: keyof ActivityItem, value: string) {
    if (!data) return;
    const recentActivities = data.recentActivities.map((a, i) =>
      i === index ? { ...a, [field]: value } : a,
    );
    setData({ ...data, recentActivities });
  }

  function addActivity() {
    if (!data) return;
    const id = `act-${Date.now()}`;
    setData({
      ...data,
      recentActivities: [
        ...data.recentActivities,
        { id, title: "", description: "", time: "", tone: "default" },
      ],
    });
  }

  function removeActivity(index: number) {
    if (!data) return;
    setData({ ...data, recentActivities: data.recentActivities.filter((_, i) => i !== index) });
  }

  function updateRow(index: number, field: keyof TeamRow, value: string) {
    if (!data) return;
    const projectTable = data.projectTable.map((r, i) =>
      i === index ? { ...r, [field]: value } : r,
    );
    setData({ ...data, projectTable });
  }

  function addRow() {
    if (!data) return;
    setData({
      ...data,
      projectTable: [...data.projectTable, { name: "", owner: "", stage: "", health: "", mrr: "" }],
    });
  }

  function removeRow(index: number) {
    if (!data) return;
    setData({ ...data, projectTable: data.projectTable.filter((_, i) => i !== index) });
  }

  async function handleSave() {
    if (!data) return;
    setSaveState("saving");
    setErrors({});

    try {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSaveState("success");
        setTimeout(() => setSaveState("idle"), 3000);
      } else {
        const json = await res.json() as { issues?: { path: (string | number)[]; message: string }[] };
        const fieldErrors: Record<string, string> = {};
        json.issues?.forEach((issue) => {
          const key = issue.path.join(".");
          fieldErrors[key] = issue.message;
        });
        setErrors(fieldErrors);
        setSaveState("error");
        setTimeout(() => setSaveState("idle"), 4000);
      }
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 4000);
    }
  }

  async function handleReset() {
    const res = await fetch("/api/dashboard");
    const d = await res.json() as DashboardContent;
    setData(d);
    setErrors({});
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        데이터 불러오는 중…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 저장 상태 배너 */}
      {saveState === "success" && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Redis에 저장되었습니다. 대시보드에 즉시 반영됩니다.
        </div>
      )}
      {saveState === "error" && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          저장에 실패했습니다. 입력값을 확인하세요.
        </div>
      )}

      {/* Stats */}
      <SectionCard title="지표 (Stats)">
        <div className="space-y-4">
          {data.stats.map((stat, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Field label="제목" value={stat.title} onChange={(v) => updateStat(i, "title", v)} error={errors[`stats.${i}.title`]} />
              <Field label="값" value={stat.value} onChange={(v) => updateStat(i, "value", v)} error={errors[`stats.${i}.value`]} />
              <Field label="변화량 (delta)" value={stat.delta} onChange={(v) => updateStat(i, "delta", v)} error={errors[`stats.${i}.delta`]} />
              <Field label="설명" value={stat.detail} onChange={(v) => updateStat(i, "detail", v)} error={errors[`stats.${i}.detail`]} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Revenue Series */}
      <SectionCard title="매출 시계열 (Revenue Series)">
        <div className="space-y-3">
          {data.revenueSeries.map((point, i) => (
            <div key={i} className="flex items-end gap-3">
              <div className="grid flex-1 grid-cols-3 gap-3">
                <Field label="월 (Jan, Feb…)" value={point.month} onChange={(v) => updateRevenue(i, "month", v)} error={errors[`revenueSeries.${i}.month`]} />
                <Field label="매출" value={point.revenue} type="number" onChange={(v) => updateRevenue(i, "revenue", v)} error={errors[`revenueSeries.${i}.revenue`]} />
                <Field label="파이프라인" value={point.pipeline} type="number" onChange={(v) => updateRevenue(i, "pipeline", v)} error={errors[`revenueSeries.${i}.pipeline`]} />
              </div>
              <button
                onClick={() => removeRevenue(i)}
                className="mb-0.5 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:text-gray-500 dark:hover:bg-red-950 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addRevenue}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          >
            <Plus className="h-4 w-4" /> 행 추가
          </button>
        </div>
      </SectionCard>

      {/* Recent Activities */}
      <SectionCard title="최근 활동 (Recent Activities)">
        <div className="space-y-3">
          {data.recentActivities.map((act, i) => (
            <div key={act.id} className="flex items-end gap-3">
              <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4">
                <Field label="제목" value={act.title} onChange={(v) => updateActivity(i, "title", v)} error={errors[`recentActivities.${i}.title`]} />
                <Field label="설명" value={act.description} onChange={(v) => updateActivity(i, "description", v)} error={errors[`recentActivities.${i}.description`]} />
                <Field label="시간" value={act.time} onChange={(v) => updateActivity(i, "time", v)} error={errors[`recentActivities.${i}.time`]} />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">톤</label>
                  <select
                    value={act.tone}
                    onChange={(e) => updateActivity(i, "tone", e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  >
                    <option value="default">default</option>
                    <option value="success">success</option>
                    <option value="accent">accent</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => removeActivity(i)}
                className="mb-0.5 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:text-gray-500 dark:hover:bg-red-950 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addActivity}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          >
            <Plus className="h-4 w-4" /> 행 추가
          </button>
        </div>
      </SectionCard>

      {/* Project Table */}
      <SectionCard title="프로젝트 현황 (Project Table)">
        <div className="space-y-3">
          {data.projectTable.map((row, i) => (
            <div key={i} className="flex items-end gap-3">
              <div className="grid flex-1 grid-cols-2 gap-3 md:grid-cols-5">
                <Field label="프로젝트명" value={row.name} onChange={(v) => updateRow(i, "name", v)} error={errors[`projectTable.${i}.name`]} />
                <Field label="담당자" value={row.owner} onChange={(v) => updateRow(i, "owner", v)} error={errors[`projectTable.${i}.owner`]} />
                <Field label="단계" value={row.stage} onChange={(v) => updateRow(i, "stage", v)} error={errors[`projectTable.${i}.stage`]} />
                <Field label="상태" value={row.health} onChange={(v) => updateRow(i, "health", v)} error={errors[`projectTable.${i}.health`]} />
                <Field label="MRR" value={row.mrr} onChange={(v) => updateRow(i, "mrr", v)} error={errors[`projectTable.${i}.mrr`]} />
              </div>
              <button
                onClick={() => removeRow(i)}
                className="mb-0.5 rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:text-gray-500 dark:hover:bg-red-950 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addRow}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          >
            <Plus className="h-4 w-4" /> 행 추가
          </button>
        </div>
      </SectionCard>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-3 pb-4">
        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saveState === "saving" ? "저장 중…" : "Redis에 저장"}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
        >
          <RotateCcw className="h-4 w-4" />
          초기화
        </button>
      </div>
    </div>
  );
}
