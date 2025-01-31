import { useState } from "react";
import "../App.css";

const Timedata = () => {
  const [taskName, setTaskName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!taskName) {
      setErrorMessage("Please enter the task name.");
      return;
    }
    if (!startTime) {
      setErrorMessage("Please enter the start time.");
      return;
    }
    if (!endTime) {
      setErrorMessage("Please enter the end time.");
      return;
    }
    if (endTime <= startTime) {
      setErrorMessage("End time must be after start time.");
      return;
    }

    setErrorMessage("");
    const hoursWorked = calculateHoursWorked(startTime, endTime);

    if (editingTaskId) {
      const previousTask = tasks.find((task) => task.id === editingTaskId);
      const previousHours = previousTask.hoursWorked;

      setTotalHours((prevHours) => prevHours - previousHours + hoursWorked);

      const updatedTasks = tasks.map((task) =>
        task.id === editingTaskId
          ? { ...task, taskName, startTime, endTime, description, hoursWorked }
          : task
      );
      setTasks(updatedTasks);
      setEditingTaskId(null);
    } else {
      const newTask = {
        id: Date.now(),
        taskName,
        startTime,
        endTime,
        description,
        hoursWorked: hoursWorked >= 0 ? hoursWorked : 0,
      };
      setTasks([...tasks, newTask]);

      setTotalHours((prevHours) => prevHours + (hoursWorked >= 0 ? hoursWorked : 0));
    }

    resetForm();
  };

  const calculateHoursWorked = (start, end) => {
    const startTime = new Date(`2024-01-10T${start}:00`);
    const endTime = new Date(`2024-01-10T${end}:00`);
    const hours = (endTime - startTime) / (1000 * 60 * 60);
    return hours >= 0 ? hours : 0;
  };

  const confirmDeleteTask = (id) => {
    setConfirmDeleteId(id);
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    const hoursToSubtract = taskToDelete.hoursWorked;

    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);

    if (updatedTasks.length === 0) {
      setTotalHours(0); // Reset total hours if no tasks remain
    } else {
      setTotalHours((prevHours) => prevHours - hoursToSubtract);
    }

    setConfirmDeleteId(null);
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    setTaskName(taskToEdit.taskName);
    setStartTime(taskToEdit.startTime);
    setEndTime(taskToEdit.endTime);
    setDescription(taskToEdit.description);
    setEditingTaskId(id);
  };

  const resetForm = () => {
    setTaskName("");
    setStartTime("");
    setEndTime("");
    setDescription("");
  };

  return (
    <div className="App">
      <h1>Timesheet App</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Task Name*</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Time*</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Time*</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        
        <button type="submit">
          {editingTaskId ? "Update Task" : "Add Task"}
        </button>
      </form>

      <h3>Total Hours Worked: {totalHours.toFixed(2)}</h3>
      <h4>Total Tasks: {tasks.length}</h4>

      <ul>
        {tasks.map((task, index) => (
          <li key={task.id}>
            <h5>Task {index + 1}:</h5>
            <strong>{task.taskName}</strong> <br />
            Start Time: {task.startTime} | End Time: {task.endTime} <br />
            Hours Worked: {(task.hoursWorked || 0).toFixed(2)} <br />
            <button className="edit btn" onClick={() => editTask(task.id)}>Edit</button>
            <button className="del btn" onClick={() => confirmDeleteTask(task.id)}>Delete</button>
            
            {confirmDeleteId === task.id && (
              <div className="confirm-delete">
                <p>Are you sure you want to delete this task?</p>
                <button onClick={() => deleteTask(task.id)}>Yes</button>
                <button onClick={() => setConfirmDeleteId(null)}>No</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timedata;
