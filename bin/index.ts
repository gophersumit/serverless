#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynamoTableStack } from '../constructs/DynamoTable';
import { APIGWStack } from '../constructs/APIGW';

const usEnv  = { account: '594630718072', region: 'us-east-1' };

const app = new cdk.App();

const { eventsTable } = new DynamoTableStack(app, 'DynamoTableStack', {env: usEnv});

new APIGWStack(app, 'APIGWStack', {
  eventsTable: eventsTable,
  stageName: 'dev',
  env: usEnv, 
});

app.synth();