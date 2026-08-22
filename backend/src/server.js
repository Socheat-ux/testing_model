import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import comparisonRouter from './routes/comparison.routes.js'

const app = express()
app.use(cors())
app.use(express.json())

// Mount comparison and health routes
app.use('/api', comparisonRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Backend proxy running on http://localhost:${PORT}`)
})
