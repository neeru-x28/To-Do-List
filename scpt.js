document.addEventListener('DOMContentLoaded', () => {


    const taskInput = document.getElementById('text-area');
    const taskForm = document.querySelector('.textarea');
    const taskList = document.getElementById('add-list');
    const emptyImage = document.querySelector('.empty-img');
    const todoContainer = document.querySelector('.todo-container');
    

    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');


    

    const toggleEmptyState = () => {

        if (taskList.children.length === 0) {

            emptyImage.style.display = 'flex';
            todoContainer.style.width = '50%';

        } else {

            emptyImage.style.display = 'none';
            todoContainer.style.width = '100%';

        }

    };


   

    let previousPercentage = 0;

    const updateProgress = () => {

        const totalTasks = taskList.children.length;

        const completedTasks =
            taskList.querySelectorAll('.checkbox:checked').length;


        const percentage = totalTasks > 0
            ? (completedTasks / totalTasks) * 100
            : 0;


        
        progressBar.style.width = `${percentage}%`;


        
        progressNumbers.textContent =
            `${Math.round(percentage)}%`;


        if (
            totalTasks > 0 &&
            percentage === 100 &&
            previousPercentage < 100
        ) {

            confetti({
                particleCount: 150,
                spread: 80,
                origin: {
                    y: 0.6
                }
            });

        }


        previousPercentage = percentage;

    };


    

    const saveTasksToLocalStorage = () => {

        const tasks =
            Array.from(
                taskList.querySelectorAll('li')
            ).map(li => ({

                text:
                    li.querySelector('span').textContent,

                completed:
                    li.querySelector('.checkbox').checked

            }));


        localStorage.setItem(
            'tasks',
            JSON.stringify(tasks)
        );

    };


   

    const addTask = (
        text = '',
        completed = false,
        save = true
    ) => {


        
        const taskText =
            text || taskInput.value.trim();


        
        if (!taskText) {
            return;
        }


        
        const li =
            document.createElement('li');


        
        li.innerHTML = `

            <input
                type="checkbox"
                class="checkbox"
                ${completed ? 'checked' : ''}
            >

            <span>${taskText}</span>

            <div class="task-buttons">

                <button
                    class="edit-btn"
                    type="button"
                >
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    class="delete-btn"
                    type="button"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

        `;


        

        const checkbox =
            li.querySelector('.checkbox');

        const editBtn =
            li.querySelector('.edit-btn');

        const deleteBtn =
            li.querySelector('.delete-btn');


        

        if (completed) {

            li.classList.add('completed');

            editBtn.disabled = true;

            editBtn.style.opacity = '0.5';

            editBtn.style.pointerEvents = 'none';

        }


       

        checkbox.addEventListener('change', () => {

            const isChecked =
                checkbox.checked;


           
            li.classList.toggle(
                'completed',
                isChecked
            );


            
            editBtn.disabled =
                isChecked;


            editBtn.style.opacity =
                isChecked ? '0.5' : '1';


            editBtn.style.pointerEvents =
                isChecked ? 'none' : 'auto';


            
            updateProgress();


            // Save changes
            saveTasksToLocalStorage();

        });


        

        editBtn.addEventListener('click', () => {

           
            if (checkbox.checked) {
                return;
            }


            
            taskInput.value =
                li.querySelector('span').textContent;
         
            li.remove();

            toggleEmptyState();
            updateProgress();


            
            taskInput.focus();

        });

        deleteBtn.addEventListener('click', () => {

            li.remove();


           
            toggleEmptyState();
            updateProgress();


            
            saveTasksToLocalStorage();

        });


        
        taskList.appendChild(li);


        
        taskInput.value = '';


        
        toggleEmptyState();
        updateProgress();

        if (save) {

            saveTasksToLocalStorage();

        }

    };


    

    const loadTasksFromLocalStorage = () => {

        const savedTasks =
            JSON.parse(
                localStorage.getItem('tasks')
            ) || [];


        savedTasks.forEach(
            ({ text, completed }) => {

                addTask(
                    text,
                    completed,
                    false
                );

            }
        );


        
        toggleEmptyState();
        updateProgress();

    };


    
    taskForm.addEventListener('submit', (e) => {

        
        e.preventDefault();

        addTask();

    });

    loadTasksFromLocalStorage();

});