# Quadro

Quadro is a kanban board bootstrapped from the Create React App.

Based on the current configuration, it connects with the Github API (both GraphQL and REST) to pull in Github Issues.

It is currently hosted at [quadro](https://quadro.lexmachina.com)

## Requirement

To get this app working locally, you'll need to:

1. Clone this repo
2. Run npm install
3. Create a [Github Oauth App](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)
   * Set the home page in the App to `http://localhost:3000`
   * Set the redirect URL to `http://localhost:3000/oauth/redirect`
4. create an `.env` file in the root and add the following:

```
SASS_PATH=node_modules:src
CLIENT_ID=CLIENT_ID_GENERATED_IN_GITHUB_OAUTH_APP
CLIENT_SECRET=CLIENT_SECRET_GENERATED_IN_GITHUB_OAUTH_APP
REDIRECT_URL='http://localhost:3000/oauth/redirect'
```

You will need to open two tabs in your terminal and be inside the project in both. In one tab, run `npm dev` and in the other `node server`. This starts up the dev server and also the node/express server.

## Development

Any work that you'd like to push to the repo, please do so in a branch off of `develop` via a pull request. Assign the PR to `@wired4code`. All PRs will be into `develop`, as deployment is handled via `master`.

## Available Scripts

In the project directory, you can run:

To run the application locally while developing, just run `npm run dev`. As long as you have the redirect_url above set to `http://localhost:3000/oauth/redirect`, `npm run dev` will be the only command you need to run.

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `node server`

This will start the Express server. To run the production build, run `node server` in one terminal. In the other,
run `npm run build`. Then go to `http://localhost:8080`.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
