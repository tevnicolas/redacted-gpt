import { useState } from 'react';
import Switch from 'react-switch';

export function FilterSetsPage() {
  const [checked, setChecked] = useState(false);
  function handleChange() {
    setChecked((prev) => !prev);
  }
  return (
    <div className="flex flex-wrap justify-center">
      <div className="flex justify-center w-full">
        <div className="flex relative justify-center bg-mywhite rounded-[40px] w-[50vw] h-[294px] max-w-[410px]">
          <div className="m-[30px] w-full max-w-[410px] overflow-y-scroll">
            <LoggedSet />
            <LoggedSet />
            <LoggedSet />
            <LoggedSet />
            <LoggedSet />
            <LoggedSet />
            <LoggedSet />
            <LoggedSet />
            <LoggedSet />
            <LoggedSet />
            <LoggedSet />
          </div>
          <div className="flex absolute w-8 h-8 rounded-[40px] bg-myyellow right-8 top-4">
            <div className="relative flex justify-center items-center w-full h-full">
              <div className="absolute bg-mywhite w-4 h-[3px]" />
              <div className="absolute bg-mywhite h-4 w-[3px]" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <label>
          Hello
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

function LoggedSet() {
  return (
    <input className="w-[calc(100%-30px)] bg-myconcrete border-[1px] border-mygray" />
  );
}
