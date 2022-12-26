import express from "express";
import dotenv from "dotenv";
import { getRequest } from "./recentsearch";
import { createDB, putDB } from "./table";

dotenv.config();

const port = process.env.SERVER_PORT; // default port to listen
const token = process.env.BEARER_TOKEN;
const app = express();

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );

// Creates DynamoDB table
createDB();

// Makes request fom Twitter API and puts in Dynamo
(async () => {
    try {
        // Make request
        const response = await getRequest(token);
        console.dir(response, {
            depth: null
        });

        const tweetData = JSON.parse(response);
        tweetData.forEach((tweet: any) => {
            const params = {
                TableName: "TWEET_TABLE",
                Item: {
                "text":  tweet.artist,
                "author_id": tweet.author_id,
                "created_at":  tweet.created_at,
                "edit_history_tweet_ids": tweet.edit_history_tweet_ids,
                "id": tweet.id
                }
            };
            // Push to Dynamo
            putDB(params);
        });
    }
        catch (e) {
            console.log(e);
            process.exit(-1);
        }
    process.exit();
})();

