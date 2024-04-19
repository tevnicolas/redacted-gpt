import { useState } from 'react';
import Switch from 'react-switch';

export function FilterSets() {
  const [checked, setChecked] = useState(false);
  function handleChange() {
    setChecked((prev) => !prev);
  }
  return (
    <div className="flex">
      <div className="bg-mywhite rounded-[40px] w-[300px] h-[300px]"></div>
      <div>
        <label>
          <Switch
            checked={checked}
            onChange={handleChange}
            className="react-switch"
          />
        </label>
      </div>
    </div>
  );
}
