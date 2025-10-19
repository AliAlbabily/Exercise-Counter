import './index.css'; // or './App.css'
import { useState, useRef } from 'react';

const App = () => {
    const [exercises, setExercises] = useState([]);
    const idRef = useRef(1);

    const addExercise = () => {
        const name = window.prompt('Exercise name', `Exercise ${idRef.current}`) || `Exercise ${idRef.current}`;
        const newItem = { id: idRef.current++, name };
        setExercises(prev => [...prev, newItem]);
    };

    const editExercise = (id) => {
        const item = exercises.find(e => e.id === id);
        if (!item) return;
        const name = window.prompt('Edit exercise name', item.name);
        if (name === null) return; // cancelled
        setExercises(prev => prev.map(e => e.id === id ? { ...e, name } : e));
    };

    const deleteExercise = (id) => {
        if (!window.confirm('Delete this exercise?')) return;
        setExercises(prev => prev.filter(e => e.id !== id));
    };

    return (
        <div className="full-page">
            <div className="mobile-container">
                <div className="section-table section-table-main">
                    <table className="exercise-table" aria-label="Exercises">
                        <thead>
                            <tr>
                                <th>Exercise</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exercises.length === 0 && (
                                <tr className="empty-row">
                                    <td colSpan="2">No exercises yet — add one using the button below.</td>
                                </tr>
                            )}
                            {exercises.map(ex => (
                                <tr key={ex.id}>
                                    <td className="exercise-name">{ex.name}</td>
                                    <td className="actions">
                                        <button className="icon-btn" onClick={() => editExercise(ex.id)} title="Edit">
                                            {/* pencil icon */}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#333"/>
                                                <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="#333"/>
                                            </svg>
                                        </button>
                                        <button className="icon-btn" onClick={() => deleteExercise(ex.id)} title="Delete">
                                            {/* trash icon */}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z" fill="#c00"/>
                                                <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#c00"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="section-table section-table-side">
                    <button className="primary-btn" onClick={addExercise}>New exercise counter</button>
                </div>
            </div>
        </div>
    );
};

export default App;