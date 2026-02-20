package main

import (
	// standard library
	"fmt"
	"log"
	"net/http"

	// custom modules
	"weather/api/weather"
	"weather/middleware"
)

func main() {
	// static server for hosting on localhost:8080
	fs_ui := http.FileServer(http.Dir("../ui"))
	fs_frontend := http.FileServer(http.Dir("../frontend"))
	http.Handle("/", fs_ui)
	http.Handle("/frontend/", http.StripPrefix("/frontend/", fs_frontend))

	// handle endpoints
	http.HandleFunc("/api/weather", weather.HandleWeather)

	// enable cors
	fmt.Println("Server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", middleware.EnableCORS(http.DefaultServeMux)))
}
