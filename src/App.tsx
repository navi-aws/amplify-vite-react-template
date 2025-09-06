import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const { signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content && content.trim()) {
      client.models.Todo.create({ content: content.trim() });
    }
  }


  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh',
      background: '#4a148c',
      color: 'white'
    }}>
      <h1>My ToDo List</h1>
      <button onClick={createTodo}>+ New Task</button>
      <button onClick={signOut} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Sign out</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '5px 0',
            padding: '12px',
            backgroundColor: 'lightpink',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{ color: 'black', fontWeight: 'bold' }}>{todo.content}</span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                backgroundColor: 'lightsalmon',
                color: 'red',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

    </main>
  );
}

export default App;
