# QueueDesk — React debugging exercise

**Candidate: Mona · Suggested duration: 60 minutes**

Make the dashboard satisfy the expected behaviours below. Investigate the implementation independently and verify your changes.

## Run the project

Use Node.js **24.15 or later in the 24.x release line** and npm (`nvm use` selects Node 24 if you use nvm). Node 22.22.2+ in the 22.x line is also supported.

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:5173**. If that port is occupied, stop its existing process or run `npm run dev -- --port 5174` and use the URL printed in the terminal.

The project uses React, JavaScript, Vite, and a local mock API. No backend, account, API key, or database is required. Keep the supplied API data and timing unchanged.

## Expected behaviours

| Feature | Expected behaviour |
| --- | --- |
| Initial view | Support is selected on launch. Once loaded, it shows four tickets in ascending title order. |
| Workspace selection | Support contains four tickets; Billing contains two. The displayed tickets always match the latest selected workspace, including when selections change rapidly. |
| Search | Match ticket titles or IDs without case sensitivity, ignoring surrounding spaces. Clearing search restores the tickets allowed by the current status filter. |
| Status filter | All statuses shows every matching ticket. Open, Pending, and Resolved show only matching tickets with that status. Search and status apply together. |
| Empty results | Show a clear empty state when no tickets match. Changing the filters can restore results. |
| Sorting | The title control toggles ascending and descending order for the visible tickets. |
| Draft notes | Each ticket has an editable internal draft. Its text stays attached to that same ticket when the list is sorted. |
| Bookmarks | Bookmarking or removing a bookmark immediately updates the button and count. The count includes bookmarks outside the current workspace or filtered view. |
| Summary | The visible-ticket count matches the list. Estimated effort is the numeric sum of the visible tickets: all Support tickets total 8 hours, all Billing tickets total 3 hours, and Open Support tickets total 5.5 hours. |
| Loading | Show a loading indicator while the current request is pending, then display its result. |
| Request failure | Stop loading and display a useful error message with a Retry action when the current request fails. |
| Refresh and retry | Refresh reloads the selected workspace. Retry can recover from a failed request and display the tickets. |
| Failure simulation | Simulate API failure affects subsequent refresh or workspace requests. After it is disabled, a retry can succeed. |

Bookmarks and drafts need not survive a page reload. Draft retention across filtering, refreshes, or workspace changes is outside the exercise; retaining drafts through sorting is required.

## Verification

Verify the expected behaviours and ensure `npm run build` succeeds. You may write your own tests; `npm test` runs tests you add. At handoff, explain your changes, how you verified them, and any remaining work.
