import { Link, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { FormEvent, useEffect, useState } from 'react';
import { FadeInWrapper } from './FadeInWrapper';
import { useUser } from './useUser';
import { UnauthorizedError } from '../lib/errors-checks';

type LogInProps = {
  status: boolean;
  loginDropdown: boolean;
  onClick: () => void;
};

export function LogIn({ status, loginDropdown, onClick }: LogInProps) {
  const { handleSignIn, handleSignOut, token } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const navigate = useNavigate();
  const [hoverToggle, setHoverToggle] = useState(false);
  const hoverStyle = hoverToggle ? 'hover:bg-myyellow' : 'hover:bg-mywhite';

  useEffect(() => {
    setHoverToggle((prev) => !prev);
    setError(undefined);
  }, [loginDropdown]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok && res.status === 401) {
        throw new UnauthorizedError('Email or Password is Incorrect.');
      } else if (!res.ok) {
        throw new Error('Oops! Something went wrong.');
      }
      const { user, token } = await res.json();
      handleSignIn(user, token);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

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
        <FadeInWrapper className="flex flex-wrap justify-end absolute top-[80px] w-[200px] right-[49px] [@media(width<=767px)]:right-[108px] [@media(width<=335px)]:left-[20px] z-10">
          <Triangle />
          <div className="bg-mywhite rounded-[18px] w-full">
            <form className="m-[15px]" onSubmit={handleSubmit}>
              {!token ? (
                <>
                  <UserPassEntry type="user" size={11} />
                  <UserPassEntry type="password" size={11} />
                  <div className="flex justify-between m-[10px]">
                    <Button text="Login" />
                    <Link to="/sign-up">
                      <Button
                        type="button"
                        text="Sign Up"
                        disabled={isLoading}
                        onClick={() => navigate('/sign-up')}
                      />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {/* <p>{user?.userId}</p> put userId in local storage*/}
                  <Button
                    type="button"
                    text="Sign Out"
                    disabled={isLoading}
                    onClick={handleSignOut}
                  />
                </>
              )}
              {!!error && <p className="text-red-500">{String(error)}</p>}
            </form>
          </div>
        </FadeInWrapper>
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
        name={type === 'user' ? 'username' : 'password'}
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
