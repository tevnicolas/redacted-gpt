import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { FilterSetsPage } from './pages/FilterSetsPage';
import { AboutPage } from './pages/AboutPage';
import { SupportPage } from './pages/SupportPage';
import { SignUpPage } from './pages/SignUpPage';
import { useEffect, useState } from 'react';
import { FilterSet, readAccountSets, readToken, saveToken } from './lib/data';
import { FilterSetsProvider } from './components/FilterSetsContext';
import { User, UserProvider } from './components/UserContext';

export default function App() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string | null>(readToken());
  const [filterSets, setFilterSets] = useState<FilterSet[]>([]);

  function handleSignIn(user: User, token: string) {
    setUser(user);
    setToken(token);
    saveToken(token);
  }

  function handleSignOut() {
    console.log('logged out!');
    setUser(undefined);
    setToken(null); // think about changing to undefined?
    saveToken(undefined);
  }

  function addFilterSet(filterSet: FilterSet) {
    //double check
    setFilterSets((prevFilterSets) => [...prevFilterSets, filterSet]);
  }

  useEffect(() => {
    async function loadFilterSets() {
      try {
        // if logged out, load Filter Sets from session storage
        if (!token) {
          const sessionData = sessionStorage.getItem('filterSets');
          sessionData
            ? setFilterSets(JSON.parse(sessionData))
            : setFilterSets([]);
          return;
        }
        // if logged in, load Filter Sets from account
        const accountData = await readAccountSets(token);
        setFilterSets(accountData);
      } catch (error) {
        console.log(error);
      }
    }
    loadFilterSets();
  }, [token]);

  const userContextValue = { user, token, handleSignIn, handleSignOut };
  const fSContextValue = { filterSets, addFilterSet };
  return (
    <UserProvider value={userContextValue}>
      <FilterSetsProvider value={fSContextValue}>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route index element={<HomePage />} />
            <Route path="filter-sets" element={<FilterSetsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="support" element={<SupportPage />} />
          </Route>
          <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
      </FilterSetsProvider>
    </UserProvider>
  );
}
