require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

app.use(express.json());
app.use(express.static("static"));
app.use(cors());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan((tokens, req, res) => {
    const logTokens = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ];

    if (req.method === "POST") {
      logTokens.push(tokens.body(req, res));
    }

    return logTokens.join(" ");
  })
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => response.json(result));
});

app.post("/api/persons", (request, response) => {
  const { name, number } = { ...request.body };

  if (!name) {
    return response.status(400).json({ error: "name must exist" });
  }

  if (!number) {
    return response.status(400).json({ error: "number must exist" });
  }

  const person = new Person({ name, number });
  person.save().then((person) => response.status(201).json(person));
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (person === null) {
      return response.status(404).end();
    }

    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/info", (request, response) => {
  const numberOfPersons = persons.length;
  const time = new Date();

  response.send(`
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${time}</p>
    `);
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`app is now listening on port ${PORT}`));
