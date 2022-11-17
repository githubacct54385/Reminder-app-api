# Reminder-app-api

# Overview
Express JS backend for the reminder app.

Uses Auth0 for authentication.

Using Prisma as a type-safe ORM.

Database is Postgres.

Sends emails using SendGrid.

# Environment Variables for local development
Please add a file `.env` into the root.  Put the following variables in there
```env
DATABASE_URL="YOUR_POSTGRES_CONNECTION_STRING"
AUDIENCE="AUTH0_AUDIENCE"
ISSUER="AUTH0_ISSUER"
ORIGINS="ALLOWED_ORIGINS_FOR_CORS_AS_COMMA_SEPARATED_LIST"
JWKSURI="AUTH0_JWKSURI"
SENDGRID_API_KEY="YOUR_SENDGRID_API_KEY"
SENDGRID_VERIFIED_SENDER="YOUR_VERIFIED_SENDER_EMAIL"
```

# How to run
`npm install`

`npm run start`
