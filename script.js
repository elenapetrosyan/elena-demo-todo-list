//test kuku
const addTaskButton = document.querySelector('.add-task-btn');
const newTaskInput = document.querySelector('.new-task-input');
const tasksRow = document.querySelector('.tasks-row');
const deleteSelectedButton = document.querySelector('.delete-selected-button');


initTasks();

const selectedTasks = new Set();

class Task {
    constructor(text) {
        this.text = text;
        this.id = Task.getUniqueId();
    }
    static getUniqueId() {
        return Math.random().toString(36) + Math.random().toString(36);
    }
}

function deleteTask(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    //console.log(taskElement);
    taskElement.remove();
    if (selectedTasks.has(taskId)) {
        selectedTasks.delete(taskId);
    };

    const tasks = getTasksFromStorage();

    //console.log('taskId', taskId);
    const foundTaskIndex = tasks.findIndex(task => task.id === taskId);
    tasks.splice(foundTaskIndex, 1);
    saveTasksToStorage(tasks);
}


function addNewTask() {
    const text = newTaskInput.value;
    if (!text) {
        return;
    }

    const task = new Task(text);
    newTaskInput.value = '';
    tasksRow.innerHTML += getTaskTemplate(task);

    const tasks = getTasksFromStorage();
    tasks.push(task);
    saveTasksToStorage(tasks);
}


newTaskInput.onkeydown = (event) => {
    if (event.code === 'Enter') {
        addNewTask();
    }
}


addTaskButton.onclick = () => {
    addNewTask();
};


deleteSelectedButton.onclick = () => {
    // console.log('selectedTasks before deleting', selectedTasks);
    selectedTasks.forEach((taskId) => {
        deleteTask(taskId);
    });
    selectedTasks.clear();
    // console.log('selectedTasks after deleting', selectedTasks);
};

function toggleTaskId(taskId) {
    if (selectedTasks.has(taskId)) {
        selectedTasks.delete(taskId);
    }
    else {
        selectedTasks.add(taskId);
    }
    //console.log('selectedTasks', selectedTasks);
}

function getTasksFromStorage() {
    const tasksStr = localStorage.getItem('tasks');
    if (!tasksStr) {
        return [];
    }
    const tasks = JSON.parse(tasksStr);
    return tasks;
}

function saveTasksToStorage(tasks) {
    const tasksStr = JSON.stringify(tasks);
    localStorage.setItem('tasks', tasksStr);
}


function getTaskTemplate(task) {
    const newTaskTemplate = `
    <div class="col-4 justify-content-center" data-task-id='${task.id}'>
                <div class="card task mt-3">
                    <div class="card-body">
                        <div class="first-line-of-card-body">
                            <div>
                                <h5 class="card-title">${task.text}</h5>
                            </div>
                        
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"  onclick="toggleTaskId('${task.id}')">
                            </div>
                        </div>

                        <button 
                        class="btn btn-success green-button float-end delete-task"
                        onclick="deleteTask('${task.id}')"
                        >
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

    return newTaskTemplate;
}

function initTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach((task) => {
        tasksRow.innerHTML += getTaskTemplate(task);
    });

}