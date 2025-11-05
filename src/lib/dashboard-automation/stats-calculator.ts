/* ==================================================================================
   STATS-CALCULATOR V18.5.1 - Statistische Berechnungen für KPIs
   ==================================================================================
   Zentrale Berechnungslogik für alle Dashboard-Statistiken
   ================================================================================== */

/**
 * Berechnet Wachstums-Prozentsatz
 */
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

/**
 * Berechnet Durchschnitt
 */
export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Number((sum / values.length).toFixed(2));
}

/**
 * Berechnet Summe
 */
export function calculateSum(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0);
}

/**
 * Berechnet Prozentanteil
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Number(((part / total) * 100).toFixed(1));
}

/**
 * Filtert Daten nach Zeitraum
 */
export function filterByDateRange<T extends { created_at: string }>(
  data: T[],
  days: number
): T[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return data.filter((item) => new Date(item.created_at) >= cutoffDate);
}

/**
 * Gruppiert Daten nach Datum
 */
export function groupByDate<T extends { created_at: string }>(
  data: T[]
): Record<string, T[]> {
  return data.reduce((acc, item) => {
    const date = new Date(item.created_at).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Berechnet Trend für Mini-Charts
 */
export function calculateTrendData<T extends { created_at: string }>(
  data: T[],
  days: number = 7
): number[] {
  const grouped = groupByDate(filterByDateRange(data, days));
  const dates = Object.keys(grouped).sort();
  
  return dates.map((date) => grouped[date].length);
}

/**
 * Dashboard-Statistiken-Calculator
 */
export class DashboardStatsCalculator {
  /**
   * Kunden-Statistiken
   */
  static customers(customers: unknown[]) {
    const total = customers.filter((c) => !c.archived).length;
    const portalAccess = customers.filter((c) => !c.archived && c.has_portal_access).length;
    const openInvoices = customers.filter(
      (c) => !c.archived && c.outstanding_balance > 0
    ).length;
    const openInvoicesAmount = customers
      .filter((c) => !c.archived && c.outstanding_balance > 0)
      .reduce((sum, c) => sum + (c.outstanding_balance || 0), 0);

    return {
      total,
      portalAccess,
      openInvoices,
      openInvoicesAmount,
      percentagePortalAccess: calculatePercentage(portalAccess, total),
    };
  }

  /**
   * Auftrags-Statistiken
   */
  static bookings(bookings: unknown[]) {
    const today = new Date().toISOString().split('T')[0];
    
    const open = bookings.filter((b) => !b.archived && b.status === 'pending').length;
    const todayBookings = bookings.filter(
      (b) => !b.archived && b.pickup_time?.startsWith(today)
    );
    const todayCount = todayBookings.length;
    const todayRevenue = calculateSum(todayBookings.map((b) => b.price || 0));
    
    const thisMonth = filterByDateRange(bookings, 30);
    const lastMonth = filterByDateRange(bookings, 60).filter(
      (b) => !thisMonth.includes(b)
    );
    const monthRevenue = calculateSum(thisMonth.map((b) => b.price || 0));
    const lastMonthRevenue = calculateSum(lastMonth.map((b) => b.price || 0));
    const growth = calculateGrowth(monthRevenue, lastMonthRevenue);

    return {
      open,
      todayCount,
      todayRevenue,
      monthRevenue,
      growth,
    };
  }

  /**
   * Fahrer-Statistiken
   */
  static drivers(drivers: unknown[]) {
    const total = drivers.filter((d) => !d.archived).length;
    const active = drivers.filter(
      (d) => !d.archived && ['on_duty', 'available'].includes(d.shift_status)
    ).length;
    const inactive = total - active;
    const percentageActive = calculatePercentage(active, total);

    return {
      total,
      active,
      inactive,
      percentageActive,
    };
  }

  /**
   * Fahrzeug-Statistiken
   */
  static vehicles(vehicles: unknown[]) {
    const total = vehicles.filter((v) => !v.archived).length;
    const available = vehicles.filter((v) => !v.archived && v.status === 'available').length;
    const maintenance = vehicles.filter((v) => !v.archived && v.status === 'maintenance').length;
    const percentageAvailable = calculatePercentage(available, total);

    return {
      total,
      available,
      maintenance,
      percentageAvailable,
    };
  }

  /**
   * Rechnungs-Statistiken
   */
  static invoices(invoices: unknown[]) {
    const open = invoices.filter((i) => !i.archived && i.status === 'sent');
    const overdue = invoices.filter((i) => !i.archived && i.status === 'overdue');
    
    const openAmount = calculateSum(open.map((i) => i.price || 0));
    const overdueAmount = calculateSum(overdue.map((i) => i.price || 0));
    
    const thisMonth = filterByDateRange(invoices, 30);
    const lastMonth = filterByDateRange(invoices, 60).filter((i) => !thisMonth.includes(i));
    const monthRevenue = calculateSum(thisMonth.map((i) => i.price || 0));
    const lastMonthRevenue = calculateSum(lastMonth.map((i) => i.price || 0));
    const growth = calculateGrowth(monthRevenue, lastMonthRevenue);

    return {
      openCount: open.length,
      openAmount,
      overdueCount: overdue.length,
      overdueAmount,
      monthRevenue,
      growth,
    };
  }

  /**
   * Partner-Statistiken
   */
  static partners(partners: unknown[], bookings: unknown[]) {
    const total = partners.filter((p) => !p.archived).length;
    const active = partners.filter((p) => !p.archived && p.status === 'active').length;
    
    const partnerBookings = bookings.filter((b) => b.is_partner_booking && !b.archived);
    const thisMonthProvision = calculateSum(
      filterByDateRange(partnerBookings, 30).map((b) => b.partner_provision_manual || 0)
    );

    return {
      total,
      active,
      monthProvision: thisMonthProvision,
    };
  }
}
