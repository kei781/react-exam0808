import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import TodoEdit from "./components/TodoEdit";
import TodoInsert from "./components/TodoInsert";
import TodoList from "./components/TodoList";
import TodoTemplate from "./components/TodoTemplate";

function App() {
  const [todos, setTodos] = useState([]);
  const [insertToggle, setInsertToggle] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // const nextId = useRef(4);

  const onInsert = (text) => {
    // const todo = {
    //   id: nextId.current,
    //   text: text,
    //   checked: false,
    // };
    /*작업내용, 쿼리는 실행되는데 text가 안전해지는듯?*/
    const onPost = async (text) => {
      try {
        const data = await axios({
          url: `http://localhost:4000/todos/`,
          method: "post",
          text: text,
        });
        //setTodos(data.data); /* .map 오류의 원흉;*/
      } catch (e) {
        setError(e);
      }
    };
    onPost(text);
    // setTodos((todos) => todos.concat(todo));
    // nextId.current++;
  };

  const onInsertToggle = () => {
    setInsertToggle((prev) => !prev);
  };
  /*안됨*/
  const onPatch = async (id, text) => {
    try {
      const data = await axios({
        url: `http://localhost:4000/todos/${id}`,
        method: "patch",
        text: { text },
        perform_date: Date.now(),
      });
      //setTodos(data.data);
    } catch (e) {
      setError(e);
    }
  };
  /*됨. todos.map is not a function에러뜸.*/
  const onRemove = async (id) => {
    /**/
    try {
      const data = await axios({
        url: `http://localhost:4000/todos/${id}`,
        method: "DELETE",
      });
      //console.log(data.data);
      //setTodos(data.data);
    } catch (e) {
      setError(e);
    }

    // setTodos((todos) => todos.filter((todo) => todo.id !== id));
  };

  const onToggle = async (id) => {
    try {
      const data = await axios({
        url: `http://localhost:4000/todos/check/${id}`,
        method: "PATCH",
      });
      setTodos(data.data);
    } catch (e) {
      setError(e);
    }
  };

  const onUpdate = (id, text) => {
    setTodos((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
    onInsertToggle();
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await axios({
          url: "http://localhost:4000/todos",
          method: "GET",
        });

        console.log(data.data);
        setTodos(data.data);
        setIsLoading(false);
        // throw new Error("조회중 에러발생!!");
        // await new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     resolve()
        //   }, 3000)
        // })
      } catch (e) {
        setError(e);
      }
    };

    getData();
  }, []);

  if (error) {
    return <>에러: {error.message}</>;
  }

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <TodoTemplate>
      <TodoInsert
        onInsert={onInsert} /*setError={setError} setTodos={setTodos}*/
      />
      <TodoList
        todos={todos}
        onRemove={onRemove}
        onToggle={onToggle}
        onInsertToggle={onInsertToggle}
        setSelectedTodo={setSelectedTodo}
      />
      {insertToggle && (
        <TodoEdit
          onInsertToggle={onInsertToggle}
          selectedTodo={selectedTodo}
          onUpdate={onUpdate}
          setTodos={setTodos}
          setError={setError}
          onPatch={onPatch}
        />
      )}
    </TodoTemplate>
  );
}

export default App;
