require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

app.post('/completions', async (req, res) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.apiKey}`
        },
        body: JSON.stringify({  
            model: "gpt-3.5-turbo",
            messages:[{role:"user", content: req.body.message}],
            max_tokens: 100,
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        
        const data = await response.json()
        res.send(data)
    } catch (error) {
        console.log(error)
    }
})


app.listen(8000, () => {
    console.log('Server is running on port 8000')
})