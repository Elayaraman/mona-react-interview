import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from '../App.jsx';

// Keep the simulated API timing deterministic. These tests exercise the UI;
// they do not depend on the implementation used to satisfy the requirements.
async function advanceApi(milliseconds = 800) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(milliseconds);
  });
}

async function renderLoadedApp() {
  render(<App />);
  await advanceApi();
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe('QueueDesk acceptance checks', () => {
  it('shows a loading state while the first request is pending', async () => {
    render(<App />);

    expect(screen.getByText('Loading tickets…')).toBeInTheDocument();
    await advanceApi();

    expect(screen.queryByText('Loading tickets…')).not.toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Ticket T-101' })).toBeInTheDocument();
  });

  it('loads the four support tickets with usable controls', async () => {
    await renderLoadedApp();

    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(screen.getByRole('combobox', { name: 'Workspace' })).toHaveValue('support');
    expect(screen.getByRole('searchbox', { name: 'Search tickets' })).toHaveValue('');
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveValue('all');
    expect(screen.getByRole('heading', { name: 'CSV export missing rows' })).toBeInTheDocument();
  });

  it('loads billing after a completed support request', async () => {
    await renderLoadedApp();

    fireEvent.change(screen.getByRole('combobox', { name: 'Workspace' }), {
      target: { value: 'billing' },
    });
    await advanceApi();

    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.getByRole('article', { name: 'Ticket B-201' })).toBeInTheDocument();
    expect(screen.queryByRole('article', { name: 'Ticket T-101' })).not.toBeInTheDocument();
  });

  it('updates the visible tickets when search and status change', async () => {
    await renderLoadedApp();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search tickets' }), {
      target: { value: 'CSV' },
    });

    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('article', { name: 'Ticket T-103' })).toBeInTheDocument();

    fireEvent.change(screen.getByRole('combobox', { name: 'Status' }), {
      target: { value: 'pending' },
    });

    expect(screen.queryAllByRole('article')).toHaveLength(0);
    expect(screen.getByRole('heading', { name: 'No tickets found' })).toBeInTheDocument();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search tickets' }), {
      target: { value: '  BILLING  ' },
    });

    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('article', { name: 'Ticket T-102' })).toBeInTheDocument();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search tickets' }), {
      target: { value: '' },
    });
    expect(screen.getAllByRole('article')).toHaveLength(1);

    fireEvent.change(screen.getByRole('combobox', { name: 'Status' }), {
      target: { value: 'all' },
    });
    expect(screen.getAllByRole('article')).toHaveLength(4);
  });

  it('keeps the latest workspace visible when responses arrive out of order', async () => {
    render(<App />);

    // Billing responds before the initial support request. Wait for both.
    fireEvent.change(screen.getByRole('combobox', { name: 'Workspace' }), {
      target: { value: 'billing' },
    });
    await advanceApi();

    expect(screen.getByRole('combobox', { name: 'Workspace' })).toHaveValue('billing');
    expect(screen.getByRole('article', { name: 'Ticket B-201' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(screen.queryByRole('article', { name: 'Ticket T-101' })).not.toBeInTheDocument();
  });

  it('updates bookmark feedback immediately and supports removing a bookmark', async () => {
    await renderLoadedApp();

    fireEvent.click(screen.getByRole('button', { name: 'Bookmark T-101', exact: true }));

    expect(screen.getByTestId('bookmarked-count')).toHaveTextContent(/^1$/);
    fireEvent.click(screen.getByRole('button', { name: 'Remove bookmark T-101', exact: true }));
    expect(screen.getByTestId('bookmarked-count')).toHaveTextContent(/^0$/);
    expect(screen.getByRole('button', { name: 'Bookmark T-101', exact: true })).toBeInTheDocument();
  });

  it('keeps an unsaved draft attached to its ticket after sorting', async () => {
    await renderLoadedApp();

    fireEvent.change(screen.getByRole('textbox', { name: 'Draft note for T-101' }), {
      target: { value: 'Ask customer for the exact login error.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sort by title', exact: true }));

    expect(screen.getAllByRole('article')[0]).toHaveAccessibleName('Ticket T-104');
    expect(screen.getByRole('textbox', { name: 'Draft note for T-101' })).toHaveValue(
      'Ask customer for the exact login error.',
    );
    expect(screen.getByRole('textbox', { name: 'Draft note for T-104' })).toHaveValue('');
  });

  it('shows a failed request as an error and lets the user retry successfully', async () => {
    await renderLoadedApp();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Simulate API failure' }));
    fireEvent.click(screen.getByRole('button', { name: 'Refresh tickets', exact: true }));
    await advanceApi();

    expect(screen.queryByText('Loading tickets…')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Unable to load tickets. Try again.');
    expect(screen.getByRole('button', { name: 'Retry', exact: true })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Simulate API failure' }));
    fireEvent.click(screen.getByRole('button', { name: 'Retry', exact: true }));
    await advanceApi();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading tickets…')).not.toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(4);
  });

  it('adds estimated hours numerically for the loaded workspace', async () => {
    await renderLoadedApp();

    expect(screen.getByTestId('total-hours')).toHaveTextContent(/^8$/);

    fireEvent.change(screen.getByRole('combobox', { name: 'Workspace' }), {
      target: { value: 'billing' },
    });
    await advanceApi();

    expect(screen.getByTestId('total-hours')).toHaveTextContent(/^3$/);
  });
});
