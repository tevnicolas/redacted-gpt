import { createContext } from 'react';
import { FilterSet } from 'shared/types';

export type FilterSetsContextType = {
  filterSets: FilterSet[];
  addFilterSet: (filterSet: FilterSet) => void;
  commitFilterSetEdits: (filterSet: FilterSet, index: number) => void;
  deleteFilterSet: (index: number) => void;
};

export const FilterSetsContext = createContext<FilterSetsContextType>({
  filterSets: [],
  addFilterSet: () => undefined,
  commitFilterSetEdits: () => undefined,
  deleteFilterSet: () => undefined,
});

export const FilterSetsProvider = FilterSetsContext.Provider;
