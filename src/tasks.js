export const statuses = [
  { id: 'pending', label: 'Pendiente' },
  { id: 'progress', label: 'En progreso' },
  { id: 'done', label: 'Completado' },
];

export function saveTask(tasks, draft) {
  const title = draft.title.trim();
  if (!title) throw new Error('Escribe un título para la tarea.');
  const task = { ...draft, title, description: draft.description.trim() };
  if (!task.id) return [...tasks, { ...task, id: crypto.randomUUID() }];
  return tasks.map((current) => current.id === task.id ? task : current);
}

export function moveTask(tasks, id, status) {
  return tasks.map((task) => task.id === id ? { ...task, status } : task);
}

export function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}
