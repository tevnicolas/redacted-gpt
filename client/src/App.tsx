import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage/HomePage';
import { FilterSetsPage } from './pages/FilterSetsPage/FilterSetsPage';
import { AboutPage } from './pages/AboutPage/AboutPage';
import { SupportPage } from './pages/SupportPage/SupportPage';
import { SignUpPage } from './pages/SignUpPage/SignUpPage';
import { useEffect, useState } from 'react';
import {
  addAccountSet,
  deleteAccountSet,
  editAccountSet,
  readAccountSets,
  readToken,
  saveToken,
} from './lib/api-calls';
import {
  FilterSetsContextType,
  FilterSetsProvider,
} from './components/FilterSetsContext';
import { User, UserContextType, UserProvider } from './components/UserContext';
import { UnauthorizedError } from './lib/errors-checks';
import { ErrorContextType, ErrorProvider } from './components/ErrorContext';
import { FilterSet, SessionFilterSet } from 'shared/types';

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

  async function addFilterSet(filterSet: SessionFilterSet) {
    const originalFilterSets = [...filterSets]; // copy for rollback on error
    try {
      // sessionStorage will be updated synchronously as an optimistic update
      const newFilterSets = [filterSet, ...filterSets];
      setFilterSets(newFilterSets);
      if (!token) {
        // important to keep this code in each one of these action functions; putting it in a useEffect with filterSets as a dependency creates a race condition with loadFilterSets().
        sessionStorage.setItem('filterSets', JSON.stringify(newFilterSets));
      } else {
        await addAccountSet(filterSet, token);
      }
    } catch (error) {
      setError(error);
      setFilterSets(originalFilterSets);
      if (error instanceof UnauthorizedError) {
        handleSignOut();
      }
    }
  }

  async function commitFilterSetEdits(filterSet: FilterSet, index: number) {
    const originalFilterSets = [...filterSets]; // copy for rollback on error
    try {
      const newFilterSets = [...filterSets];
      newFilterSets.splice(index, 1);
      newFilterSets.unshift(filterSet);
      setFilterSets(newFilterSets);
      if (!token) {
        sessionStorage.setItem('filterSets', JSON.stringify(newFilterSets));
      } else {
        if (!('filterSetId' in filterSet)) {
          throw new Error(
            'Something went wrong while trying to update your Filter Set.'
          );
        }
        await editAccountSet(filterSet, token);
      }
    } catch (error) {
      setError(error);
      setFilterSets(originalFilterSets);
      if (error instanceof UnauthorizedError) {
        handleSignOut();
      }
    }
  }

  async function deleteFilterSet(index: number) {
    const originalFilterSets = [...filterSets]; // copy for rollback on error
    try {
      const newFilterSets = [...filterSets];
      const deletedFilterSet = newFilterSets.splice(index, 1)[0]; // delete op
      setFilterSets(newFilterSets);
      if (!token) {
        sessionStorage.setItem('filterSets', JSON.stringify(newFilterSets));
      } else {
        if (!('filterSetId' in deletedFilterSet)) {
          throw new Error(
            'Something went wrong while trying to delete the Filter Set.'
          );
        }
        await deleteAccountSet(deletedFilterSet.filterSetId, token);
      }
    } catch (error) {
      setError(error);
      setFilterSets(originalFilterSets);
      if (error instanceof UnauthorizedError) {
        handleSignOut();
      }
    }
  }

  // async function commitFilterSetEdits(filterSet: FilterSet, index: number) {
  //   const newFilterSets = [...filterSets];
  //   newFilterSets.splice(index, 1);
  //   newFilterSets.unshift(filterSet);
  //   setFilterSets(newFilterSets);
  //   sessionStorage.setItem('filterSets', JSON.stringify(newFilterSets));
  // }

  // async function deleteFilterSet(index: number) {
  //   const newFilterSets = [...filterSets];
  //   newFilterSets.splice(index, 1);
  //   setFilterSets(newFilterSets);
  //   sessionStorage.setItem('filterSets', JSON.stringify(newFilterSets));
  // }

  useEffect(() => {
    async function loadFilterSets() {
      try {
        // if logged out, load Filter Sets from session storage
        if (!token) {
          const sessionData = sessionStorage.getItem('filterSets');
          setFilterSets(sessionData ? JSON.parse(sessionData) : []);
          return;
        } else {
          // if logged in, load Filter Sets from account
          const accountData = await readAccountSets(token);
          setFilterSets(accountData);
        }
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
