-- ==================================================================================
-- PERFORMANCE INDEXES - CRITICAL DATABASE OPTIMIZATIONS
-- ==================================================================================
-- Purpose: Add missing indexes for frequently queried columns
-- Impact: Dramatic performance improvement for list pages and dashboards
-- ==================================================================================

-- ==================================================================================
-- BOOKINGS TABLE INDEXES
-- ==================================================================================

-- Company + Status filter (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_bookings_company_status
ON bookings(company_id, status)
WHERE archived = false;

-- Pickup time sorting (dashboard, list pages)
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_time
ON bookings(pickup_time DESC)
WHERE archived = false;

-- Driver assignment queries
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id
ON bookings(driver_id)
WHERE driver_id IS NOT NULL AND archived = false;

-- Customer bookings lookup
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id
ON bookings(customer_id)
WHERE archived = false;

-- Composite index for dashboard statistics
CREATE INDEX IF NOT EXISTS idx_bookings_dashboard_stats
ON bookings(company_id, status, pickup_time DESC)
WHERE archived = false;

-- Date-based queries (daily reports, statistics)
CREATE INDEX IF NOT EXISTS idx_bookings_created_at
ON bookings(created_at DESC)
WHERE archived = false;

-- ==================================================================================
-- CUSTOMERS TABLE INDEXES
-- ==================================================================================

-- Email lookup (login, customer portal)
CREATE INDEX IF NOT EXISTS idx_customers_email
ON customers(LOWER(email))
WHERE archived = false;

-- Phone lookup (booking creation)
CREATE INDEX IF NOT EXISTS idx_customers_phone
ON customers(phone)
WHERE phone IS NOT NULL AND archived = false;

-- Company + archived filter (list pages)
CREATE INDEX IF NOT EXISTS idx_customers_company_archived
ON customers(company_id, archived);

-- ==================================================================================
-- DRIVERS TABLE INDEXES
-- ==================================================================================

-- Company + Status + Available (dispatch queries)
CREATE INDEX IF NOT EXISTS idx_drivers_company_status_available
ON drivers(company_id, status, available)
WHERE archived = false;

-- Email lookup
CREATE INDEX IF NOT EXISTS idx_drivers_email
ON drivers(LOWER(email))
WHERE archived = false;

-- Phone lookup
CREATE INDEX IF NOT EXISTS idx_drivers_phone
ON drivers(phone)
WHERE phone IS NOT NULL AND archived = false;

-- ==================================================================================
-- VEHICLES TABLE INDEXES
-- ==================================================================================

-- Company + Status (vehicle assignment)
CREATE INDEX IF NOT EXISTS idx_vehicles_company_status
ON vehicles(company_id, status)
WHERE archived = false;

-- License plate lookup (unique identifier)
CREATE INDEX IF NOT EXISTS idx_vehicles_license_plate
ON vehicles(license_plate)
WHERE archived = false;

-- Driver assignment
CREATE INDEX IF NOT EXISTS idx_vehicles_driver_id
ON vehicles(current_driver_id)
WHERE current_driver_id IS NOT NULL AND archived = false;

-- ==================================================================================
-- INVOICES TABLE INDEXES
-- ==================================================================================

-- Payment status queries (finance dashboard)
CREATE INDEX IF NOT EXISTS idx_invoices_company_payment_status
ON invoices(company_id, payment_status)
WHERE archived = false;

-- Due date sorting (overdue invoices)
CREATE INDEX IF NOT EXISTS idx_invoices_due_date
ON invoices(due_date DESC)
WHERE archived = false;

-- Invoice number lookup (unique search)
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number
ON invoices(invoice_number)
WHERE archived = false;

-- ==================================================================================
-- DOCUMENTS TABLE INDEXES
-- ==================================================================================

-- Entity lookup (booking documents, driver documents, etc.)
CREATE INDEX IF NOT EXISTS idx_documents_entity
ON documents(entity_type, entity_id)
WHERE archived = false;

-- Company + Type filter
CREATE INDEX IF NOT EXISTS idx_documents_company_type
ON documents(company_id, document_type)
WHERE archived = false;

-- Upload date sorting
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at
ON documents(uploaded_at DESC)
WHERE archived = false;

-- ==================================================================================
-- SHIFTS TABLE INDEXES
-- ==================================================================================

-- Driver shifts lookup (driver app)
CREATE INDEX IF NOT EXISTS idx_shifts_driver_date
ON shifts(driver_id, shift_date DESC)
WHERE archived = false;

-- Company + date range (shift planning)
CREATE INDEX IF NOT EXISTS idx_shifts_company_date
ON shifts(company_id, shift_date DESC)
WHERE archived = false;

-- Status queries (active shifts monitoring)
CREATE INDEX IF NOT EXISTS idx_shifts_status
ON shifts(status)
WHERE archived = false;

-- ==================================================================================
-- GPS_POSITIONS TABLE INDEXES
-- ==================================================================================

-- Real-time tracking (most recent position)
CREATE INDEX IF NOT EXISTS idx_gps_positions_driver_timestamp
ON gps_positions(driver_id, timestamp DESC);

-- Booking tracking
CREATE INDEX IF NOT EXISTS idx_gps_positions_booking_timestamp
ON gps_positions(booking_id, timestamp DESC)
WHERE booking_id IS NOT NULL;

-- Company-wide tracking
CREATE INDEX IF NOT EXISTS idx_gps_positions_company_timestamp
ON gps_positions(company_id, timestamp DESC);

-- ==================================================================================
-- PROFILES TABLE INDEXES
-- ==================================================================================

-- User lookup by email (login)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id
ON profiles(user_id);

-- Company members lookup
CREATE INDEX IF NOT EXISTS idx_profiles_company_role
ON profiles(company_id, role)
WHERE archived = false;

-- ==================================================================================
-- COMPANIES TABLE INDEXES
-- ==================================================================================

-- Subscription status queries (admin dashboard)
CREATE INDEX IF NOT EXISTS idx_companies_subscription_status
ON companies(subscription_status)
WHERE archived = false;

-- Tariff-based queries
CREATE INDEX IF NOT EXISTS idx_companies_tariff
ON companies(tariff_plan)
WHERE archived = false;

-- ==================================================================================
-- ANALYZE TABLES FOR QUERY PLANNER
-- ==================================================================================

ANALYZE bookings;
ANALYZE customers;
ANALYZE drivers;
ANALYZE vehicles;
ANALYZE invoices;
ANALYZE documents;
ANALYZE shifts;
ANALYZE gps_positions;
ANALYZE profiles;
ANALYZE companies;

-- ==================================================================================
-- COMMENTS FOR DOCUMENTATION
-- ==================================================================================

COMMENT ON INDEX idx_bookings_company_status IS 'Critical index for bookings list filtering by company and status';
COMMENT ON INDEX idx_bookings_dashboard_stats IS 'Composite index for dashboard statistics queries';
COMMENT ON INDEX idx_customers_email IS 'Case-insensitive email lookup for customer login';
COMMENT ON INDEX idx_drivers_company_status_available IS 'Dispatch system index for finding available drivers';
COMMENT ON INDEX idx_gps_positions_driver_timestamp IS 'Real-time GPS tracking index';
