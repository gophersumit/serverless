// aws lambda triggered by dynamodb stream

package main

import (
	"context"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handler(ctx context.Context, req events.DynamoDBEvent) error {
	log.Printf("received:%v",req)
	return nil
}

func main() {
	lambda.Start(Handler)
}
