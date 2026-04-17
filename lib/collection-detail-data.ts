export interface SkillVerifyItem {
    skill: string
    status: 'approved' | 'not-approved'
    response: string
    reason?: string
}

export interface Upload {
    name: string
    size: string
}

export interface CollectionDetail {
    id: string
    name: string
    skills: string[]
    date: string
    status: 'pending' | 'approved'
    description: string
    uploads: Upload[]
    skillVerify: SkillVerifyItem[]
}

export const collectionsDetailData: Record<string, CollectionDetail> = {
    '1': {
        id: '1',
        name: 'My Website',
        skills: ['Frontend', 'Backend'],
        date: '7/3/2026',
        status: 'pending',
        description: 'A full-stack website project showcasing frontend and backend development skills.',
        uploads: [
            { name: 'Readme.md', size: '20 MB' },
            { name: 'Archive.zip', size: '150.4 MB' }
        ],
        skillVerify: [
            { 
                skill: 'Frontend', 
                status: 'approved',
                response: 'Approve'
            },
            { 
                skill: 'Backend', 
                status: 'not-approved',
                response: 'Not Approve',
                reason: 'The backend service is not included in this submission. Please resubmit with both frontend and backend code to demonstrate full-stack expertise.'
            }
        ]
    },
    '2': {
        id: '2',
        name: 'My AI',
        skills: ['ML', 'Python'],
        date: '7/3/2026',
        status: 'pending',
        description: 'Machine learning project demonstrating AI and data science capabilities.',
        uploads: [
            { name: 'model.pkl', size: '45 MB' },
            { name: 'data.csv', size: '220 MB' }
        ],
        skillVerify: [
            { skill: 'ML', status: 'approved', response: 'Approve' },
            { skill: 'Python', status: 'approved', response: 'Approve' }
        ]
    },
    '3': {
        id: '3',
        name: 'My Website',
        skills: ['Frontend', 'Backend'],
        date: '7/3/2026',
        status: 'approved',
        description: 'A full-stack website project showcasing frontend and backend development skills.',
        uploads: [
            { name: 'Readme.md', size: '20 MB' },
            { name: 'Archive.zip', size: '150.4 MB' }
        ],
        skillVerify: [
            { skill: 'Frontend', status: 'approved', response: 'Approve' },
            { skill: 'Backend', status: 'approved', response: 'Approve' }
        ]
    },
    '4': {
        id: '4',
        name: 'My AI',
        skills: ['ML', 'Python'],
        date: '7/3/2026',
        status: 'approved',
        description: 'Machine learning project demonstrating AI and data science capabilities.',
        uploads: [
            { name: 'model.pkl', size: '45 MB' },
            { name: 'data.csv', size: '220 MB' }
        ],
        skillVerify: [
            { skill: 'ML', status: 'approved', response: 'Approve' },
            { skill: 'Python', status: 'approved', response: 'Approve' }
        ]
    }
}
