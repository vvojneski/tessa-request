# Penetration Testing Request Form - Render Deployment Guide

This project is configured for deployment on [Render](https://render.com/).

## Configuration Files

- `render.yaml`: Contains the Blueprint specification for Render.
  - Web Service: `penetration-tester-guide`
  - Database: `penetration-db` (PostgreSQL)
  - Port: `5000`

## Deployment Steps

1. Create a new **Blueprint** on Render.
2. Connect your repository.
3. Render will automatically detect the `render.yaml` file and provision the database and web service.

## Environment Variables

The following variables should be configured in the Render dashboard if they are not synced via the Blueprint:

- `DATABASE_URL`: Automatically provided by the Render PostgreSQL attachment.
- `NODE_ENV`: Set to `production`.
- `PORT`: Set to `5000`.
- `SLACK_WEBHOOK_URL`: (Optional) For Slack notifications.
- `SMTP_HOST`: (Optional) For email notifications.

## Security Considerations

- The app uses `helmet` for security headers.
- Rate limiting is applied to `/api/` endpoints.
- Ensure `DATABASE_URL` is kept secret and not exposed in logs.
