/* ==================================================================================
   KPI-GENERATOR V18.5.1 - Automatische KPI-Erstellung
   ==================================================================================
   Generiert konsistente KPIs für alle Dashboard-Seiten
   ================================================================================== */

import { LucideIcon } from 'lucide-react';
import { 
  Users, FileText, Car, Receipt, Building2, DollarSign, 
  TrendingUp, Clock, CheckCircle, AlertCircle 
} from 'lucide-react';

export interface KPIConfig {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  subtitle?: string;
  miniChart?: number[];
}

/**
 * Standard-KPI-Generator für Dashboard-Seiten
 * Vereinfacht die Erstellung konsistenter KPIs
 */
export class KPIGenerator {
  /**
   * Kunden-KPIs
   */
  static customers = {
    total: (count: number): KPIConfig => ({
      title: 'Kunden Gesamt',
      value: count,
      icon: Users,
    }),
    
    portalAccess: (count: number, total: number): KPIConfig => ({
      title: 'Portal-Zugang',
      value: count,
      icon: CheckCircle,
      subtitle: `${((count / total) * 100).toFixed(0)}% aller Kunden`,
    }),
    
    openInvoices: (count: number, amount: number): KPIConfig => ({
      title: 'Offene Rechnungen',
      value: count,
      icon: FileText,
      subtitle: `${amount.toFixed(2)} €`,
    }),
  };

  /**
   * Auftrags-KPIs
   */
  static bookings = {
    open: (count: number): KPIConfig => ({
      title: 'Offene Aufträge',
      value: count,
      icon: FileText,
    }),
    
    today: (count: number, revenue: number): KPIConfig => ({
      title: 'Aufträge Heute',
      value: count,
      icon: Clock,
      subtitle: `Umsatz: ${revenue.toFixed(2)} €`,
    }),
    
    monthRevenue: (amount: number, growth: number): KPIConfig => ({
      title: 'Umsatz Monat',
      value: `${amount.toFixed(2)} €`,
      icon: DollarSign,
      trend: { value: growth, label: `${growth > 0 ? '+' : ''}${growth}% ggü. Vormonat` },
    }),
  };

  /**
   * Fahrer-KPIs
   */
  static drivers = {
    total: (count: number): KPIConfig => ({
      title: 'Fahrer Gesamt',
      value: count,
      icon: Users,
    }),
    
    active: (count: number, total: number): KPIConfig => ({
      title: 'Aktiv',
      value: count,
      icon: CheckCircle,
      subtitle: `${((count / total) * 100).toFixed(0)}% verfügbar`,
    }),
    
    inactive: (count: number): KPIConfig => ({
      title: 'Inaktiv',
      value: count,
      icon: AlertCircle,
    }),
  };

  /**
   * Fahrzeug-KPIs
   */
  static vehicles = {
    total: (count: number): KPIConfig => ({
      title: 'Fahrzeuge Gesamt',
      value: count,
      icon: Car,
    }),
    
    available: (count: number, total: number): KPIConfig => ({
      title: 'Verfügbar',
      value: count,
      icon: CheckCircle,
      subtitle: `${((count / total) * 100).toFixed(0)}% einsatzbereit`,
    }),
    
    maintenance: (count: number): KPIConfig => ({
      title: 'In Wartung',
      value: count,
      icon: AlertCircle,
    }),
  };

  /**
   * Rechnungs-KPIs
   */
  static invoices = {
    open: (count: number, amount: number): KPIConfig => ({
      title: 'Offene Rechnungen',
      value: count,
      icon: FileText,
      subtitle: `${amount.toFixed(2)} €`,
    }),
    
    overdue: (count: number, amount: number): KPIConfig => ({
      title: 'Überfällige Rechnungen',
      value: count,
      icon: AlertCircle,
      subtitle: `${amount.toFixed(2)} €`,
    }),
    
    monthRevenue: (amount: number, growth: number): KPIConfig => ({
      title: 'Umsatz Monat',
      value: `${amount.toFixed(2)} €`,
      icon: TrendingUp,
      trend: { value: growth, label: `${growth > 0 ? '+' : ''}${growth}% ggü. Vormonat` },
    }),
  };

  /**
   * Partner-KPIs
   */
  static partners = {
    total: (count: number): KPIConfig => ({
      title: 'Partner Gesamt',
      value: count,
      icon: Building2,
    }),
    
    active: (count: number): KPIConfig => ({
      title: 'Aktive Partner',
      value: count,
      icon: CheckCircle,
    }),
    
    monthProvision: (amount: number): KPIConfig => ({
      title: 'Provision Monat',
      value: `${amount.toFixed(2)} €`,
      icon: DollarSign,
    }),
  };

  /**
   * Custom KPI erstellen
   */
  static custom(config: KPIConfig): KPIConfig {
    return config;
  }
}

/**
 * Quick-Actions Generator
 */
export interface QuickActionConfig {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

export class QuickActionsGenerator {
  static create(label: string, icon: LucideIcon, onClick: () => void): QuickActionConfig {
    return { label, icon, onClick, variant: 'default' };
  }

  static export(icon: LucideIcon, onClick: () => void): QuickActionConfig {
    return { label: 'Exportieren', icon, onClick, variant: 'outline' };
  }

  static custom(config: QuickActionConfig): QuickActionConfig {
    return config;
  }
}
