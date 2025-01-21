// For development purposes only (FDPO)
const userTemplate = {
    name: '',
    mail: '',
    password: '',
}

const contactTemplate = {
    name: '',
    mail: '',
    phone: 123,
    initials: '',
    color: ''
}

const taskTemplate = {
    state: '', // to-do, in-progress, await-feedback, done
    category: '', // User Story, Technical Task
    title: '',
    description: '',
    dueDate: '2023-05-10',
    assignedTo: [''],
    priority: '', // Medium, Urgent, Low
    subtasks: [
        {
            title: '',
            done: true
        },
        {
            title: '',
            done: false
        },]
}

const localContacts = [
    {
        name: 'Sabine Taylor',
        mail: 'sabine.taylor@gmail.com',
        phone: '+44 129299768',
        initials: 'ST',
        color: '--contact-color-blue'
    },
    {
        name: 'Julia Schneider',
        mail: 'julia.schneider@hotmail.com',
        phone: '+44 394938683',
        initials: 'JS',
        color: '--contact-color-honey'
    },
    {
        name: 'James Smith',
        mail: 'james.smith@gmail.com',
        phone: '+44 863041645',
        initials: 'JS',
        color: '--contact-color-purple'
    },
    {
        name: 'Hans R. Fischer',
        mail: 'hans.fischer@web.de',
        phone: '+49 489127574',
        initials: 'HF',
        color: '--contact-color-magenta'
    },
    {
        name: 'Claudia Müller',
        mail: 'claudia.mueller@gmail.com',
        phone: '+44 433822483',
        initials: 'CM',
        color: '--contact-color-orange'
    },
    {
        name: 'Sabine Weiß',
        mail: 'sabine.weiss@gmx.de',
        phone: '+44 974581499',
        initials: 'SW',
        color: '--contact-color-aqua'
    },
    {
        name: 'John Muriel Jones',
        mail: 'john.jones@gmail.com',
        phone: '+49 900968232',
        initials: 'JJ',
        color: '--contact-color-orange'
    },
    {
        name: 'Sophia Hoffmann',
        mail: 'sophia.hoffmann@t-online.com',
        phone: '+44 679425228',
        initials: 'SH',
        color: '--contact-color-lime'
    },
    {
        name: 'William James Wilson',
        mail: 'william.wilson@hotmail.com',
        phone: '+44 819344072',
        initials: 'WW',
        color: '--contact-color-gold'
    },
    {
        name: 'Laura Braun',
        mail: 'laura.braun@web.de',
        phone: '+49 587080993',
        initials: 'LB',
        color: '--contact-color-tropical'
    },
    {
        name: 'Hans Krüger',
        mail: 'hans.krueger@hotmail.com',
        phone: '+49 818561975',
        initials: 'HK',
        color: '--contact-color-aqua'
    },
    {
        name: 'Robert Peters',
        mail: 'robert.peters@gmx.de',
        phone: '+49 215846371',
        initials: 'RP',
        color: '--contact-color-magenta'
    },
    {
        name: 'Olivia Schäfer',
        mail: 'olivia.schaefer@gmail.com',
        phone: '+49 881904543',
        initials: 'OS',
        color: '--contact-color-blue'
    },
    {
        name: 'Rachel Johnson',
        mail: 'rachel.johnson@gmail.com',
        phone: '+44 954185406',
        initials: 'RJ',
        color: '--contact-color-pink'
    },
    {
        name: 'Sabine Lang',
        mail: 'sabine.lang@t-online.de',
        phone: '+49 472232639',
        initials: 'SL',
        color: '--contact-color-orange'
    }
];

