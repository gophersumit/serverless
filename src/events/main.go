package main

import (
	"context"
	"event-recol-project/middleware"
	"event-recol-project/pkg/eventsapi"
	"event-recol-project/src/events/handler"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-xray-sdk-go/xray"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"

	ginadapter "github.com/awslabs/aws-lambda-go-api-proxy/gin"
)

var ginLambda *ginadapter.GinLambda

const (
	EventsTable = "EventsTable"
)

func init() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	r.Use(middleware.DefaultStructuredLogger())
	r.Use(gin.Recovery())

	sess, err := session.NewSession()
	if err != nil {
		panic(err)
	}

	dynamoClient := dynamodb.New(sess)
	xray.AWS(dynamoClient.Client)

	eventsInteractor := eventsapi.Intereactor{
		DynamoClient: dynamoClient,
		Logger:       &log.Logger,
	}

	handler.InitHandlers(r, eventsInteractor)
	ginLambda = ginadapter.New(r)
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return ginLambda.ProxyWithContext(ctx, req)
}

func main() {
	lambda.Start(Handler)
}
