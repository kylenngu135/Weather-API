package middleware

import (
	"net/http"
	"sync"
	"time"
)

type RateLimiter struct {
	requests 	map[string][]time.Time
	mu 		 	sync.Mutex
	limit 		int // max requests
	window		time.Duration // time window
}

func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	return &RateLimiter{
		requests: make(map[string][]time.Time),
		limit: limit,
		window: window,
	}
}

func (rl *RateLimiter) Allow(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	cutoff := now.Add(-rl.window)

	// Get requests for this IP
	requests := rl.requests[ip]

    // Remove old requests outside the window
    validRequests := []time.Time{}
    for _, reqTime := range requests {
        if reqTime.After(cutoff) {
            validRequests = append(validRequests, reqTime)
        }
    }

    // Check if limit exceeded
    if len(validRequests) >= rl.limit {
        rl.requests[ip] = validRequests
        return false
    }

    // Add current request
    validRequests = append(validRequests, now)
    rl.requests[ip] = validRequests

    return true
}

func (rl *RateLimiter) Middleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        ip := r.RemoteAddr

        if !rl.Allow(ip) {
            http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
            return
        }

        next(w, r)
    }
}
