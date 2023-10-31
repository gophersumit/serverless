package handler

import (
	"serverless/pkg/eventsapi"

	"github.com/gin-gonic/gin"
)

func InitHandlers(g *gin.Engine, intereactor eventsapi.IntereactorIface) {

	handler := Event{
		intereactor: intereactor,
	}

	v1 := g.Group("v1")

	v1.PUT("/events", handler.PutEvent)

}
