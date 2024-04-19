import { Link } from 'react-router-dom';
import { Button } from './Button';

type LoggedInProps = {
  status: boolean;
  loginBox: boolean;
  onClick: () => void;
};

export function LoggedIn({ status, loginBox, onClick }: LoggedInProps) {
  return (
    <>
      <div
        onClick={onClick}
        className="flex justify-center items-center cursor-pointer mt-[14px] bg-myyellow rounded-[40px] w-[70px] h-10">
        <h2 className="font-Righteous text-[14px]">
          {status ? 'Acc.' : 'Login'}
        </h2>
      </div>
      {loginBox && (
        <div className="flex flex-wrap justify-end absolute top-[98px] w-[200px] [@media(width<=767px)]:right-[130px] [@media(width<=335px)]:left-[20px]">
          <div className="h-0 w-0 border-x-[8px] border-x-transparent border-b-[13px] border-b-black mr-[10px] mb-[5px]"></div>
          <div className="bg-mywhite rounded-[18px] w-full">
            <form className="m-[15px]">
              <LoginEntry type="user" size={11} />
              <LoginEntry type="password" size={11} />
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

type EntryProps = {
  type: string;
  size: number;
};

export function LoginEntry({ type, size }: EntryProps) {
  return (
    <div className="flex items-center m-[5px]">
      <div className="min-w-[50px]">
        <p className="text-right font-Righteous text-[inherit] mr-[10px]">
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
