import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BookingUpdateSchema, jsonError, jsonStrict, parseJson } from "@/lib/api/validation";

function getBearerToken(req: NextRequest) {
  const auth = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice("Bearer ".length).trim();
  return token || null;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = getBearerToken(req);
  if (!token) return jsonError("Unauthorized", 401);

  const id = params.id;
  const body = await req.json().catch(() => ({}));
  const parsed = parseJson(BookingUpdateSchema.strict(), body);
  if (!parsed.ok) return jsonError("Validation failed", 400, parsed.error);
  const payload = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .update({
      customer_id: payload.customerId,
      pickup_time: payload.pickupTime,
      pickup_address: payload.pickupAddress,
      dropoff_address: payload.dropoffAddress,
      notes: payload.notes ?? null,
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return jsonError("Failed to update booking", 500, { code: error.code });
  if (!data) return jsonError("Not found", 404);

  return jsonStrict({ id: String(data.id), status: "updated" }, { status: 200 });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { error } = await supabase.from("bookings").delete().eq("id", params.id);
  if (error) return jsonError("Failed to delete booking", 500, { code: error.code });
  return jsonStrict({ status: "deleted" }, { status: 200 });
}

