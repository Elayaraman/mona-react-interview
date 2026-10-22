# QueueDesk — React debugging exercise

**Candidate: Mona · Suggested duration: 60 minutes**

You have inherited a small support dashboard. It starts successfully, but users have reported unreliable behavior. Your task is to investigate, repair the behavior you consider most important, and explain how you verified your changes.

This is a practice evaluation, not a replica of a particular employer's interview.

## Run the project

Use Node.js **24.15 or later in the 24.x release line** and npm (`nvm use` selects Node 24 if you use nvm). Node 22.22.2+ in the 22.x line is also supported.

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:5173**. If that port is occupied, stop its existing process or run `npm run dev -- --port 5174` and use the URL printed in the terminal.

```sh
npm test
npm run build
```

Some behavioral tests are expected to fail in the starting project. A successful build only establishes that the application can be bundled; it does not establish that the dashboard works correctly.

The project uses React, JavaScript, Vite, and an in-memory mock API. You do not need a backend, account, API key, or database. The mock API deliberately has different response times for the two workspaces. Those timings are part of the environment and should remain unchanged.

## Product requirements

- The selected workspace determines which tickets appear. Changing workspaces should remain reliable even when requests finish in a different order from when they started.
- Search matches ticket titles or IDs without case sensitivity. Search and the status filter work together; clearing them restores the appropriate list.
- Sorting changes the order of the visible tickets. A draft note belongs to its ticket and should remain attached to that ticket when the list is reordered.
- Bookmarks can be toggled on and off. The count reflects all bookmarks in the current browser session, including tickets outside the visible workspace or filter.
- Total estimated hours is the numeric sum for the currently visible tickets. The complete Support workspace totals **8 hours**; Billing totals **3 hours**.
- Loading, success, and failure are understandable states. A failed request stops loading, displays a useful message, and allows recovery.
- Refresh fetches the selected workspace again. **Simulate API failure** affects subsequent requests; toggle it and then use **Refresh tickets** to exercise failure handling. Turn it off before retrying a successful request.

Bookmarks and draft notes do not need to survive a page reload. Draft persistence across filtering, refreshes, or workspace changes is outside this exercise; retaining a draft through sorting is required.

## How to approach the session

| Time | Focus |
| --- | --- |
| 5 minutes | Install, run, and orient yourself in the code. |
| 10 minutes | Reproduce issues and choose your priorities. |
| 35 minutes | Make focused fixes and verify them. |
| 10 minutes | Explain the changes, remaining issues, and trade-offs. |

Use the existing tests as a starting point, and add or improve a regression test where it provides useful evidence. Preserve the intended product behavior; making assertions weaker or removing a feature does not resolve a defect. A redesign, new state-management library, and dependency upgrades are unnecessary.

Talk through your reasoning. If you run out of time, leave a clear account of what you reproduced, what you fixed, what you tested, and what you would do next. A well-explained partial solution is useful evidence.

At handoff, provide your edited source and tests, the commands you ran and their outcomes, and a short list of any remaining concerns.
