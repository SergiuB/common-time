import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  // Handle the OAuth callback logic here

  // Retrieve the authorization code from the request query parameters
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");
  console.log("Query", query);
}
