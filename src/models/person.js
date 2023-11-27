const mongoose = require("mongoose");

const url = process.env.MONGO_CONNECTION_STRING;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((connection) => console.log("connected to MongoDB"))
  .catch((err) => console.log("error when connecting to MongoDb"));

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
