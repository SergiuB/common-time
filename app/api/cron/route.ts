import { cycleRefreshTokens } from "@/lib/actions/cron.actions";

export async function GET() {
  await cycleRefreshTokens();
  return Response.json({ success: true });
}
