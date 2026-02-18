package weather

import (
	"fmt"
	"net/http"
	"encoding/json"
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

func getWeather() {
	apiKey := os.Getenv("VISUAL_CROSSING_API_KEY")
	location := "Seattle,WA"

	baseURL := "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"
	fullURL := fmt.Sprintf("%s/%s?key=%s&unitGroup=us", baseURL, url.QueryEscape(location), apiKey)

	resp, err := http.Get(fullURL)

	if err != nil {
		fmt.Printf("Error making request: %v\n", err)
		return
	}
	defer resp.Body.Close()

	// Check status code
	if resp.StatusCode != http.StatusOK {
		fmt.Printf("API returned status: %d\n", resp.StatusCode)
		return
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error reading response: %v\n", err)
		return
	}

	var weather WeatherResponse
	err = json.Unmarshal(body, &weather)
	if err != nil {
		fmt.Printf("Error parsing JSON: %v\n", err)
		return
	}
}

func printWeather(weather WeatherResponse) {
    // Use the data
    fmt.Printf("Weather for: %s\n", weather.ResolvedAddress)
    if len(weather.Days) > 0 {
        today := weather.Days[0]
        fmt.Printf("Date: %s\n", today.Datetime)
        fmt.Printf("Temperature: %.1f°F\n", today.Temp)
        fmt.Printf("High: %.1f°F, Low: %.1f°F\n", today.TempMax, today.TempMin)
    }
}

func handleWeather(w http.ResponseWrtier, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	return 
}
