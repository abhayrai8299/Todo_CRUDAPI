import { useEffect, useState } from "react";
import './App.css'
import axios from "axios";

export default function App() {
  const [todo, setTodo] = useState([]);
  const [text, setText] = useState("");
  const [editid, setisEditid] = useState("");
  const [active, setactive] = useState(false);

  const Changehandler = (e) => {
    setText(e.target.value);
  };
  const postadd=async()=>{
      await axios
    .post("https://62e010f4fa8ed271c47dc10e.mockapi.io/task",{
      taskName:text,
    })
    .then(response=>console.log("Added",response))
    .catch((e) => {
      console.log(e);
    });
  };
  
  const postdelete=async(id)=>{
     await axios
    .delete(`https://62e010f4fa8ed271c47dc10e.mockapi.io/task/${id}`)
    .then(response=>console.log("Delete!!!",response))
    .catch((e) => {
      console.log(e);
    });
  }
  const updateApi=async(id)=>{
    await axios
   .put(`https://62e010f4fa8ed271c47dc10e.mockapi.io/task/${id}`,{
    taskName:text,
   })
   .then(response=>console.log("updated!!!",response))
   .catch((e) => {
     console.log(e);
   });
 }
  const addHandler = (e) => {
    e.preventDefault();
    if (text !== "") {
      if (editid !== "") {
        updateApi(editid);
        setTodo(
          todo.map((element) => {
            if (element.id === editid) {
              console.log(element);
              return { ...element, taskName: text };
            }
            return element;
          })
        );
        setisEditid("");
        setText("");
      } else {
        postadd();
        setTodo([...todo, { taskName: text, id: Math.random() * 10000 }]);
        setText("");
      }
    } else alert("Please add some Todo then add");

    setactive(false);
  };
  const deleteHandler = (id) => {
    console.log(id);
    setTodo(todo.filter((item) => item.id !== id));
    postdelete(id)
    if (editid !== "") {
      setText("");
    }
    setisEditid("");
    setactive(false);
  };
  const edit = (id) => {
    const data = todo.find((element) => {
      return element.id === id;
    });
    console.log(data);
    setText(data.taskName);
    setisEditid(id);
    setactive(true);
  };
  const clickHandler = () => {
    setText("");
    setisEditid("");
    setactive(false);
  };

  const fetchData = async () => {
    const response = await axios
      .get("https://62e010f4fa8ed271c47dc10e.mockapi.io/task")
      .catch((e) => {
        console.log(e);
      });
    setTodo(response.data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="App">
      <h2>Todo_Api</h2>
      <input type="text" onChange={Changehandler} value={text} />
      <button onClick={addHandler}>{!active ? "Add" : "Update"}</button>
      {active ? (
        <span className="cancelbtn" onClick={clickHandler}>
          Cancel
        </span>
      ) : (
        ""
      )}
      <>
        {todo.map((item) => {
          return (
            <li key={item.id}>
              <ul>
                {item.taskName}
                <button onClick={() => edit(item.id)}>Edit</button>
                <button onClick={() => deleteHandler(item.id)}>Delete</button>
              </ul>
            </li>
          );
        })}
      </>
    </div>
  );
}
