import { App, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, BillingMode, StreamViewType, Table, TableEncryption } from "aws-cdk-lib/aws-dynamodb";


export interface DynamoTableStackProps extends StackProps { }

export class DynamoTableStack extends Stack {
    readonly eventsTable: Table;

    constructor(app: App,id:string, props: DynamoTableStackProps) {
        super(app, id, props);

        this.eventsTable = new Table(this, "EventsTable", {
                tableName: "events_table",
            encryption: TableEncryption.AWS_MANAGED,
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST,
            partitionKey: {
                name: "event_id",
                type: AttributeType.STRING,
            },
            sortKey : {
                name: "consumer_id",
                type: AttributeType.STRING,
            },
            stream: StreamViewType.NEW_AND_OLD_IMAGES,
          
        });
    
    }
}