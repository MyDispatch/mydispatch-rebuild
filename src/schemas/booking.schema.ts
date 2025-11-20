/* ==================================================================================
   BOOKING SCHEMA V28.1
   ==================================================================================
   Zentrale Zod-Validierung für Booking-Formulare
   
   Usage:
   import { bookingSchema, type BookingFormData } from '@/schemas/booking.schema';
   const form = useForm({ resolver: zodResolver(bookingSchema) });
   
   Benefits:
   - ✅ Single Source of Truth für Booking-Validation
   - ✅ Type-Safety mit TypeScript
   - ✅ Wiederverwendbar in allen Booking-Forms
   - ✅ Zentrale Wartung (1 Stelle statt mehrere)
   ================================================================================== */

import * as z from "zod";

/**
 * Booking Schema - Vollständige Zod-Validierung für Aufträge
 *
 * Includes:
 * - Customer & Date/Time Selection
 * - Pickup & Dropoff Addresses (Street, Number, PLZ, City)
 * - Passengers, Luggage, Vehicle Type
 * - Payment Settings (Method, Status, Price, VAT)
 * - Assignment Settings (Type, Driver, Vehicle, Cost Center)
 * - Conditional Fields (Airport Pickup, Train Station, Partner Booking)
 * - Special Requests & Notes
 */
export const bookingSchema = z.object({
  // Customer & Timing
  customer_id: z.string().min(1, "Kunde ist erforderlich"),
  pickup_date: z.string().min(1, "Datum ist erforderlich"),
  pickup_time: z.string().min(1, "Uhrzeit ist erforderlich"),

  // Pickup Address
  pickup_street: z.string().min(1, "Straße ist erforderlich"),
  pickup_street_number: z.string().optional(),
  pickup_postal_code: z.string().min(1, "PLZ ist erforderlich"),
  pickup_city: z.string().min(1, "Stadt ist erforderlich"),

  // Dropoff Address
  dropoff_street: z.string().min(1, "Straße ist erforderlich"),
  dropoff_street_number: z.string().optional(),
  dropoff_postal_code: z.string().min(1, "PLZ ist erforderlich"),
  dropoff_city: z.string().min(1, "Stadt ist erforderlich"),

  // Booking Details
  passengers: z.string().default("1"),
  luggage: z.string().default("0"),
  vehicle_type: z.string().default("Economy Class (1-4 Pax)"),
  special_requests: z.string().optional(),

  // Payment
  payment_method: z.string().default("invoice"),
  payment_status: z.string().default("pending"),
  price: z.string().optional(),
  vat_rate: z.string().default("19"),

  // Status & Assignment
  status: z.string().default("pending"),
  assignment_type: z.string().default("automatisch"),
  driver_id: z.string().optional(),
  vehicle_id: z.string().optional(),
  cost_center_id: z.string().optional(),

  // Partner Booking (Conditional)
  is_partner_booking: z.boolean().default(false),
  partner_id: z.string().optional(),
  partner_provision_manual: z.string().optional(),

  // Airport Pickup (Conditional)
  is_airport_pickup: z.boolean().default(false),
  flight_number: z.string().optional(),
  terminal: z.string().optional(),
  arrival_time: z.string().optional(),
  wait_time: z.string().default("0"),
  meet_and_greet: z.boolean().default(false),
  name_sign: z.string().optional(),

  // Train Station Pickup (Conditional)
  is_train_station_pickup: z.boolean().default(false),
  train_number: z.string().optional(),
  // Note: Train reuses airport fields (arrival_time, wait_time, meet_and_greet, name_sign)
});

/**
 * TypeScript Type für Booking Form Data
 * Auto-generiert aus Zod Schema
 */
export type BookingFormData = z.infer<typeof bookingSchema>;
