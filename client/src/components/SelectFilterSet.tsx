import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

type SelectFilterSetProps = {
  isNone: (value: boolean) => void;
  // filterSets: FilterSet[] | UnsavedFilterSet[];
  // currentSet: FilterSet | UnsavedFilterSet;
  currentSet: string;
  setCurrentSet: (e: string) => void;
};

export function SelectFilterSet({
  isNone,
  currentSet,
  setCurrentSet,
}: SelectFilterSetProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (currentSet === 'Create') {
      navigate('/filter-sets');
    }
    isNone(currentSet === 'None');
  }, [currentSet, isNone, navigate]);

  return (
    <div className="mt-[15px]">
      <select
        name="filterSet"
        value={currentSet}
        onChange={(e) => setCurrentSet(e.currentTarget.value)}
        className="flex items-center text-center text-mywhite rounded-[40px] p-1 ml-1 mr-1 border-[5.5px] border-black w-[98px] min-w-[98px] max-w-[98px] text-[15px] h-[39px] bg-black select-none">
        <option className="hidden" value="">
          Filter Set
        </option>
        <option value=""></option>
        <option value="None">None</option>
        <option value="PHONE_NUMBER">Phone Number</option>
        <option value="Create">+Create Filter Set</option>
      </select>
    </div>
  );
}
