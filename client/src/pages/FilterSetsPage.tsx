import { useState } from 'react';
import Switch from 'react-switch';
import { useFilterSets } from '../components/useFilterSets';
import { FilterSet, UnsavedFilterSet } from '../lib/data';
import { defaultFilterSet } from '../lib/default-filter-set';
import { Button } from '../components/Button';

export function FilterSetsPage() {
  const { filterSets, addFilterSet, editFilterSet } = useFilterSets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editing, setEditing] = useState<
    FilterSet | UnsavedFilterSet | undefined
  >();

  function handleLabelChange(labelValue: string): void {
    if (!editing) return;
    if (labelValue === undefined) return; // should never happen
    setEditing((prev) => {
      if (!prev) return; // should never happen
      return {
        ...prev,
        ['label']: labelValue,
      };
    });
    return;
  }

  function handleFilterChange(key: string): void {
    if (!editing) return;
    setEditing((prev) => {
      if (!prev) return; // should never happen
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  }

  function handleAdd(): void {
    addFilterSet(defaultFilterSet);
    setEditing(defaultFilterSet);
  }
  function handleEdit(): void {
    if (!filterSets.length) addFilterSet(defaultFilterSet);
    setEditing(filterSets[currentIndex]);
  }
  function handleSave(): void {
    editFilterSet(editing, currentIndex);
    setEditing(undefined);
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
                  isSelected={index === currentIndex}
                  onClick={() => {
                    if (editing) return; // Don't select another while editing
                    setCurrentIndex(index);
                  }}
                  editing={editing}
                  onChange={handleLabelChange}
                />
              );
            })}
          </div>
          <AddButton onClick={handleAdd} />
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
                  onClick={handleSave}
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
                onClick={handleEdit}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center w-full">
        <div className="flex flex-wrap w-[50vw] h-[294px] max-w-[410px]">
          {
            // Will render first from editing (if editing), or currentSet (if at least 1 filterSet), or defaultSet if first two conditions fail
            Object.entries(
              editing || filterSets[currentIndex] || defaultFilterSet
            ).map(([key, value]) => {
              //check to ensure boolean 'value' passed
              if (key === 'label' || key === 'filterSetId') return;
              return (
                <Filter
                  key={key}
                  editing={editing}
                  name={key}
                  isEnabled={value as boolean}
                  onClick={handleFilterChange}
                />
              );
            })
          }
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
  onChange: (e: string) => void;
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
      value={editing && isSelected ? editing.label : label}
      onChange={(e) => onChange(e.currentTarget.value)}
      className={`w-[calc(100%-30px)] text-black focus:outline-none mt-[1px] mb-[1px] pl-2 pr-2 select-none cursor-pointer ${
        isSelected ? 'bg-myyellow' : 'bg-mywhite'
      }`}
      // allow editing (readOnly=false) if isSelected, editing are both truthy
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
  name: string;
  isEnabled: boolean;
  editing: FilterSet | UnsavedFilterSet | undefined;
  onClick: (key: string) => void;
};

function Filter({ name, isEnabled, onClick, editing }: FilterProps) {
  const titleMappings: Record<string, string> = {
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
  const title = titleMappings[name];
  return (
    <div className="flex max-w-[410px] w-[calc(50%-6.5vw)] justify-end mr-[6.5vw]  sm:w-[calc(50%-55px)] sm:mr-[55px]">
      <label
        onClick={() => onClick(name)}
        className="flex items-center justify-end text-[13px] flex-wrap cursor-pointer sm:flex-nowrap">
        <span className="w-full justify-end mr-[5px] flex whitespace-nowrap">
          {title}
        </span>
        <Switch
          checked={editing ? editing[name] : isEnabled}
          onClick={() => onClick(name)}
          onChange={() => {}} // requires onChange, though only works right when the function is passed to onClick -> so giving it a nothing fn
          className="react-switch"
        />
      </label>
    </div>
  );
}
