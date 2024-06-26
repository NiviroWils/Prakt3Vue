let app = new Vue({
    el: '#app',
    data(){
        return {
            showAddModal: false,
            newTask: {
                title: '',
                description: '',
                deadline: '',
                solution:'',
                createdAt: new Date().toLocaleString(),
                lastChange: null,
                returnReason: null,
                isOverdue: false,
                tasks: [],
            },
            plannedTasks: [],
            inProgressTasks: [],
            testingTasks: [],
            completedTasks: [],
            editedTask: null,
            editedTaskIndex: null,
            editedColumn: null,
            taskReturnHistory: {},
        }
    },
    mounted() {
        if (localStorage.getItem('tasks')) {
            try {
                const tasks = JSON.parse(localStorage.getItem('tasks'));
                this.plannedTasks = tasks.plannedTasks || [];
                this.inProgressTasks = tasks.inProgressTasks || [];
                this.testingTasks = tasks.testingTasks || [];
                this.completedTasks = tasks.completedTasks || [];
                this.taskReturnHistory = tasks.taskReturnHistory || {};
            } catch (error) {
                console.error('Error parsing tasks from localStorage:', error);
            }
        }
    },
    methods:{
        openModal(){
            this.showAddModal = true
      },
        closeModal(){
    this.showAddModal = false
     },
        addNewTask() {
            if (!this.newTask.title) {
                alert('Укажите заголовок');
                return;
            }
            if (!this.newTask.description) {
                alert('Укажите описание');
                return;
            }
            if (!this.newTask.deadline) {
                alert('Укажите дэдлайн');
                return;
            }
            if (new Date(this.newTask.deadline) <= new Date(new Date().setDate(new Date().getDate()))) {
                alert('Некорректный дедлайн!(не раньше завтрашнего дня)');
                return;
            }
            if (this.newTask.tasks.length > 0) {
                this.newTask.tasks = this.newTask.tasks
                    .filter(task => task.trim() !== '')
                    .map(task => ({ name: task, completed: false }));
            }

            const taskId = Date.now(); // Уникальный идентификатор
            this.newTask.id = taskId;

            this.plannedTasks.push({ ...this.newTask });
            this.newTask = {
                title: '',
                description: '',
                deadline: '',
                createdAt: new Date().toLocaleString(),
                lastChange: null,
                tasks: [],
            };
            this.saveTasksToLocalStorage();
        },
        editForm(taskIndex) {
            this[this.editedColumn][taskIndex] = {...this.editedTask, lastChange: new Date().toLocaleString()};
            this.editedTask = null;
            this.editedTaskIndex = null;
            this.editedColumn = null;
            this.saveTasksToLocalStorage();
        },
        editTask(taskIndex, column) {
            this.editedTask = {...this[column][taskIndex]};
            this.editedTaskIndex = taskIndex;
            this.editedColumn = column;
            this.saveTasksToLocalStorage();
        },
        removeTask(taskIndex) {
            this.plannedTasks.splice(taskIndex, 1);
            this.saveTasksToLocalStorage();
        },
        moveToInProgress(taskIndex) {
            const taskToMove = this.plannedTasks.splice(taskIndex, 1)[0];
            this.inProgressTasks.push(taskToMove);
            this.saveTasksToLocalStorage();
        },
        saveEditedTask(taskIndex) {
            this[this.editedColumn][taskIndex] = { ...this.editedTask, lastChange: new Date().toLocaleString() };
            this.editedTask = null;
            this.editedTaskIndex = null;
            this.editedColumn = null;
            this.saveTasksToLocalStorage();
        },
        moveToTesting(taskIndex) {
            const task = this.testingTasks[taskIndex];
            const taskToMove = this.inProgressTasks.splice(taskIndex, 1)[0];
            this.testingTasks.push(taskToMove);

            const taskId = task.id;
            if (!task.solution) {
                alert('Укажите решение');

            }
            if (this.taskReturnHistory[taskId]) {
                this.taskReturnHistory[taskId].push(task.solution);
            } else {
                this.taskReturnHistory[taskId] = [task.solution];
            }
            this.saveTasksToLocalStorage();
        },
        moveToCompleted(taskIndex) {
            const taskToMove = this.testingTasks.splice(taskIndex, 1)[0];
            taskToMove.isOverdue = new Date(taskToMove.deadline) < new Date();
            this.completedTasks.push(taskToMove);
            this.saveTasksToLocalStorage();
        },
        returnToInProgress(taskIndex) {
            const task = this.testingTasks[taskIndex];
            if (!task.returnReason) {
                alert('Укажите причину возврата в работу');
                return;
            }

            const taskId = task.id;

            if (this.taskReturnHistory[taskId]) {
                this.taskReturnHistory[taskId].push(task.returnReason);
            } else {
                this.taskReturnHistory[taskId] = [task.returnReason];
            }

            const taskToMove = { ...task, lastChange: new Date().toLocaleString() };
            this.testingTasks.splice(taskIndex, 1);
            this.inProgressTasks.push(taskToMove);

            this.saveTasksToLocalStorage();
        },

        // returnSolution(){
        //     if (!task.returnSolution) {
        //         alert('Укажите решение');
        //     }
        //     const taskId = task.id;
        //     if (this.taskReturnHistory[taskId]) {
        //         this.taskReturnHistory[taskId].push(task.solution);
        //     } else {
        //         this.taskReturnHistory[taskId].push(task.solution);
        //     }
        //
        //     const taskToMove = { ...task, lastChange: new Date().toLocaleString() };
        //     this.testingTasks.splice(taskIndex, 1);
        //     this.inProgressTasks.push(taskToMove);
        //
        //     this.saveTasksToLocalStorage();
        // },
        saveTasksToLocalStorage() {
            const tasks = {
                plannedTasks: this.plannedTasks,
                inProgressTasks: this.inProgressTasks,
                testingTasks: this.testingTasks,
                completedTasks: this.completedTasks,
                taskReturnHistory: this.taskReturnHistory
            };
            this.closeModal();
            localStorage.setItem('tasks', JSON.stringify(tasks));
        },
    }
})
