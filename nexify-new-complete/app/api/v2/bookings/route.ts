import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  BookingCreateSchema,
  jsonStrict,
  jsonError,
  parseJson,
} from "@/lib/api/validation";

function getBearerToken(req: NextRequest) {
  const auth = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice("Bearer ".length).trim();
  return token || null;
}

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("id, customer_id, pickup_time, pickup_address, dropoff_address, notes, created_at")
    .limit(200);

  if (error) return jsonError("Failed to list bookings", 500, { code: error.code });
  return jsonStrict({ items: data ?? [] }, { status: 200 });
}

export async function POST(req: NextRequest) {
  // Auth required by spec (Bearer token)
  const token = getBearerToken(req);
  if (!token) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => ({}));
  const parsed = parseJson(BookingCreateSchema.strict(), body);
  if (!parsed.ok) return jsonError("Validation failed", 400, parsed.error);
  const payload = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      customer_id: payload.customerId,
      pickup_time: payload.pickupTime,
      pickup_address: payload.pickupAddress,
      dropoff_address: payload.dropoffAddress,
      notes: payload.notes ?? null,
    })
    .select("id, created_at")
    .maybeSingle();

  if (error || !data) return jsonError("Failed to create booking", 500, { code: error?.code });

  return jsonStrict(
    {
      id: String(data.id),
      status: "created",
      createdAt: data.created_at,
    },
    { status: 201 },
  );
}

