import { useEffect, useState } from 'react';
import { listTickets } from '../api/tickets.js';

export function useTickets(workspaceId, request) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setTickets([]);

    listTickets(workspaceId, { fail: request.fail })
      .then((result) => {
        setTickets(result);
        setLoading(false);
      })
      .catch((reason) => {
        setError(reason.message);
      });
  }, [workspaceId, request]);

  return { tickets, loading, error };
}
