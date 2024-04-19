const express = require('express')
const app = express()

app.use(express.json())

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

    app.get('/', (request, response) => {
        response.send('<h1>Hello World!</h1>')
      })
      
      app.get('/api/persons', (request, response) => {
        response.json(persons)
      })


      
      app.get('/info', (request, response) => {
        const currentTime = new Date();
        const numberOfPersons = persons.length;
        response.send(`<p>Phonebook has info for ${numberOfPersons} people</p><p>${currentTime}</p>`);
      });
      
      
      app.get('/api/persons/:id', (request, response) => {
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

      app.post('/api/persons', (request, response) => { 
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

      const PORT = 3001
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })