import React, { useState, useEffect } from 'react';
import { format, isPast } from 'date-fns';
import classNames from 'classnames';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [filter, setFilter] = useState('All');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);

  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos'));
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (task.trim() === '') return;

    const newTodo = {
      id: Date.now(),
      text: task,
      dueDate,
      priority,
      completed: false,
    };

    if (isEditing) {
      setTodos(todos.map((todo) =>
        todo.id === currentTodo.id ? { ...newTodo, id: currentTodo.id } : todo
      ));
      setIsEditing(false);
      setCurrentTodo(null);
    } else {
      setTodos([...todos, newTodo]);
    }

    setTask('');
    setDueDate('');
    setPriority('Low');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (todo) => {
    setIsEditing(true);
    setTask(todo.text);
    setDueDate(todo.dueDate);
    setPriority(todo.priority);
    setCurrentTodo(todo);
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const filterTodos = () => {
    if (filter === 'All') return todos;
    return todos.filter((todo) =>
      filter === 'Completed' ? todo.completed : !todo.completed
    );
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div className="todo-input">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
        <button onClick={addTodo}>{isEditing ? 'Update Task' : 'Add Task'}</button>
      </div>
      <div className="todo-filters">
        <button onClick={() => setFilter('All')}>All</button>
        <button onClick={() => setFilter('Completed')}>Completed</button>
        <button onClick={() => setFilter('Incomplete')}>Incomplete</button>
      </div>
      <ul>
        {filterTodos().map((todo) => (
          <li key={todo.id} className={classNames({ completed: todo.completed })}>
            <div className="todo-details">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
              />
              <span>{todo.text}</span>
              {todo.dueDate && (
                <span
                  className={classNames('due-date', { overdue: isPast(new Date(todo.dueDate)) })}
                >
                  Due: {format(new Date(todo.dueDate), 'MM/dd/yyyy')}
                </span>
              )}
              <span className={`priority ${todo.priority.toLowerCase()}`}>
                {todo.priority} Priority
              </span>
            </div>
            <div className="todo-actions">
              <button onClick={() => editTodo(todo)}>Edit</button>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
