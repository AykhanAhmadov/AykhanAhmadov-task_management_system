document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const title = document.querySelector(".title");
  const description = document.querySelector(".description");
  const date = document.querySelector(".date");
  const priority = document.querySelector(".priority");
  const taskList = document.querySelector(".task__list");
  const filterBtns = document.querySelectorAll(".task__filter-btns button");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let taskId = null;
  renderTasks();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newTask = {
      title: title.value,
      description: description.value,
      deadline: date.value,
      priority: priority.value,
      completed: false,
    };

    if (taskId) {
      const exists = tasks.findIndex((task) => task.id === taskId);
      if (exists !== -1) {
        tasks[exists] = { ...tasks[exists], ...newTask };
      }
      taskId = null;
    } else {
      newTask.id = Date.now();
      tasks.push(newTask);
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();

    form.reset();

    alert("Task Added Successfully")
  });

  function renderTasks(filter = "all") {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (filter === "active") {
      filteredTasks = tasks.filter((task) => !task.completed);
    } else if (filter === "completed") {
      filteredTasks = tasks.filter((task) => task.completed);
    } else if (filter === "overdue") {
      const today = new Date().toISOString().split("T")[0];
      filteredTasks = tasks.filter(
        (task) => task.deadline < today && !task.completed
      );
    } else if (filter === "priority") {
      filteredTasks = tasks.sort((a, b) => {
        const priorities = { low: 1, medium: 2, high: 3 };
        return priorities[b.priority] - priorities[a.priority];
      });
    }

    filteredTasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.classList.add(`priority__${task.priority}`);
      if (task.completed) taskItem.classList.add("completed");

      taskItem.innerHTML = `
                <div class="list__content">
                    <strong>${task.title}</strong> - ${task.description}
                    <br/> 
                   <strong>Deadline:</strong> ${task.deadline}
                </div>
                <div class="icon__btn">
                    <button class="complete__btn">${
                      task.completed ? "Completed" : "Complete"
                    }</button>
                    <i class="fa-solid fa-pen-to-square edit__btn"></i>
                    <i class="fa-solid fa-trash del__btn"></i>
                </div>
            `;

      taskItem.querySelector(".complete__btn").addEventListener("click", () => {
        console.log(tasks[index].title);
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      });

      taskItem.querySelector(".edit__btn").addEventListener("click", () => {
        taskId = task.id;
        title.value = tasks[index].title;
        description.value = tasks[index].description;
        date.value = tasks[index].deadline;
        priority.value = tasks[index].priority;
        window.scrollTo({
          top: 120,
        });
      });

      taskItem.querySelector(".del__btn").addEventListener("click", () => {
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
      });
      taskList.appendChild(taskItem);
    });
  }

  filterBtns.forEach((button) => {
    button.addEventListener("click", () => {
      filterBtns.forEach((btn) => btn.classList.remove("active__btn"));

      button.classList.add("active__btn");

      renderTasks(button.dataset.filter);
    });
  });
});
