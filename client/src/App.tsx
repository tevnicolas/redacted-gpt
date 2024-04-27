import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { FilterSetsPage } from './pages/FilterSetsPage';
import { AboutPage } from './pages/AboutPage';
import { SupportPage } from './pages/SupportPage';
import { SignUpPage } from './pages/SignUpPage';

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
          <Route index element={<HomePage />} />
          <Route path="filter-sets" element={<FilterSetsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>
        <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>
    </>
  );
}
