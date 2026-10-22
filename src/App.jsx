import { useMemo, useState } from 'react';
import TicketRow from './components/TicketRow.jsx';
import { useTickets } from './hooks/useTickets.js';

export default function App() {
  const [workspaceId, setWorkspaceId] = useState('support');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sortDirection, setSortDirection] = useState('asc');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [request, setRequest] = useState({ revision: 0, fail: false });
  const { tickets, loading, error } = useTickets(workspaceId, request);

  const visibleTickets = useMemo(() => {
    const search = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesSearch = `${ticket.id} ${ticket.title}`.toLowerCase().includes(search);
      const matchesStatus = status === 'all' || ticket.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [tickets]);

  const sortedTickets = [...visibleTickets].sort((first, second) => {
    const order = first.title.localeCompare(second.title);
    return sortDirection === 'asc' ? order : -order;
  });
  function refreshTickets() {
    setRequest((previous) => ({ revision: previous.revision + 1, fail: simulateFailure }));
  }

  function changeWorkspace(event) {
    setWorkspaceId(event.target.value);
    setRequest((previous) => ({ revision: previous.revision + 1, fail: simulateFailure }));
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Workspace overview">
        <a className="brand" href="#main"><span className="brand-mark">Q</span>QueueDesk<span className="brand-dot">.</span></a>
        <span className="sidebar-label">WORKSPACE</span>
        <div className="sidebar-item"><span aria-hidden="true">▤</span>Ticket inbox<span className="nav-dot" /></div>
        <div className="sidebar-note"><span className="live-dot" />Local demo environment<p>Sample tickets. A little space to keep support moving.</p></div>
        <div className="sidebar-profile"><span className="profile-avatar">M</span><div>Mona<span>Support operations</span></div></div>
      </aside>
      <main id="main">
        <header className="page-header">
          <div><p className="eyebrow">OPERATIONS / TICKET INBOX</p><h1>A clearer queue.</h1><p className="page-description">Find the next priority. Keep the team in the loop.</p></div>
          <span className="demo-badge"><span className="live-dot" />Demo workspace</span>
        </header>

        <section className="inbox" aria-labelledby="inbox-title">
          <div className="inbox-heading"><div><h2 id="inbox-title">Your inbox</h2><p>Every conversation, with the context you need.</p></div><button type="button" className="secondary-button" onClick={refreshTickets}>Refresh tickets</button></div>
          <div className="filters">
            <label>Workspace<select value={workspaceId} onChange={changeWorkspace}><option value="support">Support</option><option value="billing">Billing</option></select></label>
            <label className="search-field">Search tickets<input type="search" placeholder="Search by title or ticket ID…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
            <label>Status<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option value="open">Open</option><option value="pending">Pending</option><option value="resolved">Resolved</option></select></label>
          </div>
          <div className="list-toolbar"><span>{loading ? 'Fetching your queue' : `${visibleTickets.length} tickets in view`}</span><button type="button" className="text-button" aria-label="Sort by title" onClick={() => setSortDirection((previous) => previous === 'asc' ? 'desc' : 'asc')}>Title {sortDirection === 'asc' ? 'A → Z' : 'Z → A'}</button></div>

          {loading ? (
            <div className="empty-state" role="status"><span className="spinner" aria-hidden="true" />Loading tickets…</div>
          ) : error ? (
            <div className="empty-state error-state"><p role="alert">{error}</p><button type="button" className="secondary-button" onClick={refreshTickets}>Retry</button></div>
          ) : sortedTickets.length === 0 ? (
            <div className="empty-state"><h3>No tickets found</h3><p>Try a different search or status.</p></div>
          ) : (
            <div className="ticket-grid">{sortedTickets.map((ticket, index) => <TicketRow key={index} ticket={ticket} />)}</div>
          )}
        </section>

        <footer className="page-footer"><p>Draft notes stay here while their ticket is in view.</p><label className="failure-toggle"><input type="checkbox" checked={simulateFailure} onChange={(event) => setSimulateFailure(event.target.checked)} />Simulate API failure</label><span className="failure-help">Applies to the next refresh or workspace request.</span></footer>
      </main>
    </div>
  );
}
