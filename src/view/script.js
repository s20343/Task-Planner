const apiUrl = "http://localhost:3000/api/tasks"; // backend URL
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// Edit modal elements
const editModal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");
let currentEditId = null;

// Load tasks on page load
window.addEventListener("DOMContentLoaded", getTasks);

// Add task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const task = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
    priority: parseInt(document.getElementById("priority").value),
    deadline: document.getElementById("deadline").value,
    project: document.getElementById("project").value,
    completed: false
  };
  await axios.post(apiUrl, task);
  taskForm.reset();
  getTasks();
});

// Fetch tasks
async function getTasks() {
  // Get filter values
  const q = document.getElementById("searchQuery")?.value;
  const category = document.getElementById("filterCategory")?.value;
  const priority = document.getElementById("filterPriority")?.value;
  const startDate = document.getElementById("startDate")?.value;
  const endDate = document.getElementById("endDate")?.value;
  const startDeadline = document.getElementById("startDeadline")?.value;
  const endDeadline = document.getElementById("endDeadline")?.value;

  // Build query params
  let params = {};
  if (q) params.q = q;
  if (category) params.category = category;
  if (priority) params.priority = priority;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  if (startDeadline) params.startDeadline = startDeadline;
  if (endDeadline) params.endDeadline = endDeadline;

  // Use the search endpoint when a free-text query is provided
  const url = q ? `${apiUrl}/search` : apiUrl;

  try {
    const res = await axios.get(url, { params });
    const tasks = res.data;

    taskList.innerHTML = "";

    tasks.forEach(task => {
      const li = document.createElement("li");
      li.className = "list-group-item" + (task.completed ? " list-group-item-success" : "");

      const completeIcon = task.completed
        ? `<i class="fa-solid fa-check-circle text-success me-2" style="cursor:pointer" onclick="toggleComplete('${task._id}', ${task.completed})" aria-label="mark incomplete"></i>`
        : `<i class="fa-regular fa-circle text-muted me-2" style="cursor:pointer" onclick="toggleComplete('${task._id}', ${task.completed})" aria-label="mark complete"></i>`;

      li.innerHTML = `
        <div class="task-info">
          <h5 style="text-decoration: ${task.completed ? 'line-through' : 'none'};">
            ${task.title}
            <span class="label label-${task.priority} ms-2">
              ${task.priority}
            </span>
          </h5>
          <p>
            ${task.description || ""} |
            ${task.category} |
            ${task.project || ""} |
            ${task.deadline ? new Date(task.deadline).toLocaleDateString() : ""}
          </p>
        </div>
        <div class="actions">
          ${completeIcon}
          <i class="fa-solid fa-pen" style="cursor:pointer" onclick="editTask('${task._id}')" aria-label="edit"></i>
          <i class="fa-solid fa-trash ms-2" style="cursor:pointer" onclick="deleteTask('${task._id}')" aria-label="delete"></i>
        </div>
      `;

      taskList.appendChild(li);
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
  }
}



// Delete task
async function deleteTask(id) {
  await axios.delete(`${apiUrl}/${id}`);
  getTasks();
}

// Toggle complete
async function toggleComplete(id, current) {
  await axios.put(`${apiUrl}/${id}`, { completed: !current });
  getTasks();
}

// Edit task
async function editTask(id) {
  currentEditId = id;
  const res = await axios.get(`${apiUrl}/${id}`);
  const task = res.data;

  document.getElementById("editTitle").value = task.title;
  document.getElementById("editDescription").value = task.description || "";
  document.getElementById("editCategory").value = task.category;
  document.getElementById("editPriority").value = task.priority;
  document.getElementById("editDeadline").value = task.deadline ? task.deadline.split("T")[0] : "";
  document.getElementById("editProject").value = task.project || "";

  editModal.style.display = "block";
}

// Close modal
function closeEditModal() {
  editModal.style.display = "none";
}

// Save edits
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await axios.put(`${apiUrl}/${currentEditId}`, {
    title: document.getElementById("editTitle").value,
    description: document.getElementById("editDescription").value,
    category: document.getElementById("editCategory").value,
    priority: parseInt(document.getElementById("editPriority").value),
    deadline: document.getElementById("editDeadline").value,
    project: document.getElementById("editProject").value,
  });
  closeEditModal();
  getTasks();
});
