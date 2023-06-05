import { Button, Container, Flex, Input, Item, Spacer } from "./styles";
import { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");
  const [listTask, setListTask] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3001/tasks");
      const data = await response.json();
      setListTask(data);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!task) return alert("Preencha uma tarefa");
    const newTask = {
      id: Math.random(),
      task: task,
      checked: false
    };
    try {
      await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
      });
      setListTask([...listTask, newTask]);
      setTask("");
    } catch (error) {
      console.log("Error adding task:", error);
    }
  };

  const removeTask = async (id) => {
    try {
      await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "DELETE"
      });
      const newList = listTask.filter((task) => task.id !== id);
      setListTask(newList);
    } catch (error) {
      console.log("Error removing task:", error);
    }
  };

  const toggleChecked = async (id, checked) => {
    const index = listTask.findIndex((task) => task.id === id);
    const updatedTask = { ...listTask[index], checked: !checked };
    try {
      await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTask)
      });
      const newList = [...listTask];
      newList[index].checked = !checked;
      setListTask(newList);
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  const filteredTasks = listTask.filter((task) =>
    task.task.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <h1 className="title">LISTA DE TAREFAS</h1>
      <Spacer />

      <Flex direction="row">
        <Input
          value={task}
          placeholder="Digite sua tarefa"
          onChange={(e) => setTask(e.target.value)}
        />
        <Button onClick={addTask}>Adicionar</Button>
      </Flex>
      <Spacer margin="16px" />

      <Input
        value={search}
        placeholder="Pesquisar tarefa"
        onChange={(e) => setSearch(e.target.value)}
      />
      <Spacer margin="16px" />

      <ul>
        {filteredTasks.map((task) => (
          <>
            <Item checked={task.checked} key={task.id}>
              <p>{task.task}</p>
              <Flex direction="row">
                <button onClick={() => toggleChecked(task.id, task.checked)}>
                  <i className="bx bx-check"></i>
                </button>
                <button onClick={() => removeTask(task.id)}>
                  <i className="bx bx-trash"></i>
                </button>
              </Flex>
            </Item>
            <Spacer margin="12px" />
          </>
        ))}
      </ul>
    </Container>
  );
}

export default App;
