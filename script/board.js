// preliminary database

/**
 * possible task-categories: to-do, in-progress, await-feedback, done
 * possible subtasks.done: true, false
 */
const tasks = [
    {
        column: 'in-progress',
        category: 'User Story',
        title: 'Kochwelt Page & Recipe Recommender',
        description: 'Build start page with recipe recommendation',
        deadline: '2023-05-10',
        members: ['Emmanuel Mauer', 'Marcel Bauer', 'Anton Mayer'],
        priority: 'Medium',
        subtasks: [
            {
                title: 'Implement Recipe Recommendation',
                done: true
            },
            {
                title: 'Start Page Layout',
                done: false
            },]
    },
    {
        column: 'await-feedback',
        category: 'Technical Task',
        title: 'HTML Base Template Creation',
        description: 'Create reusable HTML base templates to avoid writing redundant code',
        deadline: '2023-06-04',
        members: ['Anton Mayer', 'David Eisenberg', 'Eva Fischer'],
        priority: 'Low',
        subtasks: []
    },
    {
        column: 'in-progress',
        category: 'Technical Task',
        title: 'CSS Architecture Planning',
        description: 'Define CSS naming conventions and structure.',
        deadline: '2023-09-23',
        members: ['Sofia Müller', 'Benedikt Ziegler'],
        priority: 'Urgent',
        subtasks: [
            {
                title: 'Establish CSS Methodology',
                done: true
            },
            {
                title: 'Setup Base Styles',
                done: true
            }
        ]
    }
]