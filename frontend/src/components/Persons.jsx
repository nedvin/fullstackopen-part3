const Persons = ({ persons, filter, deletePerson }) => {
  const personsToShow =
    filter === ""
      ? persons
      : persons.filter((p) =>
          p.name.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <ul>
      {personsToShow.map((person) => (
        <li key={person.id}>
          {person.name} {person.number}{" "}
          <button onClick={() => deletePerson(person.id)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

export default Persons;
