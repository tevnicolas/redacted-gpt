import { createContext } from 'react';
import { FilterSet } from '../lib/data';

export type FilterSetsValue = {
  filterSets: FilterSet[];
  addFilterSet: (filterSet: FilterSet) => void;
  editFilterSet: (filterSet: FilterSet) => void;
  deleteFilterSet: (filterSet: FilterSet) => void;
};

export const FilterSetsContext = createContext<FilterSetsValue>({
  filterSets: [],
  addFilterSet: () => undefined,
  editFilterSet: () => undefined,
  deleteFilterSet: () => undefined,
});
