package weather

import (
	"encoding/json"
	"fmt"
	"github.com/joho/godotenv"
	"io"
	"net/http"
	"net/url"
	"os"
)

type WeatherResponse struct {
	ResolvedAddress string `json:"resolvedAddress"`
	Days            []Day  `json:"days"`
}

type Day struct {
	Datetime string  `json:"datetime"`
	TempMax  float64 `json:"tempmax"`
	TempMin  float64 `json:"tempmin"`
	Temp     float64 `json:"temp"`
	Humidity float64 `json:"humidity"`
}

func buildWeatherURL(location string, startDate string, endDate string, apiKey string) (path string) {
	baseURL := "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"

	// base + location
	path = fmt.Sprintf("%s/%s", baseURL, url.QueryEscape(location))

	// add dates if provided
	if startDate != "" {
		path += "/" + startDate
		if endDate != "" {
			path += "/" + endDate
		}
	}

	path += "?key=" + apiKey

	return path
}

// gets weather information from visualcrossing weather API based in Seattle, Washington
func GetWeather(location string, startDate string, endDate string) (weather WeatherResponse, err error) {
	// load environment variables
	err = godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
		return
	}

	// get API key from environment variables
	apiKey := os.Getenv("VISUAL_CROSSING_API_KEY")
	if apiKey == "" {
		fmt.Println("invalid API key")
		return
	}

	// create url
	fullURL := buildWeatherURL(location, startDate, endDate, apiKey)

	// make a request for weather data from visual crossing
	resp, err := http.Get(fullURL)
	if err != nil {
		fmt.Printf("Error making request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	// Check status code
	if resp.StatusCode != http.StatusOK {
		fmt.Printf("API returned status: %d\n", resp.StatusCode)
		err = fmt.Errorf("Bad status code: %v", resp.StatusCode)
		return
	}

	// read body contents
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\n", err)
		return
	}

	// extract desired data from body, store in weather
	err = json.Unmarshal(body, &weather)
	if err != nil {
		fmt.Printf("Error parsing JSON: %v\n", err)
		return
	}

	return
}

// Prints todays weather
func PrintWeather(weather WeatherResponse) {
	// prints weather data
	fmt.Printf("Weather for: %s\n", weather.ResolvedAddress)
	if len(weather.Days) > 0 {
		today := weather.Days[0]
		fmt.Printf("Date: %s\n", today.Datetime)
		fmt.Printf("Temperature: %.1f°F\n", today.Temp)
		fmt.Printf("High: %.1f°F, Low: %.1f°F\n", today.TempMax, today.TempMin)
	}
}

// handles api request to get weather
func HandleWeather(w http.ResponseWriter, r *http.Request) {
	// set header response to json
    w.Header().Set("Content-Type", "application/json")

	// initial check to establish connection
	if r.Method == "OPTIONS" {
		fmt.Println("Failed to establish connection")
		w.WriteHeader(http.StatusOK)
		return
	}

	// verify the method is a GET
	if r.Method != "GET" {
		fmt.Println("Method isn't a GET method")
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	location := r.URL.Query().Get("location")
	startDate := r.URL.Query().Get("startDate")
	endDate := r.URL.Query().Get("endDate")

	if location == "" {
		http.Error(w, "location is required", http.StatusBadRequest)
		return
	}

	if endDate != "" && startDate == "" {
		http.Error(w, "start date is required if end date exists", http.StatusBadRequest)
		return
	}

	// get weather data from visual crossing
	resp, err := GetWeather(location, startDate, endDate)

	if err != nil {
		http.Error(w, "failed to retrieve data", http.StatusMethodNotAllowed)

		return
	}

	// write the response 
	json.NewEncoder(w).Encode(resp)

	return
}
