/**
 * Money utility — all monetary values are stored and computed as integer minor units
 * (e.g., paise for INR, cents for USD). This avoids floating-point rounding errors.
 *
 * Example: ₹1,234.56 is stored as 123456 (integer).
 */

/**
 * Convert a display amount (e.g., 1234.56) to minor units (e.g., 123456).
 * Rounds to avoid floating-point issues.
 */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert minor units (e.g., 123456) to a display amount (e.g., 1234.56).
 */
export function fromMinorUnits(minorUnits: number): number {
  return minorUnits / 100;
}

/**
 * Format minor units as a currency string.
 * @param minorUnits - Amount in minor units (e.g., 123456 for ₹1,234.56)
 * @param currencyCode - ISO currency code (default: 'INR')
 * @param locale - Locale string (default: 'en-IN')
 */
export function formatCurrency(
  minorUnits: number,
  currencyCode: string = 'INR',
  locale: string = 'en-IN'
): string {
  const amount = fromMinorUnits(minorUnits);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export const formatMoney = formatCurrency;

/**
 * Add multiple minor-unit amounts safely.
 */
export function addAmounts(...amounts: number[]): number {
  return amounts.reduce((sum, amt) => sum + amt, 0);
}

/**
 * Calculate a percentage of an amount in minor units.
 * Uses basis points (bps) internally: 1% = 100 bps.
 * @param amount - Amount in minor units
 * @param rateBps - Rate in basis points (e.g., 1800 = 18%)
 */
export function calculatePercentage(amount: number, rateBps: number): number {
  return Math.round((amount * rateBps) / 10000);
}

/**
 * Calculate tax amount from a subtotal.
 * @param subtotal - Subtotal in minor units
 * @param taxRateBps - Tax rate in basis points (e.g., 500 = 5%, 1800 = 18%)
 */
export function calculateTax(subtotal: number, taxRateBps: number): number {
  return calculatePercentage(subtotal, taxRateBps);
}

/**
 * Calculate service charge from a subtotal.
 * @param subtotal - Subtotal in minor units
 * @param serviceChargeBps - Service charge in basis points (e.g., 1000 = 10%)
 */
export function calculateServiceCharge(
  subtotal: number,
  serviceChargeBps: number
): number {
  return calculatePercentage(subtotal, serviceChargeBps);
}

/**
 * Calculate the line total for an order line.
 * @param unitPrice - Unit price in minor units
 * @param quantity - Number of items
 * @param modifierPrices - Array of modifier prices in minor units
 */
export function calculateLineTotal(
  unitPrice: number,
  quantity: number,
  modifierPrices: number[] = []
): number {
  const modifierTotal = addAmounts(...modifierPrices);
  return (unitPrice + modifierTotal) * quantity;
}

/**
 * Calculate a complete bill breakdown.
 */
export function calculateBillTotals(params: {
  lineItems: Array<{ unitPrice: number; quantity: number; modifierPrices?: number[] }>;
  taxRateBps: number;
  serviceChargeBps: number;
  discountMinor?: number;
  deliveryFeeMinor?: number;
}): {
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  deliveryFee: number;
  total: number;
} {
  const { lineItems, taxRateBps, serviceChargeBps, discountMinor = 0, deliveryFeeMinor = 0 } = params;

  const subtotal = lineItems.reduce(
    (sum, item) => sum + calculateLineTotal(item.unitPrice, item.quantity, item.modifierPrices),
    0
  );

  const tax = calculateTax(subtotal, taxRateBps);
  const serviceCharge = calculateServiceCharge(subtotal, serviceChargeBps);
  const discount = Math.min(discountMinor, subtotal); // discount can't exceed subtotal
  const total = subtotal + tax + serviceCharge - discount + deliveryFeeMinor;

  return {
    subtotal,
    tax,
    serviceCharge,
    discount,
    deliveryFee: deliveryFeeMinor,
    total: Math.max(0, total), // total can't be negative
  };
}
