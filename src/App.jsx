import './index.css'; // or './App.css'
import { useState, useRef, useEffect } from 'react';

const App = () => {
    const [exercises, setExercises] = useState([]);
    const idRef = useRef(1);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem('exercises');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    setExercises(parsed);
                    const maxId = parsed.reduce((m, it) => Math.max(m, it.id || 0), 0);
                    idRef.current = maxId + 1;
                }
            }
        } catch (err) {
            // ignore parse errors
            console.error('Failed to load exercises from localStorage', err);
        }
    }, []);

    // Save to localStorage when exercises change
    useEffect(() => {
        try {
            localStorage.setItem('exercises', JSON.stringify(exercises));
        } catch (err) {
            console.error('Failed to save exercises to localStorage', err);
        }
    }, [exercises]);

    // Modal state: mode = 'add' | 'edit' | null
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', seconds: '' });
    const [touched, setTouched] = useState({ name: false, seconds: false });

    const openAddModal = () => {
        setForm({ name: `Exercise ${idRef.current}`, seconds: '' });
        setModalMode('add');
        setEditingId(null);
        setTouched({ name: false, seconds: false });
        setModalOpen(true);
    };

    const openEditModal = (id) => {
        const item = exercises.find(e => e.id === id);
        if (!item) return;
        setForm({ name: item.name, seconds: item.seconds ?? '' });
        setModalMode('edit');
        setEditingId(id);
        setTouched({ name: false, seconds: false });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalMode(null);
        setEditingId(null);
        setTouched({ name: false, seconds: false });
    };

    const validateForm = () => {
        const name = (form.name || '').trim();
        const secondsRaw = form.seconds === '' ? '' : String(form.seconds);
        if (!name) return { ok: false, message: 'Name is required' };
        if (name.length > 17) return { ok: false, message: 'Name must be 17 characters or less' };
        if (secondsRaw === '') return { ok: false, message: 'Seconds is required' };
        const seconds = parseFloat(secondsRaw);
        if (Number.isNaN(seconds)) return { ok: false, message: 'Seconds must be a number' };
        if (seconds < 1.5) return { ok: false, message: 'Minimum seconds is 1.5' };
        if (seconds > 10) return { ok: false, message: 'Maximum seconds is 10' };
        return { ok: true };
    };

    const saveFromModal = () => {
        const validation = validateForm();
        if (!validation.ok) {
            // Do not proceed if invalid; UI shows inline message
            return;
        }
        const name = form.name.trim() || `Exercise ${idRef.current}`;
        const seconds = form.seconds === '' ? null : parseFloat(form.seconds);
        if (modalMode === 'add') {
            const newItem = { id: idRef.current++, name, seconds };
            setExercises(prev => [...prev, newItem]);
        } else if (modalMode === 'edit' && editingId != null) {
            setExercises(prev => prev.map(e => e.id === editingId ? { ...e, name, seconds } : e));
        }
        closeModal();
    };

    const deleteExercise = (id) => {
        if (!window.confirm('Delete this exercise?')) return;
        setExercises(prev => prev.filter(e => e.id !== id));
    };

    // Run modal state
    const [runModalOpen, setRunModalOpen] = useState(false);
    const [runningId, setRunningId] = useState(null);
    const [currentCount, setCurrentCount] = useState(0);
    const intervalRef = useRef(null);

    const openRunModal = (id) => {
        setRunningId(id);
        setCurrentCount(0);
        setRunModalOpen(true);
    };

    const closeRunModal = () => {
        stopCounting();
        setRunModalOpen(false);
        setRunningId(null);
        setCurrentCount(0);
    };

    const startCounting = () => {
        const item = exercises.find(e => e.id === runningId);
        if (!item) return;
        // clear any previous
        stopCounting();
        let counter = 0;
        setCurrentCount(0);
        const seconds = (item.seconds == null) ? 1 : Number(item.seconds) || 1;
        intervalRef.current = setInterval(() => {
            counter += 1;
            setCurrentCount(counter);
            // here you'd play sounds if desired
            if (counter >= 20) {
                stopCounting();
            }
        }, seconds * 1000);
    };

    const stopCounting = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setCurrentCount(0);
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
                                <tr key={ex.id} onClick={() => openRunModal(ex.id)} style={{ cursor: 'pointer' }}>
                                    <td className="exercise-name">
                                        <div className="name-line">{ex.name}</div>
                                        {ex.seconds != null && <div className="seconds-line">{ex.seconds}s</div>}
                                    </td>
                                    <td className="actions">
                                        <button className="icon-btn" onClick={(e) => { e.stopPropagation(); openEditModal(ex.id); }} title="Edit">
                                            {/* pencil icon */}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#222"/>
                                                <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="#222"/>
                                            </svg>
                                        </button>
                                        <button className="icon-btn" onClick={(e) => { e.stopPropagation(); deleteExercise(ex.id); }} title="Delete">
                                            {/* trash icon */}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z" fill="#cb5555"/>
                                                <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#cb5555"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="section-button section-table-side">
                    <button className="primary-btn" onClick={openAddModal}>New exercise counter</button>
                </div>
                {modalOpen && (
                    <div className="modal-backdrop" role="dialog" aria-modal="true">
                        <div className="modal">
                            <h3>{modalMode === 'add' ? 'Add exercise' : 'Edit exercise'}</h3>
                            <label>
                                Name
                                <input type="text" maxLength={17} value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setTouched(t => ({ ...t, name: true })); }} onBlur={() => setTouched(t => ({ ...t, name: true }))} />
                                {(() => {
                                    const v = validateForm();
                                    if (!v.ok && v.message.toLowerCase().includes('name') && touched.name) return <div className="field-error">{v.message}</div>;
                                    return null;
                                })()}
                            </label>
                            <label>
                                Interval Seconds
                                <input type="number" step="0.1" min={1.5} max={10} value={form.seconds} onChange={e => { setForm(f => ({ ...f, seconds: e.target.value })); setTouched(t => ({ ...t, seconds: true })); }} onBlur={() => setTouched(t => ({ ...t, seconds: true }))} placeholder="e.g. 1.5" />
                                {(() => {
                                    const v = validateForm();
                                    if (!v.ok && (v.message.toLowerCase().includes('second') || v.message.toLowerCase().includes('number')) && touched.seconds) return <div className="field-error">{v.message}</div>;
                                    return null;
                                })()}
                            </label>
                            <div className="modal-actions">
                                <button className="primary-btn" onClick={saveFromModal} disabled={!validateForm().ok}>{modalMode === 'add' ? 'Add' : 'Save'}</button>
                                <button className="icon-btn" onClick={closeModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
                {runModalOpen && (
                    <div className="modal-backdrop" role="dialog" aria-modal="true">
                        <div className="modal">
                            <h3>Running: {exercises.find(e => e.id === runningId)?.name ?? ''}</h3>
                            <div style={{ marginBottom: 12 }}>
                                Interval: {exercises.find(e => e.id === runningId)?.seconds ?? '1'}s
                            </div>
                            <div style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', margin: '12px 0' }}>{currentCount}</div>
                            <div className="modal-actions">
                                <button className="primary-btn" onClick={startCounting}>Start Exercise</button>
                                <button className="icon-btn" onClick={() => { stopCounting(); }} title="Stop">Stop</button>
                                <button className="icon-btn" onClick={closeRunModal}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;