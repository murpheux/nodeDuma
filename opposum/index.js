const Opossum = require('opossum');

const fetchVitalData = async () => {
  // Your actual database operation goes here!
  // For demonstration purposes, simulate a random failure.
  if (Math.random() < 0.1) {
    throw new Error('Simulated database error');
  }
  return { vitalData: 'The answer to the ultimate question!' };
};

const circuitBreaker = new Opossum(fetchVitalData, {
  // Maximum failures before tripping the breaker
  failureThreshold: 3,
  // Time to wait before attempting a half-open state
  openTimeout: 5000,
  // Fallback function to provide graceful degradation
  fallback: () => {
    console.warn('Circuit breaker tripped! Returning cached data.');
    return { vitalData: 'Cached data, not quite as fresh, but better than nothing!' };
  },
});

async function getProtectedData() {
  try {
    return await circuitBreaker.fire();
  } catch (error) {
    console.error('An unrecoverable error occurred!', error);
    // Handle unexpected exceptions beyond the breaker's control
  }
}

(async () => {
  // Simulate multiple requests in rapid succession
  for (let i = 0; i < 10; i++) {
    const data = await getProtectedData();
    console.log(`Request ${i + 1}:`, data);
  }
})();