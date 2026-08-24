import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { runNextProspectAnalysisJob } from "@/lib/prospectAnalysisWorker";

export const runtime = "nodejs";
export const maxDuration = 240;

function authorised(request: Request) {
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const expected = [process.env.ANALYSIS_WORKER_SECRET, process.env.CRON_SECRET].filter((value): value is string => Boolean(value));
  return expected.some((value) => supplied.length === value.length && timingSafeEqual(Buffer.from(supplied), Buffer.from(value)));
}

async function handle(request: Request) {
  if (!authorised(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(await runNextProspectAnalysisJob());
  } catch {
    return NextResponse.json({ error: "Worker unavailable" }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
