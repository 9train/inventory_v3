# Slack Laptop Inventory Bot (v3, Modular + SOP)

This build fixes the “no modal” issue by handling slash commands the **standard Bolt way** on `/slack/events` and makes the app **modular**, **scalable**, and **debuggable** with JSON logs you can tail.

## Quick Start

1. **Create Slack app** → Enable Socket Mode _off_ (we’re using HTTP), add:
   - Slash Commands:
     - `/cbstatus` → **Request URL**: `https://YOUR-PUBLIC-URL/slack/events`
     - `/cbrequest` → **Request URL**: `https://YOUR-PUBLIC-URL/slack/events`
   - Install to workspace → copy **Bot Token**; copy **Signing Secret**.
   - **Interactivity**: ON (needed for modals), Request URL can be any valid page (Bolt responds on `/slack/events` automatically).

2. **Google Sheets**
   - Share the sheet with your service account email.
   - Tabs: one per weekday you plan to use (e.g., `Wednesday`, `Saturday`).
   - Columns: `START | END | ROOM | AMOUNT | NOTES` (row 1 is header).

3. **Env**
   - Copy `.env.example` → `.env` and fill values.
   - Put your service account JSON at `gcp-service-account.json` (or paste inline JSON into `GOOGLE_SERVICE_ACCOUNT_JSON`).

4. **Run**
   ```bash
   npm install
   npm run dev