const localTasks = [
    {
        state: 'to-do',
        category: 'User Story',
        title: 'Implement user login functionality',
        description: 'Create a secure login system where users can sign in using email and password.',
        dueDate: '2025-03-15',
        assignedTo: ['-OF7zRDEGJMgkJbSxfAh', '-OF7zRDI9PeHAsV0MusW'],
        priority: 'Urgent',
        subtasks: [
            { title: 'Design login page UI', done: false },
            { title: 'Set up authentication backend', done: false },
            { title: 'Connect frontend with backend API', done: false },
            { title: 'Implement error handling for login failures', done: false },
            { title: 'Test user login across devices', done: false }
        ]
    },
    {
        state: 'in-progress',
        category: 'Technical Task',
        title: 'Set up database schema',
        description: 'Design and implement a relational database schema for user profiles and messages.',
        dueDate: '2025-02-10',
        assignedTo: ['-OF7zRDOvz7zWWz41_J2', '-OF7zRDdXTMdMD99QL8f'],
        priority: 'Medium',
        subtasks: [
            { title: 'Design schema for user profiles', done: true },
            { title: 'Design schema for chat messages', done: false },
            { title: 'Implement tables using PostgreSQL', done: false },
            { title: 'Write initial database migration script', done: false }
        ]
    },
    {
        state: 'await-feedback',
        category: 'User Story',
        title: 'Enable file sharing in chat',
        description: 'Allow users to share files such as images and documents in their chat conversations.',
        dueDate: '2025-01-25',
        assignedTo: ['-OF7zRDVy9d5-KVowy0e', '-OF7zRD_QrD2t5BM4HJ_'],
        priority: 'urgent',
        subtasks: [
            { title: 'Build frontend UI for file upload', done: true },
            { title: 'Implement backend file storage service', done: true },
            { title: 'Set size and type restrictions for uploads', done: true },
            { title: 'Integrate real-time file sharing', done: false },
            { title: 'Test file sharing functionality', done: false }
        ]
    },
    {
        state: 'done',
        category: 'Technical Task',
        title: 'Set up CI/CD pipeline',
        description: 'Implement a CI/CD pipeline to automate builds and deployments for the Chat-App.',
        dueDate: '2025-01-15',
        assignedTo: ['-OF7zRDxTS4GfmZxG-Ba', '-OF7zRE841nuLb_NZr8S'],
        priority: 'Medium',
        subtasks: [
            { title: 'Set up GitHub Actions workflow', done: true },
            { title: 'Configure staging environment', done: true },
            { title: 'Automate unit and integration tests', done: true },
            { title: 'Automate production deployment', done: true }
        ]
    },
    {
        state: 'to-do',
        category: 'User Story',
        title: 'Implement typing indicator',
        description: 'Add real-time typing indicators to show when a user is typing in a conversation.',
        dueDate: '2025-04-20',
        assignedTo: ['-OF7zRE9TuMXGD3RAbbb', '-OF7zREDM0fbyL2xD84a'],
        priority: 'Low',
        subtasks: [
            { title: 'Design frontend for typing indicator', done: false },
            { title: 'Implement socket event for typing notification', done: false },
            { title: 'Update UI to display typing status', done: false },
            { title: 'Test typing indicators in group chats', done: false }
        ]
    }
];

