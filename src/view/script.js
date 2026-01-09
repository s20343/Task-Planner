const apiUrl = "http://localhost:3000/api/tasks"; // backend URL
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// Edit modal elements
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
let currentEditId = null;

// Helper to display server errors
function showErrors(err) {
  if (err.response && err.response.data) {
    const data = err.response.data;

    // Validation errors from server
    if (data.type === "validation" && Array.isArray(data.errors)) {
      alert("Validation Errors:\n" + data.errors.join("\n"));
      return;
    }

    // Other server errors
    if (data.error) {
      alert("Server Error:\n" + data.error);
      return;
    }
  }

  // Fallback
  alert("An unexpected error occurred. Check console.");
  console.error(err);
}

// Load tasks on page load
window.addEventListener("DOMContentLoaded", () => {
  getTasks();

  // Initialize Flatpickr for deadline fields
  flatpickr("#deadline", { dateFormat: "Y-m-d", allowInput: true });
  flatpickr("#editDeadline", { dateFormat: "Y-m-d", allowInput: true });
  flatpickr("#filterDeadline", { dateFormat: "Y-m-d", allowInput: true });
});

// Add task
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
  try {
    await axios.post(apiUrl, task);
    taskForm.reset();
    getTasks();
  } catch (err) {
    showErrors(err);
  }
});

// Fetch tasks with filters
async function getTasks() {
  const q = document.getElementById("searchQuery")?.value.trim();
  const category = document.getElementById("filterCategory")?.value;
  const priority = document.getElementById("filterPriority")?.value;
  const project = document.getElementById("filterProject")?.value.trim();
  const deadline = document.getElementById("filterDeadline")?.value;
  const completed = document.getElementById("filterCompleted")?.value;

  let params = {};
  if (q) params.q = q;
  if (category) params.category = category;
  if (priority) params.priority = priority;
  if (project) params.project = project;
  if (deadline) params.deadline = deadline; // on or before filter
  if (completed) params.completed = completed === "true"; 

  const url = q ? `${apiUrl}/search` : apiUrl;

  try {
    const res = await axios.get(url, { params });
    const tasks = res.data;

    taskList.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center" + 
                     (task.completed ? " list-group-item-success" : "");

      const completeIcon = task.completed
        ? `<i class="fa-solid fa-check-circle text-success me-2" style="cursor:pointer" onclick="toggleComplete('${task._id}', ${task.completed})" aria-label="mark incomplete"></i>`
        : `<i class="fa-regular fa-circle text-muted me-2" style="cursor:pointer" onclick="toggleComplete('${task._id}', ${task.completed})" aria-label="mark complete"></i>`;

      const infoItems = [];
      if (task.description) infoItems.push(task.description);
      if (task.category) infoItems.push(task.category);
      if (task.project) infoItems.push(task.project);
      if (task.deadline) infoItems.push(new Date(task.deadline).toLocaleDateString());

      li.innerHTML = `
        <div class="task-info">
          <h5 class="mb-1" style="text-decoration: ${task.completed ? 'line-through' : 'none'};">
            ${task.title} <span class="label label-${task.priority} ms-2">${task.priority}</span>
          </h5>
          <p class="mb-0 text-muted">${infoItems.join(" • ")}</p>
        </div>
        <div class="actions">
          ${completeIcon}
          <i class="fa-solid fa-pen-to-square text-primary me-3" style="cursor:pointer" onclick="editTask('${task._id}')" aria-label="edit"></i>
          <i class="fa-solid fa-trash text-danger" style="cursor:pointer" onclick="deleteTask('${task._id}')" aria-label="delete"></i>
        </div>
      `;

      taskList.appendChild(li);
    });

  } catch (err) {
    showErrors(err);
  }
}

// Delete task
async function deleteTask(id) {
  try {
    await axios.delete(`${apiUrl}/${id}`);
    getTasks();
  } catch (err) {
    showErrors(err);
  }
}

// Toggle complete
async function toggleComplete(id, current) {
  try {
    await axios.put(`${apiUrl}/${id}`, { completed: !current });
    getTasks();
  } catch (err) {
    showErrors(err);
  }
}

// Edit task
async function editTask(id) {
  try {
    currentEditId = id;
    const res = await axios.get(`${apiUrl}/${id}`);
    const task = res.data;

    document.getElementById("editTitle").value = task.title;
    document.getElementById("editDescription").value = task.description || "";
    document.getElementById("editCategory").value = task.category;
    document.getElementById("editPriority").value = task.priority;
    document.getElementById("editProject").value = task.project || "";
    document.getElementById("editDeadline")._flatpickr.setDate(task.deadline || "");

    editModal.style.display = "block";
  } catch (err) {
    showErrors(err);
  }
}

// Close modal
function closeEditModal() {
  editModal.style.display = "none";
}

// Save edits
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await axios.put(`${apiUrl}/${currentEditId}`, {
      title: document.getElementById("editTitle").value.trim(),
      description: document.getElementById("editDescription").value.trim(),
      category: document.getElementById("editCategory").value,
      priority: parseInt(document.getElementById("editPriority").value),
      project: document.getElementById("editProject").value.trim(),
      deadline: document.getElementById("editDeadline").value,
    });
    closeEditModal();
    getTasks();
  } catch (err) {
    showErrors(err);
  }
});
