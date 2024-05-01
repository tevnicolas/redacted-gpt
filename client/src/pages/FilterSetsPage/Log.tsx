import { FilterSet } from 'shared/types';

type LogProps = {
  label: string; // whole set's label
  isSelected: boolean;
  onClick: () => void;
  editing: FilterSet | undefined;
  onChange: (e: string) => void;
};

export function Log({
  label,
  isSelected,
  onClick,
  editing,
  onChange,
}: LogProps) {
  // const inputRef = useRef<HTMLInputElement>(null);

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
      ref={(i) => i && editing && isSelected && i.focus()}
    />
  );
}
