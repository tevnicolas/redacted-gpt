import { useEffect, useRef, useState } from 'react';
import { useFilterSets } from '../../components/useFilterSets';
import { FilterSet } from 'shared/types';
import {
  defaultFilterSet,
  isDefaultFilterSet,
} from '../../lib/default-filter-set';
import { Button } from '../../components/Button';
import { Log } from './Log';
import { AddButton } from './AddButton';
import { Filter } from './Filter';

export function FilterSetsPage() {
  const { filterSets, addFilterSet, commitFilterSetEdits, deleteFilterSet } =
    useFilterSets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editing, setEditing] = useState<FilterSet | undefined>();
  const shouldAddAfterSave = useRef(false);

  // This useEffect allows adding filters while editing is enabled. Prevents
  // race conditions between state renders.
  useEffect(() => {
    if (shouldAddAfterSave.current) {
      addFilterSet(defaultFilterSet);
      setCurrentIndex(0);
      setEditing(defaultFilterSet);
      shouldAddAfterSave.current = false;
    }
  }, [shouldAddAfterSave, addFilterSet]);

  function handleLabelChange(labelValue: string): void {
    if (!editing) return;
    if (labelValue === undefined) return;
    setEditing((prev) => {
      if (!prev) return; // clarifies prev type; will be defined
      return {
        ...prev,
        ['label']: labelValue,
      };
    });
    return;
  }

  function handleFilterChange(key: string): void {
    // when not editing, and while there's logged sets, filter changes disabled
    if (!editing && filterSets.length) return;
    // while not editing, and nothing is saved, changing filter creates new set
    if (!editing) handleEdit();
    setEditing((prev) => {
      if (!prev) return; // clarifies prev type; will be defined
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  }

  function handleAdd(): void {
    if (editing) {
      shouldAddAfterSave.current = true;
      if (isDefaultFilterSet(editing)) {
        deleteFilterSet(currentIndex);
        currentIndex ? setCurrentIndex(currentIndex - 1) : setCurrentIndex(0);
      } else {
        commitFilterSetEdits(editing, currentIndex);
      }
    } else {
      addFilterSet(defaultFilterSet);
      setCurrentIndex(0);
      setEditing(defaultFilterSet);
    }
  }

  function handleSelect(index: number): void {
    // if (editing) {
    //   commitFilterSetEdits(editing, currentIndex);
    // }
    if (editing) return; // implement selecting while editing later
    setCurrentIndex(index);
  }

  function handleEdit(): void {
    if (!filterSets.length) {
      addFilterSet(defaultFilterSet);
      setCurrentIndex(0);
      setEditing(defaultFilterSet);
      return;
    }
    setEditing(filterSets[currentIndex]);
  }

  function handleSave(): void {
    if (!editing) return;
    if (isDefaultFilterSet(editing)) {
      handleDelete();
    } else {
      commitFilterSetEdits(editing, currentIndex);
    }
    setEditing(undefined);
  }

  function handleRevert(): void {
    if (!editing) return; // clarifies type; will be defined
    if (isDefaultFilterSet(filterSets[currentIndex])) {
      handleDelete();
    } else {
      setEditing(undefined);
    }
    setEditing(undefined);
  }

  function handleDelete(): void {
    if (!editing) return;
    deleteFilterSet(currentIndex);
    currentIndex ? setCurrentIndex(currentIndex - 1) : setCurrentIndex(0);
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
                  onClick={() => handleSelect(index)}
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
                  onClick={handleRevert}
                />
              </div>
              <div className="flex w-full justify-start">
                <Button
                  type="button"
                  text="Delete"
                  className="bg-mygrey text-[13px] max-w-[55px]"
                  onClick={handleDelete}
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
            // Will first try rendering from editing (if editing), or next the current set (if one exists), or default set if both conditions fail
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
