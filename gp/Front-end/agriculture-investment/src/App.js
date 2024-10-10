
import './App.css';

import Footer from './shared/Footer';
import Header from './shared/Header';
import { Outlet } from "react-router-dom";
function App() {
  return (
    <>
    <Header />
    <Outlet />
    <Footer />
    </>
  );
}

export default App;
