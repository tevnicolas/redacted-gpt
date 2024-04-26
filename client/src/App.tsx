import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { FilterSetsPage } from './pages/FilterSetsPage';
import { AboutPage } from './pages/AboutPage';
import { SupportPage } from './pages/SupportPage';
import { SignUpPage } from './pages/SignUpPage';
// import { createContext } from 'react';
// import { FilterSet } from './lib/data';

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

  // const filterSetData = createContext<FilterSet[]>([
  //   {
  //     filterSetId: 1,
  //     label: 'first',
  //     person: true,
  //     phoneNumber: true,
  //     emailAddress: true,
  //     dateTime: true,
  //     location: true,
  //     usSsn: true,
  //     usDriverLicense: true,
  //     crypto: true,
  //     usBankNumber: true,
  //     creditCard: true,
  //     ipAddress: true,
  //   },
  //   {
  //     filterSetId: 2,
  //     label: 'second',
  //     person: false,
  //     phoneNumber: true,
  //     emailAddress: false,
  //     dateTime: false,
  //     location: false,
  //     usSsn: false,
  //     usDriverLicense: false,
  //     crypto: false,
  //     usBankNumber: false,
  //     creditCard: false,
  //     ipAddress: false,
  //   },
  // ]);

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
