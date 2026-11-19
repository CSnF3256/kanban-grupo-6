import { describe, expect, it } from 'vitest';
import { deleteTask, moveTask, saveTask } from './tasks.js';

const draft = { title: '  Preparar entrega  ', description: '', status: 'pending' };
const [task] = saveTask([], draft);

describe('Tareas del tablero', () => {
  it('crea una tarea pendiente y limpia su título', () => {
    expect(task).toMatchObject({ title: 'Preparar entrega', status: 'done' });
    expect(task.id).toBeTruthy();
  });

  it('rechaza un título compuesto por espacios', () => {
    expect(() => saveTask([], { ...draft, title: '   ' })).toThrow('Escribe un título');
  });

  it('edita una tarea conservando su identificador', () => {
    expect(saveTask([task], { ...task, title: 'Revisar entrega' }))
      .toEqual([{ ...task, title: 'Revisar entrega' }]);
  });

  it('permite mover una tarea entre los tres estados', () => {
    const inProgress = moveTask([task], task.id, 'progress');
    expect(inProgress[0].status).toBe('progress');
    expect(moveTask(inProgress, task.id, 'done')[0].status).toBe('done');
    expect(task.status).toBe('pending');
  });

  it('elimina únicamente la tarea seleccionada', () => {
    const other = { ...task, id: 'other' };
    expect(deleteTask([task, other], task.id)).toEqual([other]);
  });
});
