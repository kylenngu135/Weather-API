package main

import (
	// standard library
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	// "log"

	// custom modules
	// "cheatsheet/middleware"
)

func main() {
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
