import { SUPPORT_TICKETS, BILLING_TICKETS } from './data.js';

// Deterministic local service: no backend, credentials, or network required.
// The upstream contract represents estimatedHours as decimal strings.
export function listTickets(workspaceId, { fail = false } = {}) {
  const latency = workspaceId === 'support' ? 650 : 120;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error('Unable to load tickets. Try again.'));
        return;
      }

      const tickets = workspaceId === 'support' ? SUPPORT_TICKETS : BILLING_TICKETS;
      resolve(tickets.map((ticket) => ({ ...ticket })));
    }, latency);
  });
}
