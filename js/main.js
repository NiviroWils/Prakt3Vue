let app = new Vue({
    el: '#app',
    data(){
        return {
            newTask: {
                title: '',
                description: '',
                deadline: '',
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
    methods:{
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

            this.plannedTasks.push({...this.newTask});
            this.newTask = {
                title: '',
                description: '',
                deadline: '',
                createdAt: new Date().toLocaleString(),
                lastChange: null,
                tasks: []
            }
        },

    }
})
