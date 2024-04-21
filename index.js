const express = require('express');
require('dotenv').config();
const morgan = require('morgan');

const app = express();
const cors = require('cors');
const Person = require('./models/person');

app.use(express.json());
app.use(express.static('dist'));
app.use(cors());

morgan.token('post-data', (request, response) => (request.method === 'POST' ? JSON.stringify(request.body) : ''));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:', request.path);
  console.log('Body:', request.body);
  console.log('---');
  next();
};
app.use(requestLogger);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then((people) => {
      response.json(people);
    })
    .catch((error) => next(error));
});

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { body } = request;

  if (!body.number || !body.name) {
    return response.status(400).json({
      error: 'Name or number missing',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then((savedPerson) => {
      response.json(savedPerson);
      console.log('Lisää henkilö -lomake lähetetty');
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { runValidators: true, context: 'query' },
  ).then((updatedPerson) => {
    response.json(updatedPerson);
  })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
