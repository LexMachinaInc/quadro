# Quadro

Quadro is a kanban board to view your Github issues in the Deus_Lex repository.

It is currently hosted at [quadro-beta.stage](https://quadro-beta.stage.lexmachina.com/)

## Requirement

To get this app working locally, you'll need to:

1. Clone this repo
2. Run npm install
3. Create a [Github Oauth App](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)
   * Set the home page in the App to `http://localhost:8080`
   * Set the redirect URL to `http://localhost:8080/oauth/redirect`
4. create an `.env` file in the root and add the following:

```
SASS_PATH=node_modules:src
CLIENT_ID=CLIENT_ID_GENERATED_IN_GITHUB_OAUTH_APP
CLIENT_SECRET=CLIENT_SECRET_GENERATED_IN_GITHUB_OAUTH_APP
REDIRECT_URL='http://localhost:8080/oauth/redirect'
```

To run this locally for UI changes, you can run just `npm start`, which will start up a local dev server. But you won't be able to make any API requests to Github or authenticate.

To authenticate, you'll have to run `node server` in one tab, and in another `npm run build`.

## Development

Any work that you'd like to push to the repo, please do so in a branch off of `develop` via a pull request. Assign the PR to `@wired4code`. All PRs will be into `develop`, as deployment is handled via `master`.

## Available Scripts

In the project directory, you can run:

### `node server`

This will start the Express server. This is needed to get the Oauth token to access Github.
You will want to open up two terminals. In the one, run `node server`. In the other,
run `npm run build`. Then go to `http://localhost:8080`.

### `npm dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser. You won't
be able to interact with Github.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
