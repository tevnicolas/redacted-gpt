import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
// import { useFilterSets } from './useFilterSets';

type SelectFilterSetProps = {
  setIsRedacted: (value: boolean) => void;
  // will implement... filterSets: FilterSet[] | UnsavedFilterSet[];
  // will implement... currentSet: FilterSet | UnsavedFilterSet;
  currentSet: string;
  setCurrentSet: (e: string) => void;
};

export function SelectFilterSet({
  setIsRedacted,
  currentSet,
  setCurrentSet,
}: SelectFilterSetProps) {
  const navigate = useNavigate();
  // const { filterSets } = useFilterSets();

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

  return (
    <div className="mt-[15px]">
      <select
        value={currentSet}
        onChange={(e) => setCurrentSet(e.currentTarget.value)}
        className={`flex items-center text-center text-mywhite rounded-[40px] p-1 ml-1 mr-1 border-[5.5px] border-black w-[98px] min-w-[98px] max-w-[98px] text-[15px] h-[39px] bg-black select-none ${
          currentSet === 'review' && 'border-blue-500'
        }`}>
        <option value="initial">Filter Set ---choose below---</option>
        <option value="create">+Create Custom Filter Set</option>
        <option className="hidden" value="review">
          Review
        </option>
        <option value="none">None</option>
        <option value="PHONE_NUMBER">Phone Number</option>
        <option value="PHONE_NUMBER">Email Address</option>
        <option value="PHONE_NUMBER">Location</option>
        <option value="PHONE_NUMBER">US Driver's License</option>
        <option value="PHONE_NUMBER">US Bank Number</option>
        <option value="PHONE_NUMBER">Phone Number</option>
        <option value="PHONE_NUMBER">Phone Number</option>
        <option value="PHONE_NUMBER">Phone Number</option>
        <option value="PHONE_NUMBER">Phone Number</option>
        <option value="PHONE_NUMBER">Phone Number</option>
        <option value="PHONE_NUMBER">Phone Number</option>
      </select>
    </div>
  );
}
