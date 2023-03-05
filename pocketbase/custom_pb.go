package main

import (
	"context"
	"log"

	// pocketbase deps
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"

	// azure deps
	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/resourcemanager/postgresql/armpostgresqlflexibleservers"
)

const AZURE_SUBSCRIPTION = "your-subscription-id"
const AZURE_RG_NAME = "your-resource-group"
const AZURE_DB_SERVER_NAME = "resourceportaldb"

func main() {
	app := pocketbase.New()

	// Create Azure client
	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("failed to create Azure client: %v", err)
	}
	// Create Azure DB connection
	ctx := context.Background()
	client, err := armpostgresqlflexibleservers.NewDatabasesClient(AZURE_SUBSCRIPTION, cred, nil)
	if err != nil {
		log.Fatalf("failed to create client: %v", err)
	}

	// HOOK: After record creation, create the DB in the primary server
	app.OnRecordAfterCreateRequest().Add(func(e *core.RecordCreateEvent) error {
		if e.Record.Collection().Name != "instances" {
			return nil
		}

		// make the API call to create a DB
		poller, err := client.BeginCreate(ctx,
			AZURE_RG_NAME,
			AZURE_DB_SERVER_NAME,
			e.Record.GetString("dbName"),
			armpostgresqlflexibleservers.Database{
				Properties: &armpostgresqlflexibleservers.DatabaseProperties{
					Charset:   to.Ptr("utf8"),
					Collation: to.Ptr("en_US.utf8"),
				},
			},
			nil)
		if err != nil {
			log.Fatalf("failed to finish the request: %v", err)
		}
		res, err := poller.PollUntilDone(ctx, nil)
		if err != nil {
			log.Fatalf("failed to pull the result: %v", err)
		}
		log.Println(res)

		e.Record.Set("dbProvisioned", true)
		if err := app.Dao().SaveRecord(e.Record); err != nil {
			return err
		}

		// missing - create USER AND PASSWORD

		return nil
	})

	// HOOK: After update (e.g. mark for deletion), delete the DB from the primary server
	app.OnRecordAfterUpdateRequest().Add(func(e *core.RecordUpdateEvent) error {
		if e.Record.Collection().Name != "instances" {
			return nil
		}
		log.Println(e.Record.GetDateTime("deletionRequestDate"))
		if e.Record.GetDateTime("deletionRequestDate").IsZero() {
			return nil // don't do anything if deletionRequestDate isn't set
		}
		if e.Record.GetBool("dbDeleted") {
			return nil // don't do anything if db already marked as deleted
		}
		poller, err := client.BeginDelete(ctx,
			AZURE_RG_NAME,
			AZURE_DB_SERVER_NAME,
			e.Record.GetString("dbName"),
			nil)
		if err != nil {
			log.Fatalf("failed to finish the request: %v", err)
		}
		_, err = poller.PollUntilDone(ctx, nil)
		if err != nil {
			log.Fatalf("failed to pull the result: %v", err)
		}

		e.Record.Set("dbDeleted", true)
		if err := app.Dao().SaveRecord(e.Record); err != nil {
			return err
		}

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
