import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { deleteTask, moveTask, saveTask, statuses } from './tasks.js';
import './styles.css';

const storageKey = 'kanban-grupo-6';
const emptyDraft = { title: '', description: '', status: 'pending' };

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [draft, setDraft] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [storageError, setStorageError] = useState(false);
  const query = search.trim().toLocaleLowerCase('es');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    } catch {
      setStorageError(true);
    }
  }, [tasks]);

  function openEditor(task) {
    setError('');
    setDraft(task);
  }

  function submit(event) {
    event.preventDefault();
    try {
      setTasks(saveTask(tasks, draft));
      setDraft(null);
    } catch (failure) {
      setError(failure.message);
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="brand"><span className="mark" aria-hidden="true">▥</span> Kanban</div>
        <span>Grupo 6</span>
      </header>
      <main>
        <div className="heading">
          <div>
            <h1>Tablero de tareas</h1>
            <p>Organiza el trabajo del equipo en tres estados.</p>
          </div>
          <button className="primary" onClick={() => openEditor(emptyDraft)}>+ Nueva tarea</button>
        </div>
        {storageError && <p role="alert">El navegador no pudo guardar los cambios.</p>}
        {draft && (
          <form className="editor" onSubmit={submit}>
            <h2>{draft.id ? 'Editar tarea' : 'Nueva tarea'}</h2>
            <label>Título
              <input autoFocus required maxLength={100} value={draft.title}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
            </label>
            <label>Descripción
              <textarea rows={3} maxLength={1000} value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
            </label>
            <label>Estado
              <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
                {statuses.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
              </select>
            </label>
            {error && <p role="alert">{error}</p>}
            <div className="actions">
              <button type="button" onClick={() => setDraft(null)}>Cancelar</button>
              <button className="primary" type="submit">Guardar tarea</button>
            </div>
          </form>
        )}
        <p className="summary" role="status">
          {tasks.filter((task) => task.status === 'done').length} de {tasks.length} tareas completadas
        </p>
        <div className="board-tools">
          <label>
            Buscar tareas
            <input type="search" placeholder="Título o descripción" value={search}
              onChange={(event) => setSearch(event.target.value)} />
          </label>
        </div>
        <div className="board">
          {statuses.map(({ id, label }) => {
            const columnTasks = tasks.filter((task) => task.status === id);
            const visibleTasks = columnTasks.filter(({ title, description }) =>
              [title, description].some((value) => value.toLocaleLowerCase('es').includes(query)));
            return (
              <section key={id} className={`column ${id}`} aria-labelledby={`column-${id}`}>
                <div className="column-header">
                  <h2 id={`column-${id}`}>{label}</h2>
                  <span className="count">{columnTasks.length}</span>
                </div>
                {visibleTasks.length === 0 && (
                  <p className="empty">{columnTasks.length ? 'Sin coincidencias' : 'Sin tareas'}</p>
                )}
                {visibleTasks.map((task) => (
                  <article className="card" key={task.id}>
                    <h3>{task.title}</h3>
                    {task.description && <p>{task.description}</p>}
                    <select aria-label={`Estado de ${task.title}`} value={task.status}
                      onChange={(event) => {
                        const status = event.target.value;
                        setTasks((current) => moveTask(current, task.id, status));
                        setDraft((current) => current?.id === task.id ? { ...current, status } : current);
                      }}>
                      {statuses.map(({ id: value, label: name }) => <option key={value} value={value}>{name}</option>)}
                    </select>
                    <div className="actions">
                      <button onClick={() => openEditor(task)}>Editar</button>
                      <button className="danger" onClick={() => {
                        if (!window.confirm(`¿Eliminar «${task.title}»?`)) return;
                        setTasks((current) => deleteTask(current, task.id));
                        if (draft?.id === task.id) setDraft(null);
                      }}>Eliminar</button>
                    </div>
                  </article>
                ))}
              </section>
            );
          })}
        </div>
      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
