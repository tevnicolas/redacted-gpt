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
import {
  FilterSetsContextType,
  FilterSetsProvider,
} from './components/FilterSetsContext';
import { User, UserContextType, UserProvider } from './components/UserContext';
import { UnauthorizedError } from './lib/errors-checks';
import { ErrorContextType, ErrorProvider } from './components/ErrorContext';

export default function App() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string | undefined>(readToken());
  const [filterSets, setFilterSets] = useState<FilterSet[]>([]);
  const [error, setError] = useState<unknown>();

  function handleSignIn(user: User, token: string) {
    setUser(user);
    setToken(token);
    saveToken(token);
  }

  function handleSignOut() {
    setUser(undefined);
    setToken(undefined);
    saveToken(undefined);
  }

  function addFilterSet(filterSet: FilterSet) {
    setFilterSets((prevFilterSets) => [...prevFilterSets, filterSet]);
  }

  useEffect(() => {
    async function loadFilterSets() {
      try {
        // if logged out, load Filter Sets from session storage
        if (!token) {
          const sessionData = sessionStorage.getItem('filterSets');
          setFilterSets(sessionData ? JSON.parse(sessionData) : []);
          return;
        }
        // if logged in, load Filter Sets from account
        const accountData = await readAccountSets(token);
        setFilterSets(accountData);
      } catch (error) {
        setError(error);
        if (error instanceof UnauthorizedError) {
          handleSignOut();
        }
      }
    }
    loadFilterSets();
  }, [token]);

  const errorContextValues: ErrorContextType = { error, setError };
  const userContextValues: UserContextType = {
    user,
    token,
    handleSignIn,
    handleSignOut,
  };
  const filterSetsContextValues: FilterSetsContextType = {
    filterSets,
    addFilterSet,
  };
  return (
    <ErrorProvider value={errorContextValues}>
      <UserProvider value={userContextValues}>
        <FilterSetsProvider value={filterSetsContextValues}>
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
    </ErrorProvider>
  );
}
