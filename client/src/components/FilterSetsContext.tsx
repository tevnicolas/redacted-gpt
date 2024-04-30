import { createContext } from 'react';
import { FilterSet, UnsavedFilterSet } from '../lib/data';

export type FilterSetsContextType = {
  filterSets: FilterSet[] | UnsavedFilterSet[];
  addFilterSet: (filterSet: FilterSet | UnsavedFilterSet) => void;
  editFilterSet: (
    filterSet: FilterSet | UnsavedFilterSet | undefined,
    index: number
  ) => void;
  // deleteFilterSet: (filterSet: FilterSet) => void;
};

export const FilterSetsContext = createContext<FilterSetsContextType>({
  filterSets: [],
  addFilterSet: () => undefined,
  editFilterSet: () => undefined,
  // deleteFilterSet: () => undefined,
});

export const FilterSetsProvider = FilterSetsContext.Provider;
