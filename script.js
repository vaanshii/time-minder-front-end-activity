// * temp storage
const taskList = new Array();

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
		isComplete = false,
		id
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
	this.tag = "div";
	this.attributes = { class: "task-tile" };
	this.children = [
		{
			tag: "input",
			attributes: {
				type: "checkbox",
				class: "check-box",
				name: "Checkbox",
				id: `isComplete-${id}`,
				checked: isComplete,
			},
		},
		{
			tag: "p",
			attributes: { class: "task-info" },
			text: description,
		},
	];
}

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
}

function resetInputFields() {
	dateDeadlineInput.value = null;
	taskTitleInput.value = null;
	taskDescriptionInput.value = null;
	taskTypeInput.value = null;
	habitLinkInput.value = null;
	dateUntilInput.value = null;

	let dayChecked = document.querySelectorAll("input[type='checkbox']:checked");
	dayChecked.forEach((days) => {
		days.checked = false;
	});
}

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const task = createTask();
	addTaskToList(task);

	const taskTileElement = new TaskTile(
		task.isComplete,
		task.description,
		task.getId()
	);

	const listTile = createTileElement(taskTileElement);
	taskContainer.appendChild(listTile);

	const isCompletedChecker = document.getElementById(`isComplete-${task.id}`);
	isCompletedChecker.checked = task.isComplete;

	resetInputFields();
});
