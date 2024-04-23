import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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

  /* This logic determines whether redaction should graduate to prompting, or whether to instead create a new filter set */
  useEffect(() => {
    switch (currentSet) {
      case 'create':
        navigate('/filter-sets');
        break;
      case '':
        setIsRedacted(true);
        break;
      case 'review': // isRedacted will already be true in this case
      case 'placeholder':
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
        <option className="" value="initial">
          Filter Set ---choose below---
        </option>
        <option className="hidden" value="review">
          Review
        </option>
        <option value="">None</option>
        <option value="PHONE_NUMBER">Phone Number</option>
        <option value="create">+Create Filter Set</option>
      </select>
    </div>
  );
}
