import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    personService.getAll().then((persons) => setPersons(persons));
  }, []);

  const findPersonByName = (name) =>
    persons.find((person) => person.name === name);

  const isPersonInPhoneBook = (name) => findPersonByName(name) !== undefined;

  const clearNewPersonForm = () => {
    setNewName("");
    setNewPhoneNumber("");
  };

  const showErrorMessage = (message) => {
    setNotificationMessage(message);
    setIsError(true);
    setTimeout(() => {
      setNotificationMessage(null);
      setIsError(false);
    }, 5000);
  };

  const showSuccessMessage = (message) => {
    setNotificationMessage(message);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  };

  const addNewPerson = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newPhoneNumber };

    if (isPersonInPhoneBook(newName)) {
      if (
        confirm(
          `${newName} is already in the phone book. Replace the old number with a new one?`
        )
      ) {
        const existingPerson = findPersonByName(newName);
        personService
          .update(existingPerson.id, newPerson)
          .then((person) => {
            setPersons((persons) =>
              persons.map((p) => (p.id !== person.id ? p : person))
            );
            showSuccessMessage(`${existingPerson.name} was updated`);
            clearNewPersonForm();
          })
          .catch((error) => {
            showErrorMessage(error.response.data.error);
          });
      }
    } else {
      personService
        .create(newPerson)
        .then((person) => {
          setPersons((persons) => persons.concat(person));
          showSuccessMessage(`${newPerson.name} was added to the phonebook`);
          clearNewPersonForm();
        })
        .catch((error) => {
          showErrorMessage(error.response.data.error);
        });
    }
  };

  const handleFilterInput = (event) => setNameFilter(event.target.value);

  const handleNameInput = (event) => setNewName(event.target.value);

  const handleNumberInput = (event) => setNewPhoneNumber(event.target.value);

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (confirm(`Delete ${person.name}?`)) {
      personService
        .deleteById(id)
        .then(() => setPersons((persons) => persons.filter((p) => p.id !== id)))
        .catch((err) => {
          setPersons((persons) => persons.filter((p) => p.id !== id));
          showErrorMessage(`${person.name} is already deleted`);
        });
    }
  };

  return (
    <div>
      <Notification message={notificationMessage} isError={isError} />
      <h2>Phonebook</h2>
      <Filter value={nameFilter} onChange={handleFilterInput} />
      <h3>add new</h3>
      <PersonForm
        name={newName}
        number={newPhoneNumber}
        onSubmit={addNewPerson}
        onNameChange={handleNameInput}
        onNumberChange={handleNumberInput}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        filter={nameFilter}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
