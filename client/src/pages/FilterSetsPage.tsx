import { useState } from 'react';
import Switch from 'react-switch';
import { useFilterSets } from '../components/useFilterSets';
import { FilterSet, UnsavedFilterSet } from '../lib/data';
import { defaultFilterSet } from '../lib/defaultFilterSet';

export function FilterSetsPage() {
  const { filterSets, addFilterSet } = useFilterSets();
  const [filterSet, setFilterSet] = useState<
    FilterSet | UnsavedFilterSet | undefined
  >();

  function handleFilterChange(filter: keyof FilterSet) {
    setFilterSet((prev) => {
      // Check for undefined and handle it
      if (!prev) {
        return { ...defaultFilterSet, [filter]: true };
      }
      // Toggle property while preserving type structure
      return {
        ...prev,
        [filter]: !prev[filter],
      };
    });
  }

  console.log(addFilterSet);
  return (
    <div className="flex flex-wrap justify-center">
      <div className="flex justify-center w-full">
        <div className="flex relative justify-center bg-mywhite rounded-[40px] w-[50vw] h-[294px] max-w-[410px]">
          <div className="m-[30px] w-full max-w-[410px] overflow-y-scroll">
            {filterSets.map((value, index) => {
              return (
                <LoggedFilterSet
                  key={index}
                  label={value.label}
                  onClick={() => setFilterSet(value)}
                />
              );
            })}
          </div>
          <div className="flex absolute w-8 h-8 rounded-[40px] bg-mygrey right-8 top-4">
            <div className="relative flex justify-center items-center w-full h-full">
              <div className="absolute bg-mywhite w-4 h-[3px] rounded-[40px]" />
              <div className="absolute bg-mywhite h-4 w-[3px] rounded-[40px]" />
            </div>
          </div>
        </div>
      </div>
      <Filters filterSet={filterSet} handleChange={handleFilterChange} />
    </div>
  );
}

type LoggedFilterSetProps = {
  onClick: () => void;
  label: string; // whole set label
};

function LoggedFilterSet({ onClick }: LoggedFilterSetProps) {
  return (
    <input
      className={`w-[calc(100%-30px)] text-black bg-mywhite focus:outline-none focus:bg-myyellow mt-[1px] mb-[1px] pl-2 pr-2`}
      readOnly={true}
      onClick={onClick}>
      Hello
    </input>
  );
}

type FiltersProps = {
  filterSet: FilterSet | UnsavedFilterSet | undefined;
  handleChange: (filter: keyof FilterSet) => void;
};

function Filters({ filterSet, handleChange }: FiltersProps) {
  return (
    <>
      <div className="flex">
        <Filter
          label={'Person'}
          isEnabled={filterSet?.person || false}
          handleChange={handleChange}
        />
      </div>
    </>
  );
}

type FilterProps = {
  label: string; // singular filter label
  isEnabled: boolean;
  handleChange: (filter: keyof FilterSet) => void;
};

function Filter({ label, isEnabled, handleChange }: FilterProps) {
  return (
    <label>
      {label}
      <Switch
        checked={isEnabled}
        onChange={() => handleChange('person')}
        className="react-switch"
      />
    </label>
  );
}
