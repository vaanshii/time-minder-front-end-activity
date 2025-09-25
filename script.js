const STORAGE_KEY = "taskListData";

// * storage
const taskList = new Array();

const totalTaskCount = document.querySelector("#total-tasks");

// * form input ref
const form = document.querySelector(".form");
const dateDeadlineInput = document.getElementById("date-deadline");
const taskTitleInput = document.getElementById("task-title");
const taskDescriptionInput = document.getElementById("task-description");
const taskTypeInput = document.getElementById("task-type");
const habitLinkInput = document.getElementById("habit-link");
const repeatDayInput = document.querySelectorAll(`input[name="day"]`);
const dateUntilInput = document.getElementById("date-until");

// * task container ref
const taskContainer = document.querySelector(".tasks-container");

// * OBJECTS ----------------------------------------------------

// * Object for task data
class Task {
	constructor(
		deadline,
		title,
		description,
		type,
		habitLink,
		dayRepeat,
		untilDate,
		isComplete = false
	) {
		this.deadline = deadline;
		this.title = title;
		this.description = description;
		this.type = type;
		this.habitLink = habitLink;
		this.dayRepeat = dayRepeat;
		this.untilDate = untilDate;
		this.isComplete = isComplete;
		this.id = crypto.randomUUID();
	}

	setIsComplete(isComplete) {
		this.isComplete = isComplete;
	}

	getId() {
		return this.id;
	}

	printData() {
		console.log(this.deadline);
		console.log(this.title);
		console.log(this.description);
		console.log(this.type);
		console.log(this.isComplete);
	}
}

// * Object for creating element for task
function TaskTile(isComplete, description, id) {
	let taskDone = "";
	const checkboxAttributes = {
		type: "checkbox",
		class: "check-box",
		name: "Checkbox",
		id: `${id}`,
	};

	if (isComplete) {
		checkboxAttributes.checked = true;
		taskDone = "task-done";
	}

	this.tag = "div";
	this.attributes = { class: `task-tile ${taskDone}`, "data-id": id };
	this.children = [
		{
			tag: "input",
			attributes: checkboxAttributes,
		},
		{
			tag: "p",
			attributes: { class: "task-info" },
			text: description,
		},
	];
}

// * FUNCTIONS ----------------------------------------------------

// * for creating dom element

function createTileElement(obj) {
	const element = document.createElement(obj.tag);

	if (obj.attributes) {
		for (let [key, value] of Object.entries(obj.attributes)) {
			element.setAttribute(key, value);
		}
	}

	if (obj.text) {
		element.appendChild(document.createTextNode(obj.text));
	}

	if (obj.children) {
		obj.children.forEach((child) => {
			element.appendChild(createTileElement(child));
		});
	}

	return element;
}

function createTask() {
	const deadline = dateDeadlineInput.value;
	const title = taskTitleInput.value;
	const description = taskDescriptionInput.value;
	const type = taskTypeInput.value;
	const linkHabit = habitLinkInput.value;
	const until = dateUntilInput.value;
	const repeatedDays = [];

	let dayChecked = document.querySelectorAll("input[type='checkbox']:checked");

	dayChecked.forEach((days) => {
		repeatedDays.push(days.name);
	});

	return new Task(
		deadline,
		title,
		description,
		type,
		linkHabit,
		repeatedDays,
		until
	);
}

function addTaskToList(obj) {
	taskList.push(obj);

	saveTaskToLocal();
}

function resetInputFields() {
	dateDeadlineInput.value = null;
	taskTitleInput.value = null;
	taskDescriptionInput.value = null;
	dateUntilInput.value = null;

	let dayChecked = document.querySelectorAll("input[type='checkbox']:checked");
	dayChecked.forEach((days) => {
		days.checked = false;
	});
}

function saveTaskToLocal() {
	const taskListJSON = JSON.stringify(taskList);
	localStorage.setItem(STORAGE_KEY, taskListJSON);
}

function loadTasksFromLocal() {
	const taskListJSON = localStorage.getItem(STORAGE_KEY);

	if (taskListJSON) {
		const loadedTasks = JSON.parse(taskListJSON);

		loadedTasks.forEach((taskData) => {
			const taskInstance = new Task(
				taskData.deadline,
				taskData.title,
				taskData.description,
				taskData.type,
				taskData.habitLink,
				taskData.dayRepeat,
				taskData.untilDate,
				taskData.isComplete
			);

			taskInstance.id = taskData.id;
			taskList.push(taskInstance);

			totalTaskCount.textContent = taskList.length;
		});
	}
}

function renderTaskTile(task) {
	const taskTileElement = new TaskTile(
		task.isComplete,
		task.description,
		task.id
	);

	const listTile = createTileElement(taskTileElement);
	taskContainer.appendChild(listTile);
}

function loadAllTask() {
	taskList.forEach((task) => {
		renderTaskTile(task);
	});

	console.log(taskList);
}

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const task = createTask();
	addTaskToList(task);

	renderTaskTile(task);

	totalTaskCount.textContent = taskList.length.toString();

	console.log(`Succesfully created Task. ID ${task.id}`);
	console.log(taskList);

	resetInputFields();
});

taskContainer.addEventListener("change", (e) => {
	if (e.target.type === "checkbox" && e.target.name == "Checkbox") {
		const taskTile = e.target.closest(".task-tile");
		if (!taskTile) return;

		const taskId = taskTile.dataset.id;

		const task = taskList.find((t) => t.getId() === taskId);

		if (task) {
			task.setIsComplete(e.target.checked);

			console.log(`Task ID: ${taskId} updated to ${task.isComplete}`);

			if (e.target.checked) {
				taskTile.classList.add("task-done");
			} else {
				taskTile.classList.remove("task-done");
			}

			saveTaskToLocal();
		}
	}
});

loadTasksFromLocal();
loadAllTask();
