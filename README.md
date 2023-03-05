# Resource Portal

A basic resource portal intended for self-service creation of database instances, created with a React and Bootstrap-based frontend on top of a PocketBase backend. Assumed 'main DB' at the back to contain all managed DBs is an [Azure Postgres Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/).

* User/Pass based login
* List current databases
* Create a new database
* Request deletion of a database

## To-do / further work

* **!** OAuth-based login
* Management of users/pass in Postgres (currently just the admin user and pass are accepted, values stored in pocketbase are not used)
* During creation step: Make UI move to next page right away instead of waiting for creation to complete for a more responsive experience
* Allow addition of 'viewers' to a DB
  * Owner can add or remove viewers
  * Viewers have full rights to the DB and can see their details

## Run the frontend

```bash
npm install # install dependencies
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes. You may also see any lint errors in the console.

## Run the pre-built PocketBase backend - no dependencies required (no connection to instance store DB)

```bash
./pocketbase/pocketbase serve
```

## Run the custom PocketBase backend - with connection to an Azure Postgres Flexible server

```bash
# in resource-portal/pocketbase directory
go run custom_pb.go serve
```

## Creating a Postgres Flexible Server on Azure to act as the main backend DB server

The below example uses Azure CLI to create a server quickly and easily. **The example below creates an incredibly insecure server, please be careful.**

```bash
# Create
az postgres flexible-server create \
                                   --admin-password admin \
                                   --admin-user admin \
                                   --location "East Asia" \
                                   --name "resourceportaldb" \
                                   --resource-group "your-resource-group"

# Delete
az postgres flexible-server delete --name "resourceportaldb" \
                                   --resource-group "your-resource-group" \
                                   --yes
```

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
