/* ==================================================================================
   CENTRAL UTILS INDEX - Single Import Entry Point
   ==================================================================================
   Ermöglicht zentrale Imports:
   
   import { 
     formatCurrency, 
     isValidEmail, 
     handleError,
     truncate,
     timeAgo 
   } from '@/lib';
   
   Statt individueller Imports aus jedem Utility-Modul.
   ================================================================================== */

// Format Utils (Existing - Core Formatting)
export {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatTime,
  formatBookingStatus,
  formatInvoiceStatus,
  formatOfferStatus,
  formatShiftStatus,
  formatPaymentStatus,
  formatVehicleClass,
  getFullName,
} from "./format-utils";

// Format Utils Extended (German Standards)
export {
  formatPercentage,
  formatDistance,
  formatSpeed,
  formatDuration,
  formatFullName,
  formatLetterSalutation,
  formatAddressSingleLine,
  formatPhoneNumber,
  formatCoordinates,
} from "./format-utils-extended";

// Validation Utils (NEW)
export {
  EMAIL_REGEX,
  PHONE_REGEX,
  PLZ_REGEX,
  PASSWORD_PATTERNS,
  PASSWORD_MIN_LENGTH,
  isValidEmail,
  isValidPhone,
  isValidPLZ,
  isValidURL,
  isValidLicensePlate,
  isValidTaxID,
  isValidIBAN,
  validatePassword,
  isPositiveNumber,
  isValidPercentage,
  isValidCoordinate,
  isNotEmpty,
  hasMinLength,
  hasMaxLength,
  isString,
  isNumber,
  isDate,
  isNonNull,
  type PasswordStrength,
} from "./validation-utils";

// API Utils (NEW)
export {
  handleError,
  handleSuccess,
  isPostgrestError,
  getStandardFilters,
  applyQueryFilters,
  queryWithCompanyFilter,
  createSuccessResponse,
  createErrorResponse,
  withRetry,
  type ErrorOptions,
  type QueryFilters,
  type ApiResponse,
  type RetryOptions,
} from "./api-utils";

// String Utils (NEW)
export {
  truncate,
  truncateWords,
  capitalize,
  capitalizeWords,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  slugify,
  getInitials,
  // getFullName exported from format-utils to avoid duplication
  formatName,
  removeExtraSpaces,
  removeDiacritics,
  sanitizeInput,
  isEqualIgnoreCase,
  containsIgnoreCase,
  createExcerpt,
  pluralize,
  pluralizeWithCount,
  maskEmail,
  maskPhone,
  maskIBAN,
} from "./string-utils";

// Date Utils (NEW)
export {
  parseDate,
  toISOString,
  addTime,
  subtractTime,
  isBeforeDate,
  isAfterDate,
  isSameDayDate,
  daysBetween,
  hoursBetween,
  minutesBetween,
  timeAgo,
  timeUntil,
  isBusinessDay,
  addBusinessDays,
  getDateRange,
  getDateStatus,
  isExpiringSoon,
  isExpired,
  formatGermanDate,
  formatGermanDateTime,
  formatGermanTime,
} from "./date-utils";

// Number Utils (NEW)
export {
  roundTo,
  roundUp,
  roundDown,
  clamp,
  clampPercentage,
  calculatePercentage,
  calculatePercentageChange,
  applyPercentage,
  addPercentage,
  subtractPercentage,
  sum,
  average,
  median,
  min,
  max,
  isInRange,
  normalizeToRange,
  distance,
  proximity,
  randomInt,
  randomFloat,
  toFixed,
  formatNumber,
  formatCompact,
  sign,
  isPositive,
  isNegative,
  isZero,
  isEven,
  isOdd,
  safeNumber,
  safePercentage,
  safePositive,
} from "./number-utils";

// Array Utils (NEW)
export {
  unique,
  uniqueBy,
  compact,
  filterByKeys,
  groupBy,
  groupByFunction,
  chunk,
  partition,
  sortBy,
  sortByDate,
  sortByMultiple,
  move,
  shuffle,
  take,
  takeRight,
  drop,
  dropRight,
  findByKey,
  findIndexByKey,
  includes,
  includesAny,
  includesAll,
  count,
  countBy,
  isEqual,
  difference,
  intersection,
  union,
  first,
  last,
  isArrayEmpty,
  isArrayNotEmpty,
} from "./array-utils";

// Utils (Existing - Tailwind Helper)
export { cn } from "./utils";