const readOnly = {
    "contacts": {
        "-OF7zRDEGJMgkJbSxfAh": {
            "color": "--contact-color-blue",
            "initials": "ST",
            "mail": "sabine.taylor@gmail.com",
            "name": "Sabine Taylor",
            "phone": "+44 129299768"
        },
        "-OF7zRDI9PeHAsV0MusW": {
            "color": "--contact-color-honey",
            "initials": "JS",
            "mail": "julia.schneider@hotmail.com",
            "name": "Julia Schneider",
            "phone": "+44 394938683"
        },
        "-OF7zRDOvz7zWWz41_J2": {
            "color": "--contact-color-purple",
            "initials": "JS",
            "mail": "james.smith@gmail.com",
            "name": "James Smith",
            "phone": "+44 863041645"
        },
        "-OF7zRDVy9d5-KVowy0e": {
            "color": "--contact-color-orange",
            "initials": "JJ",
            "mail": "john.jones@gmail.com",
            "name": "John Muriel Jones",
            "phone": "+49 900968232"
        },
        "-OF7zRD_QrD2t5BM4HJ_": {
            "color": "--contact-color-orange",
            "initials": "CM",
            "mail": "claudia.mueller@gmail.com",
            "name": "Claudia Müller",
            "phone": "+44 433822483"
        },
        "-OF7zRDdXTMdMD99QL8f": {
            "color": "--contact-color-magenta",
            "initials": "HF",
            "mail": "hans.fischer@web.de",
            "name": "Hans R. Fischer",
            "phone": "+49 489127574"
        },
        "-OF7zRDilRYIFbaCQKkh": {
            "color": "--contact-color-aqua",
            "initials": "SW",
            "mail": "sabine.weiss@gmx.de",
            "name": "Sabine Weiß",
            "phone": "+44 974581499"
        },
        "-OF7zRDnvRnKQxP-Sagk": {
            "color": "--contact-color-tropical",
            "initials": "LB",
            "mail": "laura.braun@web.de",
            "name": "Laura Braun",
            "phone": "+49 587080993"
        },
        "-OF7zRDxTS4GfmZxG-Ba": {
            "color": "--contact-color-aqua",
            "initials": "HK",
            "mail": "hans.krueger@hotmail.com",
            "name": "Hans Krüger",
            "phone": "+49 818561975"
        },
        "-OF7zRE841nuLb_NZr8S": {
            "color": "--contact-color-magenta",
            "initials": "RP",
            "mail": "robert.peters@gmx.de",
            "name": "Robert Peters",
            "phone": "+49 215846371"
        },
        "-OF7zRE9TuMXGD3RAbbb": {
            "color": "--contact-color-blue",
            "initials": "OS",
            "mail": "olivia.schaefer@gmail.com",
            "name": "Olivia Schäfer",
            "phone": "+49 881904543"
        },
        "-OF7zREDM0fbyL2xD84a": {
            "color": "--contact-color-orange",
            "initials": "SL",
            "mail": "sabine.lang@t-online.de",
            "name": "Sabine Lang",
            "phone": "+49 472232639"
        },
        "-OF7zREEVWX5wxzCbFkV": {
            "color": "--contact-color-pink",
            "initials": "RJ",
            "mail": "rachel.johnson@gmail.com",
            "name": "Rachel Johnson",
            "phone": "+44 954185406"
        },
        "-OF7zREJS0RpNwScKuSY": {
            "color": "--contact-color-gold",
            "initials": "WW",
            "mail": "william.wilson@hotmail.com",
            "name": "William James Wilson",
            "phone": "+44 819344072"
        },
        "-OF7zREUrEc8thwNGJI4": {
            "color": "--contact-color-lime",
            "initials": "SH",
            "mail": "sophia.hoffmann@t-online.com",
            "name": "Sophia Hoffmann",
            "phone": "+44 679425228"
        }
    },
    "tasks": {
        "-OF80jmsw10REr51PhJN": {
            "assignedTo": [
                "-OF7zRDxTS4GfmZxG-Ba",
                "-OF7zRE841nuLb_NZr8S"
            ],
            "category": "Technical Task",
            "description": "Set up a CI/CD pipeline for automating builds and deployments. Include GitHub Actions, automated testing, and deployment scripts for staging and production. Ensure it provides feedback on build and deployment statuses.",
            "dueDate": "2025-01-15",
            "priority": "Medium",
            "state": "done",
            "subtasks": [
                {
                    "done": true,
                    "title": "Set up GitHub Actions workflow"
                },
                {
                    "done": true,
                    "title": "Configure staging environment"
                },
                {
                    "done": true,
                    "title": "Automate unit and integration tests"
                },
                {
                    "done": true,
                    "title": "Automate production deployment"
                }
            ],
            "title": "Set up CI/CD pipeline"
        },
        "-OF80jmxaIOMlDsVG3KJ": {
            "assignedTo": [
                "-OF7zRDOvz7zWWz41_J2",
                "-OF7zRDdXTMdMD99QL8f"
            ],
            "category": "Technical Task",
            "description": "Design and implement a relational database schema for user profiles and messages. Include relationships, security, and performance optimization for scalable data storage.",
            "dueDate": "2025-02-10",
            "priority": "Medium",
            "state": "in-progress",
            "subtasks": [
                {
                    "done": true,
                    "title": "Design schema for user profiles"
                },
                {
                    "done": false,
                    "title": "Design schema for chat messages"
                },
                {
                    "done": false,
                    "title": "Implement tables using PostgreSQL"
                },
                {
                    "done": false,
                    "title": "Write initial database migration script"
                }
            ],
            "title": "Set up database schema"
        },
        "-OF80jn0z1G4tcqk61Ze": {
            "assignedTo": [
                "-OF7zRDVy9d5-KVowy0e",
                "-OF7zRD_QrD2t5BM4HJ_"
            ],
            "category": "User Story",
            "description": "Enable users to share files in chat. Include a file upload interface, backend storage, and restrictions on file type and size. Ensure real-time sharing and reliable performance.",
            "dueDate": "2025-01-25",
            "priority": "Urgent",
            "state": "await-feedback",
            "subtasks": [
                {
                    "done": true,
                    "title": "Build frontend UI for file upload"
                },
                {
                    "done": true,
                    "title": "Implement backend file storage service"
                },
                {
                    "done": true,
                    "title": "Set size and type restrictions for uploads"
                },
                {
                    "done": false,
                    "title": "Integrate real-time file sharing"
                },
                {
                    "done": false,
                    "title": "Test file sharing functionality"
                }
            ],
            "title": "Enable file sharing in chat"
        },
        "-OF80jn76h36_p21jVei": {
            "assignedTo": [
                "-OF7zRE9TuMXGD3RAbbb",
                "-OF7zREDM0fbyL2xD84a"
            ],
            "category": "User Story",
            "description": "Add real-time typing indicators for conversations. Include a frontend design, socket events, and group chat support. Test for smooth performance under varying conditions.",
            "dueDate": "2025-04-20",
            "priority": "Low",
            "state": "to-do",
            "subtasks": [
                {
                    "done": false,
                    "title": "Design frontend for typing indicator"
                },
                {
                    "done": false,
                    "title": "Implement socket event for typing notification"
                },
                {
                    "done": false,
                    "title": "Update UI to display typing status"
                },
                {
                    "done": false,
                    "title": "Test typing indicators in group chats"
                }
            ],
            "title": "Implement typing indicator"
        },
        "-OF80jnAdSlHY3we2_ZI": {
            "assignedTo": [
                "-OF7zRDEGJMgkJbSxfAh",
                "-OF7zRDI9PeHAsV0MusW"
            ],
            "category": "User Story",
            "description": "Create a secure login system with encrypted passwords and protection against vulnerabilities. Ensure a user-friendly interface and robust error handling.",
            "dueDate": "2025-03-15",
            "priority": "Urgent",
            "state": "to-do",
            "subtasks": [
                {
                    "done": false,
                    "title": "Design login page UI"
                },
                {
                    "done": false,
                    "title": "Set up authentication backend"
                },
                {
                    "done": false,
                    "title": "Connect frontend with backend API"
                },
                {
                    "done": false,
                    "title": "Implement error handling for login failures"
                },
                {
                    "done": false,
                    "title": "Test user login across devices"
                }
            ],
            "title": "Implement user login functionality"
        }
    }
}
// FDPO end