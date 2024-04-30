import { useContext } from 'react';
import { FilterSetsContext, FilterSetsContextType } from './FilterSetsContext';

export function useFilterSets(): FilterSetsContextType {
  const values = useContext(FilterSetsContext);
  if (!values) {
    console.error('useFilterSets must be used inside FilterSetsProvider');
    // Will be logged as unexpected error
    throw 'Data could not be reached.';
  }
  return values;
}
