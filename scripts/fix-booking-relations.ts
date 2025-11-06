#!/usr/bin/env tsx
/**
 * FIX BOOKING RELATIONS TYPE ERRORS
 *
 * Das Problem: TypeScript erkennt Properties von BookingWithRelations nicht korrekt
 * Lösung: Type-Assertions oder explizite Type-Casts hinzufügen
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

interface FileFix {
  filePath: string;
  fixes: number;
}

async function fixBookingRelations(filePath: string): Promise<number> {
  let content = readFileSync(filePath, 'utf-8');
  let fixCount = 0;

  // Pattern 1: booking.created_at -> (booking as any).created_at (temporary)
  // Besser: Type-Assertion zu Booking explizit
  const patterns = [
    {
      // booking.created_at where booking is BookingWithRelations
      pattern: /(\w+)\.created_at/g,
      replacement: (match: string, varName: string) => {
        // Check if this is in a BookingWithRelations context
        if (content.includes(`BookingWithRelations`) && content.includes(`${varName}: BookingWithRelations`)) {
          return `(${varName} as Tables<'bookings'>).created_at`;
        }
        return match;
      },
      description: 'BookingWithRelations created_at access'
    },
    {
      // booking.archived
      pattern: /(\w+)\.archived/g,
      replacement: (match: string, varName: string) => {
        if (content.includes(`BookingWithRelations`) && content.includes(`${varName}: BookingWithRelations`)) {
          return `(${varName} as Tables<'bookings'>).archived`;
        }
        return match;
      },
      description: 'BookingWithRelations archived access'
    },
    {
      // booking.is_offer
      pattern: /(\w+)\.is_offer/g,
      replacement: (match: string, varName: string) => {
        if (content.includes(`BookingWithRelations`) && content.includes(`${varName}: BookingWithRelations`)) {
          return `(${varName} as Tables<'bookings'>).is_offer`;
        }
        return match;
      },
      description: 'BookingWithRelations is_offer access'
    },
    {
      // booking.status
      pattern: /(\w+)\.status/g,
      replacement: (match: string, varName: string) => {
        if (content.includes(`BookingWithRelations`) && content.includes(`${varName}: BookingWithRelations`)) {
          return `(${varName} as Tables<'bookings'>).status`;
        }
        return match;
      },
      description: 'BookingWithRelations status access'
    },
    {
      // booking.price
      pattern: /(\w+)\.price/g,
      replacement: (match: string, varName: string) => {
        if (content.includes(`BookingWithRelations`) && content.includes(`${varName}: BookingWithRelations`)) {
          return `(${varName} as Tables<'bookings'>).price`;
        }
        return match;
      },
      description: 'BookingWithRelations price access'
    },
  ];

  // Actually, better approach: Fix the type definition itself
  // The issue is that BookingWithRelations extends Booking, but TypeScript doesn't see it
  // Let's check if we need to import Tables in the files using BookingWithRelations

  return fixCount;
}

async function main() {
  console.log('🔧 FIX BOOKING RELATIONS - Starting...\n');
  console.log('⚠️  Note: This requires manual fixes or type definition changes');
  console.log('   The issue is that BookingWithRelations extends Booking,');
  console.log('   but TypeScript strict mode may not recognize inherited properties.\n');
  console.log('   Solution: Ensure Tables type is properly exported and used.\n');
}

main().catch(console.error);

