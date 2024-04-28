import { useState, MouseEvent } from 'react';
import Switch from 'react-switch';

export function FilterSetsPage() {
  const [checked, setChecked] = useState(false);
  function handleChange() {
    setChecked((prev) => !prev);
  }
  console.log('');
  return (
    <div className="flex flex-wrap justify-center">
      <div className="flex justify-center w-full">
        <div className="flex relative justify-center bg-mywhite rounded-[40px] w-[50vw] h-[294px] max-w-[410px]">
          <div className="m-[30px] w-full max-w-[410px] overflow-y-scroll">
            <LoggedSet onClick={console.log} />
            <LoggedSet onClick={console.log} />
          </div>
          <div className="flex absolute w-8 h-8 rounded-[40px] bg-myyellow right-8 top-4">
            <div className="relative flex justify-center items-center w-full h-full">
              <div className="absolute bg-black w-4 h-[3px] rounded-[40px]" />
              <div className="absolute bg-black h-4 w-[3px] rounded-[40px]" />
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

type LoggedSetProps = {
  onClick: (e: string) => void;
};

function LoggedSet({ onClick }: LoggedSetProps) {
  const [isClicked, setIsClicked] = useState(false);

  function handleClick(e: MouseEvent<HTMLInputElement>) {
    setIsClicked((prev) => !prev);
    onClick(e.currentTarget.value);
  }
  return (
    <input
      className={`w-[calc(100%-30px)] bg-myconcrete border-[1px] border-mygray mt-[1px] mb-[1px] pl-2 pr-2 ${
        isClicked ? 'z-10' : 'z-0'
      }`}
      readOnly={true}
      onClick={(e) => handleClick(e)}
    />
  );
}
