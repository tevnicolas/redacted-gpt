import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useFilterSets } from '../../components/useFilterSets';
import { titleMappings } from '../../lib/title-mappings';

type SelectFilterSetProps = {
  setIsRedacted: (value: boolean) => void;
  currentSet: string;
  setCurrentSet: (e: string) => void;
};

export function SelectFilterSet({
  setIsRedacted,
  currentSet,
  setCurrentSet,
}: SelectFilterSetProps) {
  const navigate = useNavigate();
  const { filterSets } = useFilterSets();

  /* This logic determines whether redaction should graduate to prompting, or whether to instead create a new filter set */
  useEffect(() => {
    switch (currentSet) {
      case 'create':
        navigate('/filter-sets');
        break;
      case 'none':
        setIsRedacted(true);
        break;
      case 'review': // if currentSet==='review' isRedacted will already be true
      case 'placeholder':
      case 'initial':
        break;
      default:
        setIsRedacted(false);
    }
  }, [currentSet, setIsRedacted, navigate]);

  /* This is to map out the filter's names to their corresponding Upper Snake Case, which is what Presidio's redactor uses to apply the filters */
  const valueMappings: Record<string, string> = {};
  Object.keys(titleMappings).forEach((key) => {
    valueMappings[key] = key
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLocaleUpperCase();
  });

  return (
    <div className="mt-[15px]">
      <select
        value={currentSet}
        onChange={(e) => setCurrentSet(e.currentTarget.value)}
        className={`flex items-center text-center text-mywhite rounded-[40px] p-1 ml-1 mr-1 border-[5.5px] border-black w-[98px] min-w-[98px] max-w-[98px] text-[15px] h-[39px] bg-black select-none truncate ${
          currentSet === 'review' && 'border-blue-500'
        }`}>
        <option value="initial">
          {'Pick Filter or Filter Set---choose below---'}
        </option>
        <option value="create">+Create Filter Set</option>
        <option className="hidden" value="review">
          Review
        </option>
        <option value="none">None</option>

        {
          // Filter Sets selectable
          filterSets.map((set, index) => {
            let sumValues = ''; // will represent all filters enabled in a set
            Object.entries(set).forEach(([key, value]) => {
              if (typeof value !== 'boolean') return; // No non filter values
              if (value) sumValues += valueMappings[key] + ' '; // +true filters
            });
            return (
              <option key={`${set.label}-${index}`} value={sumValues}>
                {set.label}
              </option>
            );
          })
        }
        {
          // Default filters selectable
          Object.keys(valueMappings).map((key, index) => {
            return (
              <option
                key={`default-${titleMappings[key]}-${index}`}
                value={valueMappings[key]}>
                {titleMappings[key]}
              </option>
            );
          })
        }
      </select>
    </div>
  );
}
