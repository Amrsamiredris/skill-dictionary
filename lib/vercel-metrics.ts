type MetricsScope = {
  type: "project";
  ownerId: string;
  projectIds: string[];
};

type Granularity = { days: number } | { hours: number };

type QueryBody = {
  scope: MetricsScope;
  metric: string;
  aggregation: string;
  startTime: string;
  endTime: string;
  granularity: Granularity;
  groupBy?: string[];
  limit?: number;
};

type MetricsResponse = {
  data?: Array<Record<string, string | number>>;
  summary?: Array<Record<string, number>>;
};

function getConfig() {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !teamId || !projectId) return null;
  return { token, teamId, projectId };
}

async function queryMetric(body: QueryBody): Promise<MetricsResponse | null> {
  const config = getConfig();
  if (!config) return null;

  const res = await fetch(
    `https://api.vercel.com/v2/observability/query?teamId=${config.teamId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      next: { revalidate: 300 },
    },
  );

  if (!res.ok) return null;
  return (await res.json()) as MetricsResponse;
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function scope(): MetricsScope | null {
  const config = getConfig();
  if (!config) return null;
  return {
    type: "project",
    ownerId: config.teamId,
    projectIds: [config.projectId],
  };
}

export type VercelAnalyticsSnapshot = {
  configured: boolean;
  pageviews7d: number;
  visitors7d: number;
  pageviewsByDay: Array<{ day: string; count: number }>;
  topPages: Array<{ label: string; count: number }>;
  topCountries: Array<{ label: string; count: number }>;
  topDevices: Array<{ label: string; count: number }>;
  topReferrers: Array<{ label: string; count: number }>;
};

export async function getVercelAnalytics(): Promise<VercelAnalyticsSnapshot> {
  const empty: VercelAnalyticsSnapshot = {
    configured: false,
    pageviews7d: 0,
    visitors7d: 0,
    pageviewsByDay: [],
    topPages: [],
    topCountries: [],
    topDevices: [],
    topReferrers: [],
  };

  const s = scope();
  if (!s) return empty;

  const startTime = daysAgo(7);
  const endTime = new Date().toISOString();
  const base = {
    scope: s,
    startTime,
    endTime,
    granularity: { days: 1 } as Granularity,
  };

  const [pageviews, visitors, byDay, pages, countries, devices, referrers] =
    await Promise.all([
      queryMetric({
        ...base,
        metric: "vercel.analytics_pageview.count",
        aggregation: "sum",
      }),
      queryMetric({
        ...base,
        metric: "vercel.analytics_pageview.count",
        aggregation: "unique/visitor_id",
      }),
      queryMetric({
        ...base,
        metric: "vercel.analytics_pageview.count",
        aggregation: "sum",
      }),
      queryMetric({
        ...base,
        metric: "vercel.analytics_pageview.count",
        aggregation: "sum",
        groupBy: ["request_path"],
        limit: 10,
      }),
      queryMetric({
        ...base,
        metric: "vercel.analytics_pageview.count",
        aggregation: "sum",
        groupBy: ["country"],
        limit: 10,
      }),
      queryMetric({
        ...base,
        metric: "vercel.analytics_pageview.count",
        aggregation: "sum",
        groupBy: ["device_type"],
        limit: 5,
      }),
      queryMetric({
        ...base,
        metric: "vercel.analytics_pageview.count",
        aggregation: "sum",
        groupBy: ["referrer_hostname"],
        limit: 10,
      }),
    ]);

  const pageviews7d = sumMetric(pageviews);
  const visitors7d = sumMetric(visitors);

  return {
    configured: true,
    pageviews7d,
    visitors7d,
    pageviewsByDay: extractDaily(byDay, "vercel_analytics_pageview_count_sum"),
    topPages: extractGroups(pages, "request_path", "vercel_analytics_pageview_count_sum"),
    topCountries: extractGroups(countries, "country", "vercel_analytics_pageview_count_sum"),
    topDevices: extractGroups(devices, "device_type", "vercel_analytics_pageview_count_sum"),
    topReferrers: extractGroups(
      referrers,
      "referrer_hostname",
      "vercel_analytics_pageview_count_sum",
    ),
  };
}

function sumMetric(res: MetricsResponse | null): number {
  if (!res?.summary?.[0]) return 0;
  const row = res.summary[0];
  const key = Object.keys(row).find((k) => k.includes("sum") || k.includes("unique"));
  return key ? Number(row[key]) || 0 : 0;
}

function extractDaily(
  res: MetricsResponse | null,
  valueKey: string,
): Array<{ day: string; count: number }> {
  if (!res?.data) return [];
  const byDay = new Map<string, number>();
  for (const row of res.data) {
    const ts = String(row.timestamp ?? "");
    const day = ts.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + Number(row[valueKey] ?? 0));
  }
  return [...byDay.entries()]
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => a.day.localeCompare(b.day));
}

function extractGroups(
  res: MetricsResponse | null,
  dimKey: string,
  valueKey: string,
): Array<{ label: string; count: number }> {
  if (!res?.data) return [];
  const totals = new Map<string, number>();
  for (const row of res.data) {
    const dim = String(row[dimKey] ?? "(none)");
    totals.set(dim, (totals.get(dim) ?? 0) + Number(row[valueKey] ?? 0));
  }
  return [...totals.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}
