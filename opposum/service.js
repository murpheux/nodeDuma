import CircuitBreaker from 'opossum'
import axios from 'axios'

const getExternalData = async () => {
    const { data } = await axios.get(
        'https://api.example.com/data',
    )
    return data
}

const breaker = new CircuitBreaker(getExternalData, {
    timeout: 3000, // Max operation time
    errorThresholdPercentage: 50, // Failure threshold to "open" the circuit
    resetTimeout: 5000, // Time before attempting to "close" the circuit again
})

breaker.fallback(() => 'Service temporarily unavailable')

breaker.fire().then(console.log).catch(console.error)
