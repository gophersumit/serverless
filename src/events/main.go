package main

import (
	"context"
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func WhatsMyIPHandler(ctx context.Context,
	e events.APIGatewayProxyRequest) (
	events.APIGatewayProxyResponse, error) {

	ip := e.RequestContext.Identity.SourceIP
	if ip == "" {
		return events.APIGatewayProxyResponse{
			StatusCode: 400,
			Body:       "Failed to determine IP",
		}, nil
	}

	body, _ := json.Marshal(struct {
		IP string `json:"ip"`
	}{
		IP: ip,
	})

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(body),
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
	}, nil
}

func main() {
	lambda.Start(WhatsMyIPHandler)
}
