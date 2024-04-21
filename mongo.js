const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument.');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://eetuH:${password}@cluster0.1iuqoqj.mongodb.net/
backend?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('Phonebook:');
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number,
  });
  person.save().then((result) => {
    console.log(`Added ${name} with number ${number} to the phonebook.`);
    mongoose.connection.close();
  });
} else {
  console.log('Invalid command. Please provide a valid command.');
  mongoose.connection.close();
}
