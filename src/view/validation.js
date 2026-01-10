// taskValidation.js
export function validateTask(task, isUpdate = false) {
  const errors = [];

  // TITLE
  if (!isUpdate || task.title !== undefined) { // validate on create or if title is provided on update
    if (!task.title || task.title.trim() === "") {
      if (!isUpdate) errors.push("Title cannot be empty!"); // only required for create
    } else if (task.title.length < 3) {
      errors.push("Title is too short! Minimum 3 chars.");
    } else if (task.title.length > 100) {
      errors.push("Title is too long! Maximum 100 characters.");
    }
  }

  // DESCRIPTION
  if (task.description !== undefined && task.description.length > 500) {
    errors.push("Description cannot exceed 500 characters.");
  }

  // CATEGORY
  const validCategories = ["work", "personal", "study", "other"];
  if (!isUpdate || task.category !== undefined) {
    if (!task.category && !isUpdate) {
      errors.push("Category cannot be empty!"); // required on create
    } else if (task.category && !validCategories.includes(task.category)) {
      errors.push("Category must be work, personal, study, or other.");
    }
  }

  // PRIORITY
  if (!isUpdate || task.priority !== undefined) {
    if ((task.priority === "" || task.priority === null || isNaN(task.priority)) && !isUpdate) {
      errors.push("Priority cannot be empty!"); // required on create
    } else if (task.priority < 1) {
      errors.push("Priority too low! Minimum 1.");
    } else if (task.priority > 5) {
      errors.push("Priority too high! Maximum 5.");
    }
  }

  // PROJECT
  if (task.project !== undefined && task.project.length > 100) {
    errors.push("Project name cannot exceed 100 characters.");
  }

  // DEADLINE
  if (task.deadline !== undefined && isNaN(new Date(task.deadline))) {
    errors.push("Deadline must be a valid date.");
  }

  // COMPLETED
  if (task.completed !== undefined && typeof task.completed !== "boolean") {
    errors.push("Completed must be true or false.");
  }

  // For update, at least one field must be provided
  if (isUpdate && Object.keys(task).length === 0) {
    errors.push("You must update at least one field.");
  }

  return errors; // array of strings
}
