// DOM elements
const todoForm = document.querySelector('#todo-form');
const todoList = document.querySelector('.todos');
const totalTasks = document.querySelector('#total-tasks');
const completedTasks = document.querySelector('#completed-tasks');
const remainingTasks = document.querySelector('#remaining-tasks');
const mainInput = document.querySelector('#todo-form input');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
// Render the tasks from the localstorage when the page refreshes
if(localStorage.getItem('tasks')){
    tasks.map((task) =>{
        createTask(task);
    });
} 

//Adding event listener 
todoForm.addEventListener('submit', (e)=>{
    e.preventDefault(); //prevent reload

    const inputValue = mainInput.value; // capturing input field value
    
    // exit this function if the value is blank
    if(inputValue == ''){
        return 
    }

    // This is executed when there is value in the input field
    // This makes each task an object
    const task = {
        id: new Date().getTime(), //time value elapsed since (pre-set date) in milliseconds
        name: inputValue,
        isCompleted: false
    }

    tasks.push(task);
    
    // localstorage only supports strings
    localStorage.setItem('tasks', JSON.stringify(tasks));

    createTask(task); // adds the task to the UI 
    
    todoForm.reset();
    mainInput.focus();
});


// Fetch the id of the clicked task in order to pass it to the removeTask() 
todoList.addEventListener('click', (e)=>{
    let className = document.getElementsByClassName("remove-task");
    const taskId = e.target.closest('li').id;
    // Multiple if conditoin because there are multiple elements a user could click on instead of the X
    if(e.target.classList.contains('remove-task') || e.target.parentElement.classList.contains('remove-task') || parentElement.parentElement.classList.contains('remove-task')){
        const taskId = e.target.closest('li').id;
        removeTask(taskId);
    }
});

todoList.addEventListener('keydown', (e)=>{
    if(e.keyCode == 13){
        e.preventDefault();
        e.target.blur();
    }
});

// Updating the task
todoList.addEventListener('input', (e) => {
    const taskId = e.target.closest('li').id
    updateTask(taskId, e.target);
});

function createTask(task){
    const taskEl = document.createElement('li');
    taskEl.setAttribute('id', task.id);

    if(task.isCompleted){
        taskEl.classList.add('complete');
    }

    const taskElMarkup = `
    <div>
    <input type="checkbox" name="tasks" id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
    <span ${!task.isCompleted ?  'contenteditable' : '' }>${task.name}</span>
    </div>
    <button title="Remove the "${task.name}" task" class="remove-task">
    <svg viewBox= "0 0 24 24" fill = "none">
        <path d = "M17.25 17.25L6.75 6.75" 
        stroke = "#A4D0E3" stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round" />
        <path d="M17.25 6.25L6.75 17.25"
        stroke="#A4D0E3" stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round" />
    </svg>
    </button>`;
    taskEl.innerHTML = taskElMarkup;
    // console.log(taskElMarkup);
    todoList.appendChild(taskEl);// adding it to UI
    countTasks(); //Displays tasks on the UI when the page is refresh or re-opened
    /*
        <div>
        <input type="checkbox" name="tasks" id="1">
        <span contenteditable="true">Task 1</span>
        </div>
        <button title="Remove task" class="remove-task">
        <svg viewBox= "0 0 24 24" fill = "none">
        <path d = "M17.25 17.25L6.75 6.75" 
        stroke = "#A4D0E3" stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round" />
        <path d="M17.25 6.25L6.75 17.25"
        stroke="#A4D0E3" stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round" />
        </svg>
        </button>
    */
}

function countTasks(){
    const completedTasksArray = tasks.filter((task) => task.isCompleted == true);
    totalTasks.textContent = tasks.length
    completedTasks.textContent = completedTasksArray.length;
    remainingTasks.textContent = tasks.length - completedTasksArray.length
}

// Remove task functtion
function removeTask(taskId){
    // Step 1:Remove it from the taskArray
    tasks = tasks.filter((task) => task.id == parseInt(taskId)); // adding all the tasks to the array except for the one with the fetched id in the if statement above (Click event)
    //Step 2: Update the local storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
    //Step 3: Remove it from the UI
    document.getElementById(taskId).remove();
    console.log('removeTask');
    countTasks();
}
// Update task function
function updateTask(taskId, el){
    // Iterating through every single items in the array
    const task = tasks.find((task)=> task.id == parseInt(taskId));
    
    if(el.hasAttribute('contenteditable')){
        task.name = el.textContent;
    }else{
        const span = el.nextElementSibling;
        const parent = el.closest('li');

        task.isCompleted = !task.isCompleted
        if(task.isCompleted){
            span.removeAttribute('contenteditable');
            parent.classList.add('complete');
        }else{
            span.setAttribute('contenteditable', 'true');
            parent.classList.remove('complete');
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));

    countTasks();
}