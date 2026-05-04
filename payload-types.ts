// Cherchez la liste des types de collections et ajoutez 'projects'
export interface Config {
  collections: {
    users: User
    media: Media
    projects: Project // <--- Ajoutez cette ligne
    // ... reste des collections
  }
}

// Ajoutez une interface basique pour Project
export interface Project {
  id: string
  title?: string
  // ... ajoutez les champs minimums pour que TS ne râle pas
  updatedAt: string
  createdAt: string
}
