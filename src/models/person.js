const mongoose = require("mongoose");

const url = process.env.MONGO_CONNECTION_STRING;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((connection) => console.log("connected to MongoDB"))
  .catch((err) => console.log("error when connecting to MongoDb"));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: (number) => {
        return /^\d{2,3}-\d+$/.test(number) && number.length >= 9; // 8 digits, but don't count dash
      },
      message: (props) =>
        "Number should consist of two parts separated by - and consist of minimum 8 digits",
    },
  },
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
