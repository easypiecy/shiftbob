import {
  getNotificationBroadcastData,
  type NotificationAudienceMember,
  type NotificationAudienceWorkplace,
  type RecentNotificationBatch,
} from "@/src/app/super-admin/notifications-actions";
import NotificationsBroadcastClient from "./notifications-broadcast-client";

export default async function SuperAdminNotificationsBroadcastPage() {
  const res = await getNotificationBroadcastData();
  if (!res.ok) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100">
        Kunne ikke hente notifikationsudsendelse: {res.error}
      </div>
    );
  }

  return (
    <NotificationsBroadcastClient
      workplaces={res.workplaces as NotificationAudienceWorkplace[]}
      members={res.members as NotificationAudienceMember[]}
      recent={res.recent as RecentNotificationBatch[]}
    />
  );
}
