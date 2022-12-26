import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const REGION = "us-east-1";
const ddbClient = new DynamoDBClient({ region: REGION });
import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

export function createDB() {
    const params = {
        AttributeDefinitions: [
        {
            AttributeName: "id", // ATTRIBUTE_NAME_2
            AttributeType: "N", // ATTRIBUTE_TYPE
        },
        ],
        KeySchema: [
        {
            AttributeName: "id", // ATTRIBUTE_NAME_1
            KeyType: "HASH",
        },
        ],
        ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10,
        },
        TableName: "TWEET_TABLE", // TABLE_NAME
        StreamSpecification: {
        StreamEnabled: false,
        },
    };

    const run = async () => {
        try {
        const data = await ddbClient.send(new CreateTableCommand(params));
        console.log("TABLE CREATED", data);
        return data;
        } catch (err) {
        console.log("Error", err);
        }
    };
    run();
}

const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: true, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
};

// Create the DynamoDB document client.
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions,
    unmarshallOptions,
});

export function putDB(params: any) {
    const runPut = async () => {
        try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
        } catch (err) {
        console.log("Error putting item in table", err.stack);
        }
    };
    runPut();
};