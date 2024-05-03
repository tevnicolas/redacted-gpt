import { useState } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState<number | undefined>();
  const [editing, setEditing] = useState<FilterSet | undefined>();

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
    if (currentIndex === undefined) {
      handleSave();
    }
    setCurrentIndex(undefined);
    setEditing(defaultFilterSet);
  }

  function handleSelect(index: number): void {
    setCurrentIndex(index);
    if (editing) setEditing(filterSets[index]);
  }

  function handleEdit(): void {
    if (currentIndex !== undefined) {
      setEditing(filterSets[currentIndex]);
    } else {
      setEditing(defaultFilterSet);
    }
  }

  function handleSave(): void {
    if (!editing) return; // clarifies type; is defined
    if (currentIndex === undefined && filterSets.length) {
      setCurrentIndex(0);
    }
    if (currentIndex !== undefined) {
      if (isDefaultFilterSet(editing)) {
        deleteFilterSet(currentIndex);
        if (filterSets.length > 1) {
          setCurrentIndex(0);
        } else {
          setCurrentIndex(undefined);
        }
      } else {
        commitFilterSetEdits(editing, currentIndex);
        setCurrentIndex(0);
      }
    } else {
      if (isDefaultFilterSet(editing)) {
        // No action needed, keep currentIndex undefined
      } else {
        addFilterSet(editing);
        setCurrentIndex(0);
      }
    }
    setEditing(undefined);
  }

  function handleRevert(): void {
    if (!editing) return; // clarifies type; is defined
    if (currentIndex === undefined && filterSets.length) {
      setCurrentIndex(0);
    }
    setEditing(undefined);
  }

  function handleDelete(): void {
    if (!editing) return;
    if (currentIndex === undefined && filterSets.length) {
      setCurrentIndex(0);
    }
    if (currentIndex !== undefined) {
      deleteFilterSet(currentIndex);
      if (filterSets.length > 1) {
        currentIndex // is greater than 0
          ? setCurrentIndex(currentIndex - 1)
          : setCurrentIndex(0);
      } else {
        console.log('hello!');
        setCurrentIndex(undefined);
      }
    }
    setEditing(undefined);
  }

  return (
    <div className="flex flex-wrap justify-center">
      <div className="flex justify-center w-full">
        <div className="flex relative justify-center bg-mywhite rounded-[40px] w-[50vw] h-[294px] max-w-[410px]">
          <div className="m-[30px] w-full max-w-[410px] overflow-y-scroll">
            {editing && currentIndex === undefined && (
              <Log
                key={'editing'}
                label={editing.label}
                isSelected={true}
                onClick={() => {}}
                editing={editing}
                onChange={handleLabelChange}
              />
            )}
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
      <div className="flex w-full justify-center mt-5 mb-10">
        <div className="flex space-x-4 w-1/2 max-w-[410px] justify-between">
          {editing ? (
            <>
              <div className="flex w-full justify-end w-1/3">
                <Button
                  type="button"
                  text="Save"
                  className="bg-mygrey text-[13px] max-w-[55px]"
                  onClick={handleSave}
                />
              </div>
              <div className="flex w-full justify-center w-1/3">
                <Button
                  type="button"
                  text="Revert"
                  className="bg-mygrey text-[13px] max-w-[55px]"
                  onClick={handleRevert}
                />
              </div>
              <div className="flex w-full justify-start w-1/3">
                <Button
                  type="button"
                  text="Delete"
                  className="bg-mygrey text-[13px] max-w-[55px]"
                  onClick={handleDelete}
                />
              </div>
            </>
          ) : (
            <div className="flex w-full justify-end w-full">
              <div className="flex justify-start w-1/3">
                <Button
                  type="button"
                  text="Edit"
                  className="bg-mygrey text-[13px] max-w-[55px] ml-[11px]"
                  onClick={handleEdit}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center w-full">
        <div className="flex flex-wrap w-[50vw] h-[294px] max-w-[410px]">
          {
            // Will first try rendering from editing (if editing), or next the current set (if at least one has currently been saved), or default set if those conditions fail
            Object.entries(
              editing ||
                (currentIndex !== undefined && filterSets[currentIndex]) ||
                defaultFilterSet
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
