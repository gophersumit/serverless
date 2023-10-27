package handler

import (
	"event-recol-project/pkg/eventsapi"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Event struct {
	intereactor eventsapi.IntereactorIface
}

func (e Event) PutEvent(g *gin.Context) {

	g.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})

}
