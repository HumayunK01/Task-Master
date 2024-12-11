document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    const todoForm = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const taskCount = document.getElementById('taskCount');
    const clearAll = document.getElementById('clearAll');

    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Update UI based on tasks
    const updateUI = () => {
        taskList.innerHTML = '';
        
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-content">
                    <label class="checkbox-container">
                        <input type="checkbox" ${task.completed ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        <span class="task-text">${task.text}</span>
                    </label>
                </div>
                <div class="task-actions">
                    <button class="delete-btn" data-index="${index}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            
            taskList.appendChild(li);
        });

        // Update empty state visibility
        emptyState.style.display = tasks.length === 0 ? 'block' : 'none';
        
        // Update task count
        const pendingTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${pendingTasks} task${pendingTasks !== 1 ? 's' : ''} pending`;
        
        // Save to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Add new task
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        
        if (taskText) {
            tasks.push({
                text: taskText,
                completed: false
            });
            
            taskInput.value = '';
            updateUI();
        }
    });

    // Handle task actions (complete/delete)
    taskList.addEventListener('click', (e) => {
        const target = e.target;
        
        // Handle checkbox clicks
        if (target.type === 'checkbox') {
            const taskItem = target.closest('.task-item');
            const index = Array.from(taskList.children).indexOf(taskItem);
            tasks[index].completed = target.checked;
            updateUI();
        }
        
        // Handle delete button clicks
        if (target.closest('.delete-btn')) {
            const index = target.closest('.delete-btn').dataset.index;
            tasks.splice(index, 1);
            updateUI();
        }
    });

    // Clear all tasks
    clearAll.addEventListener('click', () => {
        if (tasks.length > 0) {
            const confirmed = confirm('Are you sure you want to clear all tasks?');
            if (confirmed) {
                tasks = [];
                updateUI();
            }
        }
    });

    // Initial UI update
    updateUI();
}); 