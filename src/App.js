import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./pages/Header";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import DashBoard from "./pages/DashBoard";
import Profile from "./pages/Profile";

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Header />}>
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </Router>

  );
}

export default App;