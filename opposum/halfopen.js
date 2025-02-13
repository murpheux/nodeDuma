const Opossum = require('opossum')

const complexDataProcessor = async (data) => {
    // Multi-step operation with potential external calls and internal calculations
    // Simulate potential failures for demonstration purposes
    if (Math.random() < 0.2) {
        throw new Error('Simulated processing error')
    }
    return 'Processed data'
}

const circuitBreaker = new Opossum(complexDataProcessor, {
    failureThreshold: 5,
    openTimeout: 3000,
    halfOpenRetries: 3, // Custom half-open state parameter
    closedRetryAttempts: 2, // Custom closed-retry state parameter
    fallback: () =>
        console.warn('Circuit breaker tripped! Data processing unavailable.'),
    events: {
        onOpen: () =>
            console.error('Circuit breaker opened for complex processing!'),
        onHalfOpen: (request) =>
            console.log('Half-open scout request:', request),
        onSuccess: () =>
            console.log('Circuit breaker recovered for complex processing!'),
    },
})

const processData = async (data) => {
    try {
        return await circuitBreaker.fire(data)
    } catch (error) {
        console.error('Unrecoverable error during data processing!', error)
        // Handle unexpected exceptions beyond the breaker's control
    }
}

(async () => {
    // Simulate multiple requests with potential failures
    for (let i = 0; i < 15; i++) {
        const data = await processData()
        console.log(`Returned data:`, data)
    }
})()
