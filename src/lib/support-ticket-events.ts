export const SUPPORT_TICKET_OPEN_EVENT = "shiftbob:open-support-ticket";

export type SupportTicketOpenDetail = {
  subject?: string;
  message?: string;
};

export function openSupportTicketModal(detail?: SupportTicketOpenDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<SupportTicketOpenDetail>(SUPPORT_TICKET_OPEN_EVENT, { detail })
  );
}
