import { Link } from 'react-router-dom';
import { Button } from './Button';
import { useEffect, useState } from 'react';

type LogInProps = {
  status: boolean;
  loginDropdown: boolean;
  onClick: () => void;
};

export function LogIn({ status, loginDropdown, onClick }: LogInProps) {
  const [hoverToggle, setHoverToggle] = useState(false);
  const hoverStyle = hoverToggle ? 'hover:bg-myyellow' : 'hover:bg-mywhite';
  useEffect(() => {
    setHoverToggle((prev) => !prev);
  }, [loginDropdown]);
  return (
    <>
      <div
        onClick={onClick}
        onMouseEnter={() => setHoverToggle(false)}
        onMouseLeave={() => setHoverToggle(false)}
        className={
          'flex justify-center items-center cursor-pointer mt-[14px] bg-myyellow rounded-[40px] w-[70px] h-10 ' +
          hoverStyle
        }>
        <h2 className="font-Righteous text-[14px] select-none">
          {status ? 'Acc.' : 'Log in'}
        </h2>
      </div>
      {loginDropdown && (
        <div className="flex flex-wrap justify-end absolute top-[80px] w-[200px] right-[49px] [@media(width<=767px)]:right-[108px] [@media(width<=335px)]:left-[20px] z-10">
          <Triangle />
          <div className="bg-mywhite rounded-[18px] w-full">
            <form className="m-[15px]">
              <UserPassEntry type="user" size={11} />
              <UserPassEntry type="password" size={11} />
              <div className="flex justify-between m-[10px]">
                <Button text="Login" />
                <Link to="/sign-up">
                  <Button type="button" text="Sign Up" />
                </Link>
              </div>
              <p>error</p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

type UserPassEntryProps = {
  type: string;
  size: number;
};

export function UserPassEntry({ type, size }: UserPassEntryProps) {
  return (
    <div className="flex items-center m-[5px]">
      <div className="min-w-[50px]">
        <p className="text-right font-Righteous text-[inherit] mr-[10px] select-none">
          {type === 'user' ? 'email:' : 'pass:'}
        </p>
      </div>
      <input
        type={type === 'user' ? 'text' : 'password'}
        size={size}
        className="bg-myconcrete pl-1 pr-1 max-h-[22px]"
      />
    </div>
  );
}

export function Triangle() {
  return (
    <div className="flex w-full justify-end">
      <div className="h-0 w-0 border-x-[8px] border-x-transparent border-b-[13px] border-b-black mr-[10px] mb-[5px]" />
    </div>
  );
}
