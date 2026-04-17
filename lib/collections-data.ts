export interface Collection {
    id: string
    name: string
    skills: string
    date: string
    status: 'pending' | 'approved'
}

export const collections: Collection[] = [
    {
        id: '1',
        name: 'My Website',
        skills: 'Frontend, Backend',
        date: '7/3/2026',
        status: 'pending'
    },
    {
        id: '2',
        name: 'My AI',
        skills: 'ML',
        date: '7/3/2026',
        status: 'pending'
    },
    {
        id: '3',
        name: 'My Website',
        skills: 'Frontend, Backend',
        date: '7/3/2026',
        status: 'approved'
    },
    {
        id: '4',
        name: 'My AI',
        skills: 'ML',
        date: '7/3/2026',
        status: 'approved'
    }
]

export interface CollectionSection {
    status: 'pending' | 'approved'
    title: string
    badgeColor: string
    collections: Collection[]
}
