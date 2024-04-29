import { useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';
import { useFilterSets } from '../components/useFilterSets';
import { FilterSet, UnsavedFilterSet } from '../lib/data';
import { defaultFilterSet } from '../lib/default-filter-set';
import { Button } from '../components/Button';

export function FilterSetsPage() {
  const { filterSets, addFilterSet } = useFilterSets();
  const [filterSet, setFilterSet] = useState<FilterSet | UnsavedFilterSet>(
    defaultFilterSet
  );
  const selectedIndex = useRef<number>(0);
  console.log(selectedIndex.current);
  useEffect(() => {
    if (!filterSets.length) return;
    selectedIndex.current = 0;
    setFilterSet(filterSets[selectedIndex.current]);
  }, [filterSets]);

  function handleFilterChange(
    filter: keyof FilterSet | keyof UnsavedFilterSet
  ) {
    setFilterSet((prev) => {
      // Toggle property while keeping other properties the same
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
                  isSelected={index === selectedIndex.current}
                  label={value.label}
                  onClick={() => {
                    selectedIndex.current = index;
                    setFilterSet(value);
                  }}
                />
              );
            })}
          </div>
          <AddButton />
        </div>
      </div>
      <div className="flex w-full justify-center mt-[20px] mb-[40px]">
        <div className="flex space-around w-[50vw] max-w-[410px]">
          <div className="flex w-full justify-end">
            <Button
              type="button"
              text="Edit"
              className="bg-mygrey text-[13px] max-w-[55px]"
            />
          </div>
          <div className="flex w-full justify-center">
            <Button
              type="button"
              text="Save"
              className="bg-mygrey text-[13px] max-w-[55px]"
            />
          </div>
          <div className="flex w-full justify-start">
            <Button
              type="button"
              text="Delete"
              className="bg-mygrey text-[13px] max-w-[55px]"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <div className="flex flex-wrap w-[50vw] h-[294px] max-w-[410px]">
          {Object.entries(filterSet).map(([key, value]) => {
            if (key === 'label' || key === 'filterSetId') return; //ensures bool
            return (
              <Filter
                key={key}
                label={key}
                isEnabled={value as boolean}
                onChange={() => handleFilterChange(key as keyof FilterSet)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

type LoggedFilterSetProps = {
  isSelected: boolean;
  label: string; // whole set label
  onClick: () => void;
};

function LoggedFilterSet({ isSelected, label, onClick }: LoggedFilterSetProps) {
  return (
    <input
      value={label}
      className={`w-[calc(100%-30px)] text-black focus:outline-none mt-[1px] mb-[1px] pl-2 pr-2 select-none ${
        isSelected ? 'bg-myyellow' : 'bg-mywhite'
      }`}
      readOnly={true}
      onClick={onClick}
    />
  );
}

function AddButton() {
  return (
    <div className="flex absolute w-8 h-8 rounded-[40px] bg-mygrey right-8 top-4">
      <div className="relative flex justify-center items-center w-full h-full">
        <div className="absolute bg-mywhite w-4 h-[3px] rounded-[40px]" />
        <div className="absolute bg-mywhite h-4 w-[3px] rounded-[40px]" />
      </div>
    </div>
  );
}

type FilterProps = {
  label: string; // singular filter label
  isEnabled: boolean;
  onChange: () => void;
};

function Filter({ label, isEnabled, onChange }: FilterProps) {
  const titleMappings: { [key: string]: string } = {
    usSsn: 'US SSN',
    usDriverLicense: "US Driver's License",
    usBankNumber: 'US Bank Number',
    dateTime: 'Date / Time',
    ipAddress: 'IP Address',
    creditCard: 'Credit Card',
    crypto: 'Crypto Wallet',
    location: 'Location',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    person: 'Person',
  };
  const title = titleMappings[label];
  return (
    <div className="flex max-w-[410px] w-[calc(50%-6.5vw)] justify-end mr-[6.5vw]  sm:w-[calc(50%-55px)] sm:mr-[55px]">
      <label className="flex items-center justify-end text-[13px] flex-wrap sm:flex-nowrap">
        <span className="w-full justify-end m-[5px] flex whitespace-nowrap">
          {title}
        </span>
        <Switch
          checked={isEnabled}
          onChange={onChange}
          className="react-switch"
        />
      </label>
    </div>
  );
}
