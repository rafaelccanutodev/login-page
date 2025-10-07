import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Section from './components/Section/Section'; // Login
import Users from './components/Users/users'; // Lista de usuários

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Section />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
