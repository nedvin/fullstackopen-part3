const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
//app.use(morgan("tiny"));
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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  const min = Math.ceil(persons.length + 1);
  const max = Math.floor(99999);
  return Math.floor(Math.random() * (max - min) + min);
};

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  const { name, number } = { ...request.body };

  if (!name) {
    return response.status(400).json({ error: "name must exist" });
  }

  if (persons.find((person) => person.name === name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  if (!number) {
    return response.status(400).json({ error: "number must exist" });
  }

  const person = { name, number, id: generateId() };
  persons = persons.concat(person);

  response.status(201).json(person);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    return response.json(person);
  }

  response.status(404).end();
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

const PORT = 3001;
app.listen(PORT, () => console.log(`app is now listening on port ${PORT}`));
