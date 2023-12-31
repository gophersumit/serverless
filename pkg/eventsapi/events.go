package eventsapi

import (
	"context"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/rs/zerolog"
)

type IntereactorIface interface {
	PutEvent(ctx context.Context, event PutEventInput) error
}

type PutEventInput struct {
	EventID    string            `json:"event_id,omitempty"`
	ConsumerID string            `json:"consumer_id,omitempty"`
	Data       map[string]string `json:"data,omitempty"`
}

type Intereactor struct {
	DynamoClient *dynamodb.DynamoDB
	Logger       *zerolog.Logger
	TableName    string
}

func (i Intereactor) PutEvent(ctx context.Context, event PutEventInput) error {
	// put event in dynamodb
	av, err := dynamodbattribute.MarshalMap(event)
	if err != nil {
		return err
	}

	input := &dynamodb.PutItemInput{
		Item:      av,
		TableName: aws.String(i.TableName),
	}

	_, err = i.DynamoClient.PutItemWithContext(ctx, input)
	if err != nil {
		return err
	}

	return nil

}
