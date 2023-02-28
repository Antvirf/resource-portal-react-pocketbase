# Resource Portal

A basic resource portal intended for self-service creation of database instances, created with a React and Bootstrap-based frontend on top of a PocketBase backend.

* User/Pass based login
* List current databases
* Create a new database
* Request deletion of a database

## To-do / further work

* **!** Actual execution of DB creations/deletions at the backend (extend PocketBase)
* **!** OAuth-based login
* Allow addition of 'viewers' to a DB
  * Owner can add or remove viewers
  * Viewers have full rights to the DB and can see their details

## Run the PocketBase backend - no dependencies required

```bash
./pocketbase/pocketbase serve
```

## Run the frontend

```bash
npm install # install dependencies
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes. You may also see any lint errors in the console.

## Additional links/notes (created by `create-react-app`)

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
