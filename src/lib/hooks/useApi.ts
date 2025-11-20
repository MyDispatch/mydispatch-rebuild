/**
 * HYPERION PHASE 2: Unified API Hooks
 * 
 * TanStack Query Integration für typ-sichere, gecachte API-Calls.
 * Alle Komponenten nutzen DIESE Hooks statt direktem Supabase-Zugriff.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { createApiClient } from '@/lib/api/client';
import { toast } from 'sonner';

// ============================================================================
// API CLIENT INSTANCE
// ============================================================================

const api = createApiClient(supabase);

// ============================================================================
// BOOKINGS
// ============================================================================

export const useBookings = (filters = {}) => {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => api.bookings.list(filters),
    staleTime: 30000, // 30 seconds
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => api.bookings.getById(id),
    enabled: !!id,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.bookings.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Buchung erfolgreich erstellt');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.bookings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Buchung aktualisiert');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.bookings.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Buchung gelöscht');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

// ============================================================================
// DRIVERS
// ============================================================================

export const useDrivers = (filters = {}) => {
  return useQuery({
    queryKey: ['drivers', filters],
    queryFn: () => api.drivers.list(filters),
    staleTime: 60000, // 1 minute
  });
};

export const useDriver = (id: string) => {
  return useQuery({
    queryKey: ['drivers', id],
    queryFn: () => api.drivers.getById(id),
    enabled: !!id,
  });
};

export const useCreateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.drivers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Fahrer erstellt');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

export const useUpdateDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.drivers.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Fahrer aktualisiert');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

// ============================================================================
// VEHICLES
// ============================================================================

export const useVehicles = (filters = {}) => {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => api.vehicles.list(filters),
    staleTime: 60000,
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => api.vehicles.getById(id),
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.vehicles.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Fahrzeug erstellt');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.vehicles.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Fahrzeug aktualisiert');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

// ============================================================================
// CUSTOMERS
// ============================================================================

export const useCustomers = (filters = {}) => {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => api.customers.list(filters),
    staleTime: 60000,
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => api.customers.getById(id),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.customers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Kunde erstellt');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.customers.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Kunde aktualisiert');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

// ============================================================================
// PARTNERS
// ============================================================================

export const usePartners = (filters = {}) => {
  return useQuery({
    queryKey: ['partners', filters],
    queryFn: () => api.partners.list(filters),
    staleTime: 60000,
  });
};

export const usePartner = (id: string) => {
  return useQuery({
    queryKey: ['partners', id],
    queryFn: () => api.partners.getById(id),
    enabled: !!id,
  });
};

export const useCreatePartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.partners.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner erstellt');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

export const useUpdatePartner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.partners.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner aktualisiert');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

// ============================================================================
// SHIFTS
// ============================================================================

export const useShifts = (filters = {}) => {
  return useQuery({
    queryKey: ['shifts', filters],
    queryFn: () => api.shifts.list(filters),
    staleTime: 30000,
  });
};

export const useShift = (id: string) => {
  return useQuery({
    queryKey: ['shifts', id],
    queryFn: () => api.shifts.getById(id),
    enabled: !!id,
  });
};

export const useCreateShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.shifts.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toast.success('Schicht erstellt');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

export const useUpdateShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.shifts.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toast.success('Schicht aktualisiert');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

export const useDeleteShift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.shifts.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      toast.success('Schicht gelöscht');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

// ============================================================================
// COMPANIES
// ============================================================================

export const useCompanies = (filters = {}) => {
  return useQuery({
    queryKey: ['companies', filters],
    queryFn: () => api.companies.list(filters),
    staleTime: 300000, // 5 minutes - static data
  });
};

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: () => api.companies.getById(id),
    enabled: !!id,
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.companies.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Unternehmen aktualisiert');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

// ============================================================================
// INVOICES
// ============================================================================

export const useInvoices = (filters = {}) => {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => api.invoices.list(filters),
    staleTime: 30000,
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoices', id],
    queryFn: () => api.invoices.getById(id),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.invoices.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Rechnung erstellt');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.invoices.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Rechnung aktualisiert');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.invoices.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Rechnung gelöscht');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

// ============================================================================
// DOCUMENTS
// ============================================================================

export const useDocuments = (filters = {}) => {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: () => api.documents.list(filters),
    staleTime: 60000,
  });
};

export const useDocument = (id: string) => {
  return useQuery({
    queryKey: ['documents', id],
    queryFn: () => api.documents.getById(id),
    enabled: !!id,
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.documents.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Dokument erstellt');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.documents.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Dokument aktualisiert');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.documents.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Dokument gelöscht');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};

// ============================================================================
// PROFILES
// ============================================================================

export const useProfiles = (filters = {}) => {
  return useQuery({
    queryKey: ['profiles', filters],
    queryFn: () => api.profiles.list(filters),
    staleTime: 60000,
  });
};

export const useProfile = (id: string) => {
  return useQuery({
    queryKey: ['profiles', id],
    queryFn: () => api.profiles.getById(id),
    enabled: !!id,
  });
};

export const useProfileByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['profiles', 'user', userId],
    queryFn: () => api.profiles.getByUserId(userId),
    enabled: !!userId,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.profiles.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Profil aktualisiert');
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });
};
