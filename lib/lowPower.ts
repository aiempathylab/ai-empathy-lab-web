/**
 * Weak hardware: four or fewer cores, or 4 GB of memory or less (where the
 * browser says). Motion that would cost frames there is cut back or
 * dropped, and each caller says how.
 */
export function isLowPower(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
}
