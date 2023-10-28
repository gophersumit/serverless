import { GoFunction } from "@aws-cdk/aws-lambda-go-alpha";
import { App, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { eventNames } from "process";
import * as eventsources from 'aws-cdk-lib/aws-lambda-event-sources';
import { StartingPosition } from "aws-cdk-lib/aws-lambda";


export interface APIGWStackProps extends StackProps {
    stageName: string;
    eventsTable: Table;
}

export class APIGWStack extends Stack {
    readonly api: RestApi;

    constructor(app: App, id: string, props: APIGWStackProps) {
        super(app, id, props);

        const eventsLambda = new GoFunction(this, "EventsLambda", {
            entry: "src/events",
            environment : {
                TABLE_NAME: props.eventsTable.tableName,
            }
        });

        props.eventsTable.grantReadWriteData(eventsLambda);

        const streamLambda = new GoFunction(this, "StreamLambda", {
            entry: "src/stream",
            environment : {
                TABLE_NAME: props.eventsTable.tableName,
            }
        });

        props.eventsTable.grantStreamRead(streamLambda);
        
        streamLambda.addEventSource( new eventsources.DynamoEventSource(props.eventsTable, {
            startingPosition: StartingPosition.LATEST,
        }));

        const queue = new sq


        this.api = new RestApi(this, "EventsAPI", {
            deployOptions: {
                stageName: props.stageName,
                tracingEnabled: true,
            },

        });

        const v1 = this.api.root.addResource("v1");

        v1.addProxy({
            defaultIntegration: new LambdaIntegration(eventsLambda),
        });
    }
}
