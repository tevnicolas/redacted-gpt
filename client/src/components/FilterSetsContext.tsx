import { createContext } from 'react';
import { FilterSet } from '../lib/data';

export type FilterSetsContextType = {
  filterSets: FilterSet[];
  addFilterSet: (filterSet: FilterSet) => void;
  // editFilterSet: (filterSet: FilterSet) => void;
  // deleteFilterSet: (filterSet: FilterSet) => void;
};

export const FilterSetsContext = createContext<FilterSetsContextType>({
  filterSets: [],
  addFilterSet: () => undefined,
  // editFilterSet: () => undefined,
  // deleteFilterSet: () => undefined,
});

export const FilterSetsProvider = FilterSetsContext.Provider;
