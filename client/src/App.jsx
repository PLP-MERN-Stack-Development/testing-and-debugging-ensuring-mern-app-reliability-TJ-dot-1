import React from 'react';
import { BugProvider } from './context/BugContext';
import ErrorBoundary from './components/ErrorBoundary';
import BugForm from './components/BugForm/BugForm';
import BugList from './components/BugList/BugList';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <BugProvider>
        <div className="App">
          <header className="App-header">
            <h1>Bug Tracker</h1>
            <p>Report and manage bugs efficiently</p>
          </header>

          <main className="App-main">
            <div className="container">
              <BugForm />
              <BugList />
            </div>
          </main>

          <footer className="App-footer">
            <p>&copy; 2025 Bug Tracker. Built with React and Node.js</p>
          </footer>
        </div>
      </BugProvider>
    </ErrorBoundary>
  );
}

export default App;