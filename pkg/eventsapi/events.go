package eventsapi

import (
	"context"

	"github.com/aws/aws-sdk-go/service/dynamodb"
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
}

func (i Intereactor) PutEvent(ctx context.Context, event PutEventInput) error {
	return nil
}
