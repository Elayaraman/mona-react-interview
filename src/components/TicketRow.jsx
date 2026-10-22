import { useState } from 'react';

export default function TicketRow({ ticket, bookmarked, onBookmark }) {
  const [draft, setDraft] = useState('');

  return (
    <article className="ticket-card" aria-label={`Ticket ${ticket.id}`}>
      <div className="ticket-heading">
        <div className="ticket-meta">
          <span className="ticket-id">{ticket.id}</span>
          <span className={`status-badge ${ticket.status}`}>{ticket.status}</span>
          <span className={`priority ${ticket.priority.toLowerCase()}`}>{ticket.priority} priority</span>
        </div>
        <button
          type="button"
          className={`bookmark-button ${bookmarked ? 'active' : ''}`}
          aria-label={`${bookmarked ? 'Remove bookmark' : 'Bookmark'} ${ticket.id}`}
          aria-pressed={bookmarked}
          onClick={() => onBookmark(ticket.id)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4z" /></svg>
        </button>
      </div>
      <h3>{ticket.title}</h3>
      <p className="ticket-description">{ticket.description}</p>
      <div className="ticket-details">
        <span>{ticket.customer}</span>
        <span className="assignee"><span className="avatar" aria-hidden="true">{ticket.initials}</span>{ticket.assignee}</span>
        <span className="estimate">{ticket.estimatedHours}h estimate</span>
      </div>
      <label className="draft-label" htmlFor={`note-${ticket.id}`}>Internal draft</label>
      <textarea
        id={`note-${ticket.id}`}
        aria-label={`Draft note for ${ticket.id}`}
        placeholder="Add context for the team…"
        rows={2}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
    </article>
  );
}
