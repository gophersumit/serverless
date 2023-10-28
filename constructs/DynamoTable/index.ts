import { App, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, BillingMode, StreamViewType, Table, TableEncryption } from "aws-cdk-lib/aws-dynamodb";


export interface DynamoTableStackProps extends StackProps { }

export class DynamoTableStack extends Stack {
    readonly eventsTable: Table;

    constructor(app: App,id:string, props: DynamoTableStackProps) {
        super(app, id, props);

        this.eventsTable = new Table(this, "EventsTable", {
            encryption: TableEncryption.AWS_MANAGED,
            removalPolicy: RemovalPolicy.RETAIN,
            billingMode: BillingMode.PAY_PER_REQUEST,
            partitionKey: {
                name: "event_id",
                type: AttributeType.STRING,
            },
            sortKey : {
                name: "consumer_id",
                type: AttributeType.STRING,
            },
            stream: StreamViewType.NEW_IMAGE,
          
        });

        
    }
}