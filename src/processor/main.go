package main

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handler(ctx context.Context, req events.SQSEvent) error {
	return nil
}

func main() {
	lambda.Start(Handler)
}
