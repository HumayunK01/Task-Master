// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearAll = document.getElementById('clearAll');

// Hamburger Menu
hamburger?.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks?.classList.toggle('active');
});

// Todo List Functions
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function updateTaskCount() {
    const pendingTasks = tasks.length;
    taskCount.textContent = `${pendingTasks} task${pendingTasks !== 1 ? 's' : ''} pending`;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskCount();
}

function addTask(text) {
    if (text.trim() === '') return;

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);
    renderTask(task);
    saveTasks();
    taskInput.value = '';
}

function renderTask(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.className = 'task-item animate';

    li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
        </div>
        <button class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    `;

    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        li.querySelector('.task-text').classList.toggle('completed', task.completed);
        saveTasks();
    });

    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        li.classList.add('remove');
        li.addEventListener('animationend', () => {
            li.remove();
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
        });
    });

    taskList.appendChild(li);
}

// Event Listeners
addButton?.addEventListener('click', () => {
    addTask(taskInput.value);
});

taskInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask(taskInput.value);
    }
});

clearAll?.addEventListener('click', () => {
    taskList.innerHTML = '';
    tasks = [];
    saveTasks();
});

// Initial render
window.addEventListener('DOMContentLoaded', () => {
    tasks.forEach(task => renderTask(task));
    updateTaskCount();
});
