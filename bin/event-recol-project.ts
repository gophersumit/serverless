#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynamoTableStack } from '../constructs/DynamoTable';
import { APIGWStack } from '../constructs/APIGW';


const app = new cdk.App();

const { eventsTable } = new DynamoTableStack(app, 'DynamoTableStack', {});

new APIGWStack(app, 'APIGWStack', {
  eventsTable: eventsTable,
  stageName: 'dev',
});

app.synth();