import './index.css'; // or './App.css'

const App = () => {
    return (
        <div className="full-page">
                <div className="mobile-container">
                    <div className="section-table section-table-main">
                        <p>Add a new exercise counter</p>
                    </div>
                    <div className="section-table section-table-side">
                        <button>New exercise counter</button>
                    </div>
                </div>
        </div>
    );
};

export default App;