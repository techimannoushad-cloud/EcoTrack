// ==========================================================================
// EcoTrack - Client-Side Habit Tracker
// ==========================================================================

// Initial set of starter habits designed for students
const defaultHabits = [
  { id: "1", text: "Used a reusable water bottle today", completed: false },
  { id: "2", text: "Turned off lights when leaving the room", completed: false },
  { id: "3", text: "Walked, biked, or carpooled", completed: false }
];

// In-memory habits state
let habits = [...defaultHabits];

// Feedback message timeout reference
let messageTimeout = null;

// ==========================================================================
// DOM Element References
// ==========================================================================
const habitList = document.getElementById("habitList");
const emptyState = document.getElementById("emptyState");
const addHabitForm = document.getElementById("addHabitForm");
const habitInput = document.getElementById("habitInput");
const feedbackMessage = document.getElementById("feedbackMessage");
const counterText = document.getElementById("counterText");
const percentageText = document.getElementById("percentageText");
const progressBarFill = document.getElementById("progressBarFill");
const progressBarContainer = document.getElementById("progressBarContainer");
const resetDayBtn = document.getElementById("resetDayBtn");

// ==========================================================================
// Core Functions
// ==========================================================================

/**
 * Recalculates stats and updates progress bar and completion counters.
 */
function updateDashboard() {
  const total = habits.length;
  const completed = habits.filter(habit => habit.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Update text counter and percentage label
  counterText.textContent = `${completed} of ${total} habit${total === 1 ? "" : "s"} completed`;
  percentageText.textContent = `${percentage}%`;

  // Update animated progress bar
  progressBarFill.style.width = `${percentage}%`;
  progressBarContainer.setAttribute("aria-valuenow", percentage);
}

/**
 * Re-renders the habit list in the DOM.
 */
function renderHabits() {
  // Clear existing items
  habitList.innerHTML = "";

  if (habits.length === 0) {
    emptyState.classList.add("active");
  } else {
    emptyState.classList.remove("active");

    habits.forEach(habit => {
      const li = document.createElement("li");
      li.className = `habit-item ${habit.completed ? "completed" : ""}`;
      li.setAttribute("data-id", habit.id);

      // Habit content wrapper (label and checkbox)
      const contentLabel = document.createElement("label");
      contentLabel.className = "habit-content";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "habit-checkbox";
      checkbox.checked = habit.completed;
      checkbox.setAttribute("aria-label", `Mark "${habit.text}" as done`);
      checkbox.addEventListener("change", () => toggleHabit(habit.id));

      const spanText = document.createElement("span");
      spanText.className = "habit-text";
      spanText.textContent = habit.text;

      contentLabel.appendChild(checkbox);
      contentLabel.appendChild(spanText);

      // Delete habit button
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.setAttribute("aria-label", `Delete "${habit.text}"`);
      deleteBtn.textContent = "✕";
      deleteBtn.addEventListener("click", () => deleteHabit(habit.id));

      li.appendChild(contentLabel);
      li.appendChild(deleteBtn);
      habitList.appendChild(li);
    });
  }

  updateDashboard();
}

/**
 * Displays temporary feedback messages (success or error).
 * @param {string} message - Text to display
 * @param {'success'|'error'} type - Message status
 */
function showFeedback(message, type = "success") {
  if (messageTimeout) {
    clearTimeout(messageTimeout);
  }

  feedbackMessage.textContent = message;
  feedbackMessage.className = `feedback-message ${type}`;

  // Automatically hide message after 3.5 seconds
  messageTimeout = setTimeout(() => {
    feedbackMessage.textContent = "";
    feedbackMessage.className = "feedback-message";
  }, 3500);
}

/**
 * Adds a new habit to the checklist.
 * @param {string} text - The habit description
 */
function addHabit(text) {
  const cleanText = text.trim();

  // Validation: Check for blank input
  if (!cleanText) {
    showFeedback("Please write a habit before adding it.", "error");
    habitInput.focus();
    return;
  }

  const newHabit = {
    id: Date.now().toString(),
    text: cleanText,
    completed: false
  };

  habits.push(newHabit);
  renderHabits();

  // Clear form and show success notification
  habitInput.value = "";
  showFeedback(`🌱 Great job! "${cleanText}" was added to your daily list.`, "success");
}

/**
 * Toggles a habit's completed status.
 * @param {string} id - The unique ID of the habit
 */
function toggleHabit(id) {
  habits = habits.map(habit => {
    if (habit.id === id) {
      return { ...habit, completed: !habit.completed };
    }
    return habit;
  });

  renderHabits();
}

/**
 * Removes a habit from the list.
 * @param {string} id - The unique ID of the habit
 */
function deleteHabit(id) {
  habits = habits.filter(habit => habit.id !== id);
  renderHabits();
}

/**
 * Resets the day by unchecking all habits without deleting them.
 */
function resetDay() {
  if (habits.length === 0) {
    showFeedback("There are no habits to reset.", "error");
    return;
  }

  habits = habits.map(habit => ({ ...habit, completed: false }));
  renderHabits();
  showFeedback("🔄 All habits reset for a fresh day! Good luck!", "success");
}

// ==========================================================================
// Event Listeners
// ==========================================================================

// Form submission handler
addHabitForm.addEventListener("submit", event => {
  event.preventDefault();
  addHabit(habitInput.value);
});

// Reset day button handler
resetDayBtn.addEventListener("click", resetDay);

// ==========================================================================
// Initialization
// ==========================================================================
renderHabits();
