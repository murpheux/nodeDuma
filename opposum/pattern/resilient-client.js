import async from 'async'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import CircuitBreaker from 'opossum'

// retry configuration with axios-retry
axiosRetry(axios, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
})

const fetchDataWithRetry = async (url) => {
    try {
        const { data } = await axios.get(url)
        return data
    } catch (error) {
        console.error(
            'Failed to fetch data after retries',
            error.message,
        )
    }
}

// Circuit Breaker configuration
const breaker = new CircuitBreaker(fetchDataWithRetry, {
    timeout: 3000, // Max operation time
    errorThresholdPercentage: 50, // Failure threshold to "open" the circuit
    resetTimeout: 5000, // Time before attempting to "close" the circuit again
})

breaker.fallback(() => 'Service temporarily unavailable')

// Bulkhead configuration using async.queue to limit 5 simultaneous requests
const queue = async.queue(async ({ url }) => {
    try {
        const result = await breaker.fire(url)
        console.log(result)
    } catch (error) {
        console.error('Error fetching data:', error.message)
    }
}, 5)

// Function to fire multiple requests and observe Retry, Circuit Breaker, and Bulkhead in action
const fetchMultipleUrls = (urls) => {
    urls.forEach((url) => queue.push({ url }))
}

// Test URLs to simulate calls
fetchMultipleUrls(
    Array(6).fill('http://localhost:3001/unstable'),
)
