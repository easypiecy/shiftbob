export const EMPLOYEE_COUNT_BANDS = [
  "5-20",
  "21-50",
  "51-150",
  "151+",
] as const;

export type EmployeeCountBand = (typeof EMPLOYEE_COUNT_BANDS)[number];

export const NOTIFICATION_CHANNELS = ["push", "sms"] as const;

export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export function isEmployeeCountBand(s: string): s is EmployeeCountBand {
  return (EMPLOYEE_COUNT_BANDS as readonly string[]).includes(s);
}

export function isNotificationChannel(s: string): s is NotificationChannel {
  return (NOTIFICATION_CHANNELS as readonly string[]).includes(s);
}
