const apiUrl = "http://localhost:3000/api/tasks";

// 🔁 TOGGLE CLIENT-SIDE VALIDATION
const ENABLE_CLIENT_VALIDATION = false;

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");

let currentEditId = null;

/* =========================
   SERVER ERROR HANDLING
========================= */
function showServerErrors(err) {
  if (err.response && err.response.data) {
    const data = err.response.data;

    if (data.type === "validation" && Array.isArray(data.errors)) {
      alert("Server validation errors:\n\n" + data.errors.join("\n"));
      return;
    }

    if (data.error) {
      alert("Server error:\n\n" + data.error);
      return;
    }
  }

  alert("Unexpected server error. Check console.");
  console.error(err);
}

/* =========================
   CLIENT-SIDE VALIDATION
========================= */
function validateTaskClient(task) {
  const errors = [];

  // TITLE
  if (!task.title || task.title.trim() === "") {
    errors.push("Title is required.");
  } else if (task.title.length < 3) {
    errors.push("Title must be at least 3 characters long.");
  } else if (task.title.length > 100) {
    errors.push("Title cannot exceed 100 characters.");
  }

  // DESCRIPTION
  if (task.description && task.description.length > 500) {
    errors.push("Description cannot exceed 500 characters.");
  }

  // CATEGORY
  if (!task.category || task.category.trim() === "") {
    errors.push("Category is required.");
  }

  // PRIORITY
  if (
    task.priority === undefined ||
    task.priority === null ||
    isNaN(task.priority)
  ) {
    errors.push("Priority is required.");
  }

  // PROJECT
  if (task.project && task.project.length > 100) {
    errors.push("Project name cannot exceed 100 characters.");
  }

  // DEADLINE (optional)
  if (task.deadline && task.deadline.trim() !== "") {
    const deadlineDate = new Date(task.deadline);
    const today = new Date();

    deadlineDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (isNaN(deadlineDate.getTime())) {
      errors.push("Deadline must be a valid date.");
    } else if (deadlineDate < today) {
      errors.push("Deadline cannot be in the past.");
    }
  }

  return errors;
}

function runClientValidation(task) {
  if (!ENABLE_CLIENT_VALIDATION) return true;

  const errors = validateTaskClient(task);
  if (errors.length > 0) {
    alert("Client-side validation errors:\n\n" + errors.join("\n"));
    return false;
  }
  return true;
}

/* =========================
   INITIAL LOAD
========================= */
window.addEventListener("DOMContentLoaded", () => {
  getTasks();
  flatpickr("#deadline", { dateFormat: "Y-m-d", allowInput: true });
  flatpickr("#editDeadline", { dateFormat: "Y-m-d", allowInput: true });
  flatpickr("#filterDeadline", { dateFormat: "Y-m-d", allowInput: true });
});

/* =========================
   ADD TASK
========================= */
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const task = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    category: document.getElementById("category").value,
    priority: parseInt(document.getElementById("priority").value),
    project: document.getElementById("project").value.trim(),
    deadline: document.getElementById("deadline").value,
    completed: false,
  };

  if (!runClientValidation(task)) return;

  try {
    await axios.post(apiUrl, task);
    taskForm.reset();
    getTasks();
  } catch (err) {
    showServerErrors(err);
  }
});

/* =========================
   FETCH TASKS
========================= */
async function getTasks() {
  const params = {
    q: document.getElementById("searchQuery")?.value.trim() || undefined,
    category: document.getElementById("filterCategory")?.value || undefined,
    priority: document.getElementById("filterPriority")?.value || undefined,
    project:
      document.getElementById("filterProject")?.value.trim() || undefined,
    deadline: document.getElementById("filterDeadline")?.value || undefined,
    completed:
      document.getElementById("filterCompleted")?.value !== ""
        ? document.getElementById("filterCompleted")?.value === "true"
        : undefined,
    sortBy: document.getElementById("sortBy")?.value || "createdAt",
    order: document.getElementById("sortOrder")?.value || "desc",
  };

  const url = params.q ? `${apiUrl}/search` : apiUrl;

  try {
    const res = await axios.get(url, { params });
    renderTasks(res.data);
  } catch (err) {
    showServerErrors(err);
  }
}


/* =========================
   RENDER TASKS
========================= */
function renderTasks(tasks) {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex justify-content-between align-items-center" +
      (task.completed ? " list-group-item-success" : "");

    li.innerHTML = `
      <div>
        <h5 style="text-decoration:${task.completed ? "line-through" : "none"}">
          ${task.title} <span class="label label-${task.priority}">${
      task.priority
    }</span>
        </h5>
        <small class="text-muted">
          ${[
            task.description,
            task.category,
            task.project,
            task.deadline && new Date(task.deadline).toLocaleDateString(),
          ]
            .filter(Boolean)
            .join(" • ")}
        </small>
      </div>
      <div>
        <i class="fa-solid fa-check text-success me-2" onclick="toggleComplete('${
          task._id
        }', ${task.completed})"></i>
        <i class="fa-solid fa-pen-to-square text-primary me-2" onclick="editTask('${
          task._id
        }')"></i>
        <i class="fa-solid fa-trash text-danger" onclick="deleteTask('${
          task._id
        }')"></i>
      </div>
    `;
    taskList.appendChild(li);
  });
}

/* =========================
   DELETE / TOGGLE
========================= */
async function deleteTask(id) {
  try {
    await axios.delete(`${apiUrl}/${id}`);
    getTasks();
  } catch (err) {
    showServerErrors(err);
  }
}

async function toggleComplete(id, current) {
  try {
    await axios.put(`${apiUrl}/${id}`, { completed: !current });
    getTasks();
  } catch (err) {
    showServerErrors(err);
  }
}

/* =========================
   EDIT TASK
========================= */
async function editTask(id) {
  try {
    const res = await axios.get(`${apiUrl}/${id}`);
    const task = res.data;
    currentEditId = id;

    document.getElementById("editTitle").value = task.title;
    document.getElementById("editDescription").value = task.description || "";
    document.getElementById("editCategory").value = task.category;
    document.getElementById("editPriority").value = task.priority;
    document.getElementById("editProject").value = task.project || "";
    document
      .getElementById("editDeadline")
      ._flatpickr.setDate(task.deadline || "");

    editModal.style.display = "block";
  } catch (err) {
    showServerErrors(err);
  }
}

function closeEditModal() {
  editModal.style.display = "none";
}

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedTask = {
    title: document.getElementById("editTitle").value.trim(),
    description: document.getElementById("editDescription").value.trim(),
    category: document.getElementById("editCategory").value,
    priority: parseInt(document.getElementById("editPriority").value),
    project: document.getElementById("editProject").value.trim(),
    deadline: document.getElementById("editDeadline").value,
  };

  if (!runClientValidation(updatedTask)) return;

  try {
    await axios.put(`${apiUrl}/${currentEditId}`, updatedTask);
    closeEditModal();
    getTasks();
  } catch (err) {
    showServerErrors(err);
  }
});// Automatically fetch tasks when sorting options change
document.getElementById('sortBy').addEventListener('change', getTasks);
document.getElementById('sortOrder').addEventListener('change', getTasks);




