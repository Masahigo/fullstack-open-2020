const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const parameters = process.argv.slice(2);
const password = parameters[0];

const dbname = 'phonebook-app';
const url = `mongodb+srv://higofullstack2020:${password}@cluster0.uaba3.mongodb.net/${dbname}?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

switch (parameters.length) {
  case 1: {
    // console.log('Get persons');
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    console.log('phonebook:');
    Person.find({}).then((result) => {
      result.forEach((person) => {
        console.log(`${person.name} ${person.number}`);
      });
      mongoose.connection.close();
    });

    break;
  }
  case 3: {
    // console.log('Add new person');
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });

    const person = new Person({
      name: parameters[1],
      number: parameters[2],
    });

    person.save().then(() => {
      console.log('person saved!');
      mongoose.connection.close();
    });

    break;
  }
  default: {
    console.log('Please provide the following arguments in the given order: \n node mongo.js <mongodbpassword> "<name>" <phonenumber>');
    process.exit(1);
  }
}
