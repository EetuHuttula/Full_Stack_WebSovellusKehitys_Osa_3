const express = require('express')
const morgan = require("morgan")
const app = express()
const cors = require('cors')


app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

    let persons = [
        {   
            id: 1,
            name: "Arto Hellas", 
            number: '040-123456'
        },
        {  
            id: 2, 
            name: "Ada Lovelace", 
            number: '39-44-5323523'
        },
        { 
            id: 3, 
            name: "Dan Abramov", 
            number: '12-43-234345'
        },
        { 
          id: 4, 
          name: "Mary Poppendick", 
          number: '39-23-6423122'
      }
    ]  

      morgan.token('post-data', (request, response) => {
        return request.method === 'POST' ? JSON.stringify(request.body) : ''
    })
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))
    
    const requestLogger = (request, response, next) => {
      console.log("Method:", request.method)
      console.log("Path:", request.path)
      console.log("Body:", request.body)
      console.log("---")
      next()
    }
    
    app.use(requestLogger)


  

    const unknownEndpoint = (request, response, next) => {
      response.status(404).send({ error: 'unknown endpoint' })
    }
      
      app.get('/api/persons', (request, response) => {
        response.json(persons)
      })


      
      app.get('/info', (request, response, next) => {
        const currentTime = new Date();
        const numberOfPersons = persons.length;
        response.send(`<p>Phonebook has info for ${numberOfPersons} people</p><p>${currentTime}</p>`);
      });
      
      
      app.get('/api/persons/:id', (request, response, next) => {
        const id = Number(request.params.id)
        const person = persons.find(person =>  person.id === id)
          if (person) {
          response.json(person)
        } else {
          response.status(404).send({error: 'Person not Found'}) 
        }
      })
      app.delete('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
      })

      app.post('/api/persons', (request, response, next) => { 
        const body = request.body
  

        if (!body.number || !body.name) {
          return response.status(400).json({ 
            error: 'Name or number missing' 
          })
        }

        const existingPerson = persons.find(person => person.name === body.name);

        if (existingPerson) {
          return response.status(400).json({ error: 'Name must be unique' });
        }
      
        const person = {
          name: body.name,
          number: body.number,
          id: Math.floor(Math.random() * 10000),
        }

        response.json(person)
        console.log("uudelleen käynnistys")
      })

      app.use(unknownEndpoint)
      
    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })