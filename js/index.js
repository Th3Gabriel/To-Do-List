let tasks = [
    { id: 1, description: "Comprar pão", checked: false },
    { id: 2, description: "Passear com o cachorro", checked: false },
    { id: 3, description: "Fazer o almoço", checked: false }
];

const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'));
    return localTasks ? localTasks : [] ;
}

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para remover uma tarefa da lista e do DOM
const removeTask = (taskId) => {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(({ id }) => parseInt(id) !== parseInt(taskId));
    setTasksInLocalStorage(updatedTasks);
    const taskElement = document.getElementById(`task-${taskId}`);
    if (taskElement) {
        document.getElementById('todo-list').removeChild(taskElement);
    }
};

const removeDoneTask = () => { 
    const tasks = getTasksFromLocalStorage();
    const taskstoremove = tasks
        .filter(({ checked }) => checked)
        .map(({ id }) => `task-${id}`);  // Corrige o ID da tarefa no DOM

    const updatedTasks =  tasks.filter(({ checked }) => !checked);
    setTasksInLocalStorage(updatedTasks);  // Atualiza o localStorage

    taskstoremove.forEach((taskId) => {
        const taskElement = document.getElementById(taskId);
        if (taskElement) {
            document.getElementById("todo-list").removeChild(taskElement);
        }
    });
};

const onCheckBoxClick = (event) => {
    const id = event.target.id.split('-')[0];
    const tasks = getTasksFromLocalStorage();

    const updatedTasks = tasks.map((task) => {
        if (parseInt(id) === parseInt(task.id)) {
            return { ...task, checked: event.target.checked };
        }
        return task;
    });

    setTasksInLocalStorage(updatedTasks);  // Atualiza o localStorage
}

// Função para criar o checkbox com label
const getCheckboxInput = ({ id, description, checked }) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId = `${id}-checkbox`;

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checked || false;
    checkbox.addEventListener('change', onCheckBoxClick);

    label.textContent = description;
    label.htmlFor = checkboxId;

    wrapper.className = 'checkbox-label-container';
    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    return wrapper;
};

// Função para criar um item de lista
function createTaskListItem(task, checkbox) {
    const li = document.createElement('li');
    li.id = `task-${task.id}`;
    li.appendChild(checkbox);

    const removeTaskButton = document.createElement('button');
    removeTaskButton.textContent = 'X';
    removeTaskButton.ariaLabel = 'Remover tarefa';
    removeTaskButton.onclick = () => removeTask(task.id);

    li.appendChild(removeTaskButton);
    document.querySelector('#todo-list').appendChild(li);
}

const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage();
    const lastId = tasks[tasks.length - 1]?.id;
    return lastId ? lastId + 1 : 1;
};

// Função para obter os dados de uma nova tarefa
const getNewTaskData = (event) => {
    const description = event.target.elements.description.value;
    const id = getNewTaskId();
    return { description, id };
};

// Função para criar uma nova tarefa
const CreateTask = (event) => {
    event.preventDefault();
    const NewTaskData = getNewTaskData(event);
    const { id, description } = NewTaskData;

    const checkbox = getCheckboxInput({ id, description, checked: false });

    const tasks = getTasksFromLocalStorage();
    tasks.push({ id, description, checked: false });
    setTasksInLocalStorage(tasks);  // Atualiza o localStorage
    createTaskListItem({ id, description, checked: false }, checkbox);

    event.target.elements.description.value = '';
};

// Função executada ao carregar a página
window.onload = function () {
    const form = document.getElementById('createToDoForm');
    form.addEventListener('submit', CreateTask);

    // Carrega as tarefas existentes ao inicializar
    const tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => {
        const checkbox = getCheckboxInput(task);
        createTaskListItem(task, checkbox);
    });
};
