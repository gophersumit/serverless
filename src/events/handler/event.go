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

	var event eventsapi.PutEventInput

	if err := g.ShouldBindJSON(&event); err != nil {
		g.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := e.intereactor.PutEvent(g, event); err != nil {
		g.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	g.JSON(http.StatusOK, gin.H{"message": "event created successfully"})

}
