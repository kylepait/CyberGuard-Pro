
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import UserHome from './components/user-home';
import TrainingModule from './components/TrainingModule';
import ManagerMetrics from './components/manager_metrics';
import DevHub from './components/dev_hub';
import TriviaGame from './components/triviaGame';
import QuizPopup from './components/QuizPopup';
import BarChart from './components/trainingModulesBarChart';
import StartModule from './components/StartModule';


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
            <Route path="/user-home" element={<UserHome/>} />
            <Route path="/TrainingModule" element={<TrainingModule/>} />
            <Route path="/manager_metrics" element={<ManagerMetrics/>} />
            <Route path="/dev_hub" element={<DevHub/>} />
            <Route path="/triviaGame" element={<TriviaGame/>} />
            <Route path="/QuizPopup" element={<QuizPopup/>}/>
            <Route path="/trainingModulesBarChart" element={<BarChart/>}/>
            <Route path="/StartModule" element={<StartModule/>}/>


          </Routes>
      </div>
    </Router>
  );
}

export default App;
