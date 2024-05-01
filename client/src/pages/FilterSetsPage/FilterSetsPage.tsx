import { useState } from 'react';
import { useFilterSets } from '../../components/useFilterSets';
import { FilterSet, UnsavedFilterSet } from '../../lib/data';
import { defaultFilterSet } from '../../lib/default-filter-set';
import { Button } from '../../components/Button';
import { Log } from './Log';
import { AddButton } from './AddButton';
import { Filter } from './Filter';

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
    if (!filterSets.length) {
      addFilterSet(defaultFilterSet);
      setCurrentIndex(0); // not sure if necessary, test when delete implemented
      setEditing(defaultFilterSet);
      return;
    }
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
                <Log
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
              if (typeof value !== 'boolean') return; // only filters render
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
