import { GoFunction } from "@aws-cdk/aws-lambda-go-alpha";
import { App, Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Table } from "aws-cdk-lib/aws-dynamodb";



export interface APIGWStackProps extends StackProps {
    stageName: string;
    eventsTable: Table;
}

export class APIGWStack extends Stack {
    readonly api: RestApi;

    constructor(app: App, id: string, props: APIGWStackProps) {
        super(app, id, props);

        const lambda = new GoFunction(this, "EventsLambda", {
            entry: "src/events",
        });

        props.eventsTable.grantReadWriteData(lambda);

        this.api = new RestApi(this, "EventsAPI", {
            deployOptions: {
                stageName: props.stageName,
                tracingEnabled: true,
            },

        });

        const v1 = this.api.root.addResource("v1");

        v1.addProxy({
            defaultIntegration: new LambdaIntegration(lambda),
        });
    }
}
