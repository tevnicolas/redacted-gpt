import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage/HomePage';
import { FilterSetsPage } from './pages/FilterSetsPage/FilterSetsPage';
import { AboutPage } from './pages/AboutPage/AboutPage';
import { SupportPage } from './pages/SupportPage/SupportPage';
import { SignUpPage } from './pages/SignUpPage/SignUpPage';
import { useEffect, useState } from 'react';
import { readAccountSets, readToken, saveToken } from './lib/api-calls';
import {
  FilterSetsContextType,
  FilterSetsProvider,
} from './components/FilterSetsContext';
import { User, UserContextType, UserProvider } from './components/UserContext';
import { UnauthorizedError } from './lib/errors-checks';
import { ErrorContextType, ErrorProvider } from './components/ErrorContext';
import { FilterSet } from 'shared/types';

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
    // important to create a variable, so that sessionStorage will be updated synchronously
    const newFilterSets = [filterSet, ...filterSets];
    setFilterSets(newFilterSets);
    // important to keep this code rewritten at the end of each action fn, as putting it in a useEffect with filterSets as a dependency creates a race condition with loadFilterSets().
    sessionStorage.setItem('filterSets', JSON.stringify(newFilterSets));
  }

  function commitFilterSetEdits(filterSet: FilterSet, index: number) {
    if (!filterSet) return;
    const newFilterSets = [...filterSets];
    newFilterSets[index] = filterSet;
    setFilterSets(newFilterSets);
    sessionStorage.setItem('filterSets', JSON.stringify(newFilterSets));
  }

  function deleteFilterSet(index: number) {
    const newFilterSets = [...filterSets];
    newFilterSets.splice(index, 1);
    setFilterSets(newFilterSets);
    sessionStorage.setItem('filterSets', JSON.stringify(newFilterSets));
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
    commitFilterSetEdits,
    deleteFilterSet,
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
