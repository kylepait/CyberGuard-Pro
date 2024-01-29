
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';

import Nav from './components/Nav';

import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
          <Nav />
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/Signup" element={<Signup/>} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
