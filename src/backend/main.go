package main

import (
	// standard library

	// custom modules
	"weather/weather"
	// "weather/middleware"
)

func main() {
	var resp weather.WeatherResponse = weather.GetWeather()
	weather.PrintWeather(resp)

	// static fileservers for hosting at localhost:8080

	// TODO: HTTP server
	/*
		fs_ui := http.FileServer(http.Dir("../ui"))
		fs_frontend := http.FileServer(http.Dir("../frontend"))
		http.Handle("/", fs_ui)
		http.Handle("/frontend/", http.StripPrefix("/frontend/", fs_frontend))
	*/

	/*
		http.HandleFunc("/api/cheatsheets", )
		http.HandleFunc("/api/files", )
		http.HandleFunc("/api/files/", )
	*/

	// TODO: Printing running on local host
	/*
		fmt.Println("Server running on http://localhost:8080")
		log.Fatal(http.ListenAndServe(":8080", middleware.EnableCORS(http.DefaultServeMux)))
	*/
}
