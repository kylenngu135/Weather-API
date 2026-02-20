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

func GetWeather() (weather WeatherResponse, err error) {
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
	location := "Seattle,WA"
	baseURL := "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"
	fullURL := fmt.Sprintf("%s/%s?key=%s&unitGroup=us", baseURL, url.QueryEscape(location), apiKey)

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

	// get weather data from visual crossing
	resp, err := GetWeather()
	if err != nil {
		http.Error(w, "failed to retrieve data", http.StatusMethodNotAllowed)

		return
	}

	// write the response 
	json.NewEncoder(w).Encode(resp)

	return
}
