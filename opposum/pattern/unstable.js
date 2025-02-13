import express from 'express'

const app = express()
const PORT = 3001

// Simulate intermittent failures
app.get('/unstable', (req, res) => {
    const randomFail = Math.random() < 0.5 // 50% chance of failure
    const randomDelay = Math.floor(Math.random() * 4000) // Up to 4 seconds delay

    if (randomFail) {
        return res
            .status(500)
            .json({ error: 'Intermittent server error' })
    } else {
        setTimeout(() => {
            res.json({
                message: 'Request succeeded after delay',
            })
        }, randomDelay)
    }
})

app.listen(PORT, () => {
    console.log(
        `Service API running at http://localhost:${PORT}`,
    )
})
