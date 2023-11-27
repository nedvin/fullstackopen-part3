const mongoose = require("mongoose");

const generateId = () => {
  const min = 1;
  const max = Math.floor(99999);
  return Math.floor(Math.random() * (max - min) + min);
};

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://niemiedvin:${password}@cluster0.nsyskbl.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  console.log("phonebook");
  Person.find({}).then((result) => {
    result.forEach((person) => console.log(person.name, person.number));
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    id: generateId(),
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
