# Penetration Testing Request Form

A secure, multi-step web form for collecting penetration testing scoping information.

## Tech Stack

- **Frontend:** React + Vite (Wizard UI, Framer Motion animations)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (via Drizzle ORM)
- **Styling:** Tailwind CSS + Shadcn UI

## Features

- **Multi-step Wizard:** 6 logical steps for collecting detailed requirements.
- **Validation:** Zod schema validation on both client and server.
- **Persistence:** Submissions are stored in PostgreSQL.
- **Notifications:** Built-in hooks for Slack and Email notifications.

## Setup Instructions

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file (or set these in your environment secrets):
    ```env
    DATABASE_URL=postgres://user:pass@host:5432/dbname
    SLACK_WEBHOOK_URL=https://hooks.slack.com/services/... (Optional)
    SMTP_HOST=smtp.example.com (Optional)
    SMTP_USER=user@example.com (Optional)
    SMTP_PASS=password (Optional)
    ```

3.  **Database Setup:**
    ```bash
    npm run db:push
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Project Structure

- `client/`: React frontend code.
- `server/`: Express backend code.
- `shared/`: Shared types and schemas (Zod/Drizzle).
