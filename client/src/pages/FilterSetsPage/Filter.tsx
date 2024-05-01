import Switch from 'react-switch';
import { FilterSet, UnsavedFilterSet } from '../../lib/data';
import { titleMappings } from '../../lib/title-mappings';

type FilterProps = {
  name: string;
  isEnabled: boolean;
  editing: FilterSet | UnsavedFilterSet | undefined;
  onClick: (key: string) => void;
};

export function Filter({ name, isEnabled, onClick, editing }: FilterProps) {
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
