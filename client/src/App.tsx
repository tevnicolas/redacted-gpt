// import { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Prompt } from './pages/Prompt';
import { FilterSets } from './pages/FilterSets';
import { About } from './pages/About';
import { Support } from './pages/Support';
import { SignUp } from './pages/SignUp';

export default function App() {
  // state for filter sets (inside of context)
  // inside context add and remove functions
  // if not signed in, add function puts it in local storage
  // useEffect(() => { // use effect will read them if logged in
  //   async function readServerData() {
  //     const resp = await fetch('/api/hello');
  //     const data = await resp.json();

  //     console.log('Data from server:', data);

  //     setServerData(data.message);
  //   }

  //   readServerData();
  // }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Prompt />} />
          <Route path="filter-sets" element={<FilterSets />} />
          <Route path="about" element={<About />} />
          <Route path="support" element={<Support />} />
        </Route>
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </>
  );
}
