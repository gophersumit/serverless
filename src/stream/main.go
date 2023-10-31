// aws lambda triggered by dynamodb stream

package main

import (
	"context"
	"encoding/json"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sqs"
)

func Handler(ctx context.Context, req events.DynamoDBEvent) error {
	log.Printf("received:%v", req)

	queueUrl := os.Getenv("QUEUE_URL")
	log.Printf("queueUrl:%v", queueUrl)

	sess, err := session.NewSession()
	if err != nil {
		panic(err)
	}

	svc := sqs.New(sess)

	data, err := json.Marshal(req)
	if err != nil {
		panic(err)
	}

	s := string(data)

	_, err = svc.SendMessage(&sqs.SendMessageInput{
		MessageBody: &s,
		QueueUrl:    &queueUrl,
	})

	if err != nil {
		panic(err)
	}

	return nil

}

func main() {
	lambda.Start(Handler)
}
