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

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((result) => response.json(result))
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const { name, number } = { ...request.body };

  if (!name) {
    return response.status(400).json({ error: "name must exist" });
  }

  if (!number) {
    return response.status(400).json({ error: "number must exist" });
  }

  const person = new Person({ name, number });
  person
    .save()
    .then((person) => response.status(201).json(person))
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person === null) {
        return response.status(404).end();
      }

      response.json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = { ...request.body };
  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  Person.find({})
    .then((result) => {
      const numberOfPersons = result.length;
      const time = new Date();
      response.send(`
      <p>Phonebook has info for ${numberOfPersons} people</p>
      <p>${time}</p>
      `);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`app is now listening on port ${PORT}`));
