


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/home'
import Books from './components/Books/books';


import './App.css';

const App = () => {
  return (
    <BrowserRouter>
    

    <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/books" element={<Books/>}/>
    {/* <Route path="/jobitem/:id" element={<JobItem/>}/>
    <Route path="/jobs" element={<Jobs/>}/>
    <Route path="/login" element={<Login/>}/> 
    <Route path="/notfound" element={<NotFound/>}/> */}
  </Routes>
    </BrowserRouter>
    
  );
};

export default App;
