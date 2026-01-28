import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  // state to store the value from database
  const [people, setPeople] = useState([]);
  const [form, setForm] = useState({name:"", age:""});
  const [editId, setEditId] = useState(null);

  // read from database
  useEffect( () => {
    loadPeople();
  }, []);

  const loadPeople = async () => {
    const res = await axios.get(API);
    setPeople(res.data);
  };

  // create person
  const addPerson = async() => {
    if(!form.name || !form.age)
      return alert("Enter name and age!");
    const res = await axios.post(API, {name:form.name, age: Number(form.age)});
    setPeople([...people, res.data]);
    setForm({name:"", age:""});
  };

  // start edit function
  const startEdit = (p) => {
    setEditId(p._id);
    setForm({name: p.name, age: p.age});
  };

  // update person
  const updatePerson = async() => {
    const res = await axios.put(`${API}/${editId}`, form);
    setPeople(people.map(p => p._id === editId ? res.data : p));
    setEditId(null);
    setForm({name:"", age:""});
  };

  // delete person
  const deletePerson = async(id) => {
    await axios.delete(`${API}/${id}`);
    setPeople(people.filter(p => p._id !== id));
  };

  return (
    <div>
      <h3>MERN Stack CRUD - Application</h3>
      <input type="text" placeholder="Enter name" value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
      <input type="number" placeholder="Enter age" value={form.age} onChange={e => setForm({...form, age: e.target.value})}/>
      
      {editId ? (
        <button onClick={updatePerson}>Update</button>
      ) :(
        <button onClick={addPerson}>Add</button>
      )}

      <hr />
      {people.map(p => (
        <div key={p._id}>
          <b>{p.name}</b> - {p.age}
          <button onClick={() => startEdit(p)}>Edit</button>
          <button onClick={() => deletePerson(p._id)}>Delete</button>
        </div>
      ))}
    </div>


  );
}


export default App;
