import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import FlightStatus from './components/FlightStatus';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
     <ErrorBoundary fallback={<h1>Error - please refresh</h1>}
        showDetails={false}
      >
      <Router>
        <Routes> 
          <Route path="/" element={<FlightStatus />} /> 


        </Routes> 
      </Router>
    </ErrorBoundary>
  );
}

export default App;
