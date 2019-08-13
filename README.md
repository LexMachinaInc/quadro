# Quadro

Quadro is a kanban board in its current state designed to be used with Github. The UI was bootstrapped from the [Create React App](https://github.com/facebook/create-react-app).

A [Node.js](https://nodejs.org)/[Express](https://expressjs.com/) server was added to handle authentication. Based on the current configuration in the `src/config` directory, it connects with the Github API (both GraphQL and REST) to pull in Github Issues.

## Features

#### Drag 'n Drop

Users can drag and drop issue cards from one column to another to update the status label for that issue.

#### Hiding Columns

Users can click on the logged-in user avatar to open up a side drawer menu where they can toggle column visibility. This setting state is stored in local storage.

#### Hiding Status Labels

Users can elect to hide status labels on issues cards that pertain to the actual status column on the board. This setting state is also stored in local storage.


## Requirement

To get this app working locally, in addition to having a Github account, you'll need to:

1. Clone this repo
2. Run `npm install`
3. Create a [Github Oauth App](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)
   * Set the `Homepage URL` in the App to `http://localhost:3000`
   * Set the `Authorization callback URL` to `http://localhost:3000/oauth/redirect`
4. Create an `.env` file in the root and add the following:

```
SASS_PATH=node_modules:src
CLIENT_ID=CLIENT_ID_GENERATED_IN_GITHUB_OAUTH_APP
CLIENT_SECRET=CLIENT_SECRET_GENERATED_IN_GITHUB_OAUTH_APP
REDIRECT_URL='http://localhost:3000/oauth/redirect'
```

5. Start the development server by running `npm run dev`; this will open up your default browser to `localhost:3000`, and you should see:

[![Quadro-Screenshot.png](https://i.postimg.cc/85ZkrF8S/Quadro-Screenshot.png)](https://postimg.cc/ft0QGRT2)

## Development

Any work that you'd like to push to this repo, please do so in a branch off of `develop` via a pull request. Assign the PR to `@wired4code`. All PRs will be into `develop`, as deployment is handled via `master`.

## Requested Features or Bugs

Please create a detailed issue and assign it to `@wired4code`.

## Forking This Repo

If you'd like to fork this repository and customize it to use with Github or another service, you will need to update `api.js` inside the `src/config` directory. This file contains all the API-related data, e.g., the API endpoints, owner name, repository, and customizations for the board. If you are looking to use a different form of authentication, you will also need to update the code in `server.js`, which currently is setup to do authentication via Github Oauth.

## Deployment

The Create React App documentation has a section on [deployment](https://create-react-app.dev/docs/deployment). In the root directory of this repository, you will find an `app.yaml` configuration file that was written to work with [Google App Engine](https://cloud.google.com/appengine/) for deployment in a Node.js 10 runtime environment.

The `app.yaml` file is also configured to use the `build` directory for deployment to production. For example, when you are ready to deploy (or deploy updates), you can run `npm run build` to create a production build of the application, and then upload that to your Google App Engine project to kick off a new deployment.

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

## FAQs

#### What does logging out do?

When a user first signs in, we are storing the authorization token in a cookie. This cookie has a 14-day expiration, but you can clear the cookie by logging out of the app. Otherwise, we are storing this token to reduce the number of network requests that need to be made for each API call. Additionally, if a user doesn't log out, the next time they visit the application, they will be logged in automatically.

#### Github Oauth

Quadro uses Github Oauth for authentication. At any point, however, you can you remove Quadro from your list of authorized Oauth apps in Github by visiting [https://github.com/settings/applications](https://github.com/settings/applications)
