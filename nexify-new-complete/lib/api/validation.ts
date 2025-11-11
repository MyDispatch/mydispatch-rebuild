import { z } from "zod";

// Strict validation schemas aligned with MyDispatch API v2.3
export const BookingCreateSchema = z.object({
  customerId: z.string().min(1),
  pickupTime: z.string().min(1), // ISO-8601
  pickupAddress: z.string().min(1),
  dropoffAddress: z.string().min(1),
  notes: z.string().optional(),
});

export const BookingUpdateSchema = z.object({
  customerId: z.string().min(1).optional(),
  pickupTime: z.string().min(1).optional(),
  pickupAddress: z.string().min(1).optional(),
  dropoffAddress: z.string().min(1).optional(),
  notes: z.string().optional(),
});

export type BookingCreateRequest = z.infer<typeof BookingCreateSchema>;
export type BookingUpdateRequest = z.infer<typeof BookingUpdateSchema>;

export const BookingCreateResponseSchema = z.object({
  id: z.string(),
  status: z.literal("created"),
  createdAt: z.string(), // ISO-8601
});

export type BookingCreateResponse = z.infer<typeof BookingCreateResponseSchema>;

export function jsonStrict<T>(data: T, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
    ...init,
  });
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return jsonStrict({ error: message, details }, { status });
}

export function parseJson<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  value: unknown,
) {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() };
  }
  return { ok: true as const, data: parsed.data as z.infer<TSchema> };
}

