import React, { useState, useEffect } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [employeeId, setemployeeId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [height, setHeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://reactapi.bsite.net/api/Employee")
      .then((response) => {
        setUsers(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  const filteredUsers = users
    .sort((a, b) => {
      if (sortBy === "firstName") {
        return a.firstName.localeCompare(b.firstName);
      } else if (sortBy === "birthday") {
        return a.birthday - b.birthday;
      } else if (sortBy === "lastName") {
        return a.lastName.localeCompare(b.lastName);
      } else if (sortBy === "height") {
        return a.height - b.height;
      } else {
        return 0;
      }
    })
    .filter((user) => {
      const firstNameMatch = user.firstName
        .toLowerCase()
        .includes(firstName.toLowerCase());
      const secondNameMatch = user.lastName
        .toLowerCase()
        .includes(lastName.toLowerCase());
      const heightMatch = height ? user.height === parseInt(height) : true;
      return firstNameMatch && secondNameMatch && heightMatch;
    });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error.message}</div>;
  }

  return (
    <div>
      <div>
        <label htmlFor="name-filter">Имя:</label>
        <input
          type="text"
          id="firstName-filter"
          placeholder="Фильтр по имени"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="lastName-filter">Фамилия:</label>
        <input
          type="text"
          id="lastName-filter"
          placeholder="Фильтр по фамилии"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div></div>
      <div>
        <label htmlFor="height-filter">Рост:</label>
        <input
          type="number"
          id="height-filter"
          placeholder="Фильтр по росту"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="sort-by">Сортировать по:</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="firstName">Имени</option>
          <option value="lastName">Фамилии</option>
          <option value="height">Росту</option>
        </select>
      </div>
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>
            ID: {user.employeeId} <br />
            Имя: {user.firstName}
            <br />
            Фамилия: {user.lastName}
            <br />
            День рождения: {new Date(user.birthday).toLocaleDateString()}
            <br />
            Рост: {user.height}
            <br />
            <button>Удалить</button>
            <br />
            <button>Редактировать</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
