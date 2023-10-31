import { GoFunction } from "@aws-cdk/aws-lambda-go-alpha";
import { App, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import * as eventsources from 'aws-cdk-lib/aws-lambda-event-sources';
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';

export interface APIGWStackProps extends StackProps {
    stageName: string;
    eventsTable: Table;
}

export class APIGWStack extends Stack {
    readonly api: RestApi;

    constructor(app: App, id: string, props: APIGWStackProps) {
        super(app, id, props);

        const eventsLambda = new GoFunction(this, "EventsLambda", {
            functionName: "events-lambda",
            description: "events lambda listens from API Gateway and sends events to DynamoDB",
            entry: "src/events",
            environment: {
                TABLE_NAME: props.eventsTable.tableName,
            }
        });

        props.eventsTable.grantReadWriteData(eventsLambda);

        const queue = new sqs.Queue(this, 'MyQueue', {
            queueName: 'events-queue',
            visibilityTimeout: cdk.Duration.seconds(30),
        });


        const streamLambda = new GoFunction(this, "StreamLambda", {
            functionName: "stream-lambda",
            entry: "src/stream",
            environment: {
                QUEUE_URL: queue.queueUrl,
            }
        });

        queue.grantSendMessages(streamLambda);

        props.eventsTable.grantStreamRead(streamLambda);

        streamLambda.addEventSource(new eventsources.DynamoEventSource(props.eventsTable, {
            startingPosition: StartingPosition.LATEST,
        }));

        const processorLambda = new GoFunction(this, "ProcessorLambda", {
            functionName: "processor-lambda",
            description: "Processor Lambda processes events from the queue",
            entry: "src/processor",
            environment: {
                QUEUE_URL: queue.queueUrl,
            }
        });

        queue.grantConsumeMessages(processorLambda);




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
