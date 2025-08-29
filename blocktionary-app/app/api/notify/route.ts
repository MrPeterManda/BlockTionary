import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { success: false, message: "Notifications disabled" },
    { status: 200 }
  );
}