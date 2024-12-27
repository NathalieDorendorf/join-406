const userTemplate = {
    name: '',
    mail: '',
    password: '',
}

const contactTemplate = {
    name: '',
    mail: '',
    phone: number,
    initials: '',
    color: ''
}

const taskTemplate = {
    column: '', // to-do, in-progress, await-feedback, done
    category: '', // User Story, Technical Task
    title: '',
    description: '',
    dueDate: '2023-05-10',
    members: [{ contact },],
    priority: 'Medium', // Urgent, Low
    subtasks: [
        {
            title: 'Implement Recipe Recommendation',
            done: true
        },
        {
            title: 'Start Page Layout',
            done: false
        },]
}