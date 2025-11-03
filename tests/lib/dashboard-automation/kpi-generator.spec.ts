/* ==================================================================================
   UNIT TESTS: KPIGenerator
   ================================================================================== */

import { describe, it, expect } from 'vitest';
import { KPIGenerator } from '@/lib/dashboard-automation';

describe('KPIGenerator', () => {
  describe('Bookings KPIs', () => {
    it('should generate open bookings KPI', () => {
      const kpi = KPIGenerator.bookings.open(5);
      expect(kpi.title).toBe('Offene Aufträge');
      expect(kpi.value).toBe(5);
    });

    it('should generate today bookings KPI', () => {
      const kpi = KPIGenerator.bookings.today(3, 150);
      expect(kpi.title).toBe('Heute');
      expect(kpi.value).toBe(3);
    });
  });

  describe('Customers KPIs', () => {
    it('should generate total customers KPI', () => {
      const kpi = KPIGenerator.customers.total(100);
      expect(kpi.title).toBe('Gesamt Kunden');
      expect(kpi.value).toBe(100);
    });

    it('should generate portal access KPI', () => {
      const kpi = KPIGenerator.customers.portalAccess(75, 100);
      expect(kpi.title).toBe('Portal-Zugang');
      expect(kpi.value).toBe(75);
    });
  });

  describe('Drivers KPIs', () => {
    it('should generate total drivers KPI', () => {
      const kpi = KPIGenerator.drivers.total(20);
      expect(kpi.title).toBe('Gesamt Fahrer');
      expect(kpi.value).toBe(20);
    });

    it('should generate active drivers KPI', () => {
      const kpi = KPIGenerator.drivers.active(15, 20);
      expect(kpi.title).toBe('Verfügbar');
      expect(kpi.value).toBe(15);
    });
  });
});
