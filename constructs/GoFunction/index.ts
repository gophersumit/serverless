import * as lambda from "aws-cdk-lib/aws-lambda";
import * as golambda from "@aws-cdk/aws-lambda-go-alpha";
import { Construct } from "constructs";

export default class Function extends golambda.GoFunction {
  constructor(scope: Construct, id: string, props: golambda.GoFunctionProps) {
    props = {
      tracing: lambda.Tracing.ACTIVE,
      architecture: lambda.Architecture.ARM_64,
      insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_119_0,
      ...props,
    };
    super(scope, id, props);
  }
}
