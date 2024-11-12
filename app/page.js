"use client";

import React, { useState, useEffect } from "react";

const Page = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [mainTask, setMainTask] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the task being edited

  // Load tasks from local storage when component mounts
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setMainTask(savedTasks);
    }
  }, []);

  // Update local storage whenever mainTask changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(mainTask));
  }, [mainTask]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (title.trim() === "" || desc.trim() === "") {
      alert("Please enter both a title and description.");
      return;
    }

    if (editIndex !== null) {
      // Update the existing task
      const updatedTasks = mainTask.map((task, index) =>
        index === editIndex ? { ...task, title, desc } : task
      );
      setMainTask(updatedTasks);
      setEditIndex(null); // Reset edit mode
    } else {
      // Add new task
      setMainTask([...mainTask, { title, desc, done: false }]);
    }

    setTitle("");
    setDesc("");
  };

  const editHandler = (i) => {
    const taskToEdit = mainTask[i];
    setTitle(taskToEdit.title);
    setDesc(taskToEdit.desc);
    setEditIndex(i);
  };

  const deleteHandler = (i) => {
    const updatedTasks = mainTask.filter((_, index) => index !== i);
    setMainTask(updatedTasks);
  };

  const markAsDoneHandler = (i) => {
    const updatedTasks = mainTask.map((task, index) =>
      index === i ? { ...task, done: !task.done } : task
    );
    setMainTask(updatedTasks);
  };

  return (
    <div className="bg-zinc-900 w-screen min-h-screen flex flex-col items-center">
      <h1 className="bg-zinc-700 text-center w-screen h-10 text-white font-bold text-3xl">
        Todo List
      </h1>
      <form
        onSubmit={submitHandler}
        className="w-1/4 bg-zinc-700 flex flex-col items-center mt-6 rounded-md p-5 gap-3"
      >
        <input
          type="text"
          placeholder="Title"
          className="px-9 py-1 text-lg outline-none text-zinc-950 rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="px-9 py-1 text-lg outline-none text-zinc-950 rounded-md"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button className="bg-green-500 px-10 py-2 text-black rounded-md mt-4 font-semibold">
          {editIndex !== null ? "Update Task" : "Create Task"}
        </button>
      </form>

      <div className="bg-zinc-800 w-full mt-10 p-6 text-white rounded-md">
        {mainTask.length > 0 ? (
          mainTask.map((t, i) => (
            <li
              key={i}
              className="flex justify-between items-center w-full p-2"
            >
              <h2 className={`text-xl ${t.done ? "line-through text-green-400" : "text-white"}`}>
                {t.title}
              </h2>
              <h2 className={`text-xl ${t.done ? "line-through text-green-400" : "text-white"}`}>
                {t.desc}
              </h2>
              <div className="flex gap-2">
                <button className="p-1" onClick={() => editHandler(i)}>
                  ✏️
                </button>
                <button
                  onClick={() => markAsDoneHandler(i)}
                  className="text-white rounded-md p-1"
                >
                  {t.done ? "Undo" : "✔️"}
                </button>
                <button
                  onClick={() => deleteHandler(i)}
                  className="rounded-md p-1"
                >
                  ❌
                </button>
              </div>
            </li>
          ))
        ) : (
          <h2>No tasks.</h2>
        )}
      </div>
    </div>
  );
};

export default Page;
