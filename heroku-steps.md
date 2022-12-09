# Heroku Deployment Steps

## Environment variables
Ensure these environment variables are set in your application's configuration:

``` sh
PGSSLMODE=require
API_PREFIX=/api/v1
```

Note the `API_PREFIX`, which differs from prior backend projects.

## Postgres

Add PostgreSQL support via the "Heroku Postgres" plugin - as is done normally
via prior backend work.

See [Heroku deployment
notes](https://github.com/alchemycodelab/student-resources/blob/902901a1f2fbbbdb8d976e8443c5097de1e0d6fe/curriculum-notes/express/lecture-notes/01d-heroku-deployment.md)
for now this is done.

## Connect to GitHub

Connect to GitHub as you normally would for backend work.

See [Heroku deployment
notes](https://github.com/alchemycodelab/student-resources/blob/902901a1f2fbbbdb8d976e8443c5097de1e0d6fe/curriculum-notes/express/lecture-notes/01d-heroku-deployment.md)
for now this is done.

# How does this work without Netlify?

`server/app.ts` (or `.js`, depending on your configuration) uses
`express.static`, which hosts the files under `public` as static assets, much
like Netlify would.

The `public` directory itself is populated by Webpack - see the `output` section
of your `webpack.config.js` for how this is indicated.
