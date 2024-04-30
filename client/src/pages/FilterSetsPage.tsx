import { useEffect, useRef, useState } from 'react';
import Switch from 'react-switch';
import { useFilterSets } from '../components/useFilterSets';
import { FilterSet, UnsavedFilterSet } from '../lib/data';
import { defaultFilterSet } from '../lib/default-filter-set';
import { Button } from '../components/Button';

export function FilterSetsPage() {
  const { filterSets, addFilterSet, editFilterSet } = useFilterSets();
  const currentIndex = useRef<number>(0);
  const [editing, setEditing] = useState<
    FilterSet | UnsavedFilterSet | undefined
  >();

  useEffect(() => {
    if (!filterSets.length) {
      addFilterSet(defaultFilterSet);
      setEditing(defaultFilterSet);
    }
    // disabling dependencies, I only want to add new default on mount if no
    // filter sets exist
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    currentIndex.current = 0;
  }, [filterSets]);

  function handleDraftedChange(
    key: keyof FilterSet | keyof UnsavedFilterSet,
    labelValue?: string
  ) {
    if (!editing) return;
    // Change label
    if (key === 'label') {
      if (labelValue === undefined) return; // should never happen
      setEditing((prev) => {
        if (!prev) return;
        return {
          ...prev,
          [key]: labelValue,
        };
      });
      return;
    }
    // Toggle filter boolean while keeping other properties the same
    setEditing((prev) => {
      if (!prev) return;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  }

  function handleAddClick() {
    addFilterSet(defaultFilterSet);
    setEditing(defaultFilterSet);
  }

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
                  isSelected={index === currentIndex.current}
                  onClick={() => {
                    if (editing) return; // Don't select while editing
                    currentIndex.current = index;
                  }}
                  editing={editing}
                  onChange={handleDraftedChange}
                />
              );
            })}
          </div>
          <AddButton onClick={handleAddClick} />
        </div>
      </div>
      <div className="flex w-full justify-center mt-[20px] mb-[40px]">
        <div className="flex space-around w-[50vw] max-w-[410px]">
          {editing ? (
            <>
              <div className="flex w-full justify-end">
                <Button
                  type="button"
                  text="Save"
                  className="bg-mygrey text-[13px] max-w-[55px]"
                  onClick={() => {
                    editFilterSet(editing, currentIndex.current);
                    setEditing(undefined);
                  }}
                />
              </div>
              <div className="flex w-full justify-center">
                <Button
                  type="button"
                  text="Revert"
                  className="bg-mygrey text-[13px] max-w-[55px]"
                  onClick={() => {
                    setEditing(undefined);
                  }}
                />
              </div>
              <div className="flex w-full justify-start">
                <Button
                  type="button"
                  text="Delete"
                  className="bg-mygrey text-[13px] max-w-[55px]"
                />
              </div>
            </>
          ) : (
            <div className="flex w-full justify-start">
              <Button
                type="button"
                text="Edit"
                className="bg-mygrey text-[13px] max-w-[55px]"
                onClick={() => {
                  if (!filterSets.length) addFilterSet(defaultFilterSet);
                  setEditing(filterSets[currentIndex.current]);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center w-full">
        <div className="flex flex-wrap w-[50vw] h-[294px] max-w-[410px]">
          {Object.entries(defaultFilterSet).map(([key, value]) => {
            if (key === 'label' || key === 'filterSetId') return; //ensures bool
            return (
              <Filter
                key={key}
                label={key}
                isEnabled={value as boolean}
                onChange={() => handleDraftedChange(key as keyof FilterSet)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

type LoggedFilterSetProps = {
  label: string; // whole set's label
  isSelected: boolean;
  onClick: () => void;
  editing: FilterSet | UnsavedFilterSet | undefined;
  onChange: (key: keyof FilterSet | keyof UnsavedFilterSet, e: string) => void;
};

function LoggedFilterSet({
  label,
  isSelected,
  onClick,
  editing,
  onChange,
}: LoggedFilterSetProps) {
  return (
    <input
      value={editing ? editing.label : label}
      onChange={(e) => onChange('label', e.currentTarget.value)}
      className={`w-[calc(100%-30px)] text-black focus:outline-none mt-[1px] mb-[1px] pl-2 pr-2 select-none cursor-pointer ${
        isSelected ? 'bg-myyellow' : 'bg-mywhite'
      }`}
      // allow editing (false) if isSelected and isEditing are both true
      readOnly={!(isSelected && editing)}
      onClick={onClick}
    />
  );
}

type AddButtonProps = {
  onClick: () => void;
};

function AddButton({ onClick }: AddButtonProps) {
  return (
    <div
      onClick={onClick}
      className="flex absolute w-[34px] h-[34px] rounded-[40px] bg-mygrey right-8 top-4 cursor-pointer">
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
      <label
        onClick={onChange}
        className="flex items-center justify-end text-[13px] flex-wrap cursor-pointer sm:flex-nowrap">
        <span className="w-full justify-end mr-[5px] flex whitespace-nowrap">
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
