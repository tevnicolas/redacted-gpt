import { Outlet, NavLink } from 'react-router-dom';
import { LoggedIn } from './LoggedIn';
import { LuMenuSquare } from 'react-icons/lu';
import { useState } from 'react';

export function Header() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [loginBox, setLoginBox] = useState(false);

  function handleLoginClick() {
    setLoginBox((prev) => !prev);
    if (mobileMenu) {
      setMobileMenu(false);
    }
  }
  function handleMobileClick() {
    setMobileMenu((prev) => !prev);
    if (loginBox) {
      setLoginBox(false);
    }
  }

  return (
    <>
      <div className="flex justify-between w-full">
        <div className="w-[120px] min-w-[120px]">
          <img src="/images/logo.png" className="w-full" />
        </div>
        <div className="hidden [@media(width>=767px)]:flex flex items-center bg-mywhite mt-[14px] rounded-[40px] w-[410px] h-14">
          <div className="flex w-[97%] justify-center ml-[5px]">
            <Page text="Home" />
            <Page text="Filter Sets" />
            <Page text="About" />
            <Page text="Support" />
          </div>
        </div>
        <div className="flex flex-nowrap justify-end [@media(width<=767px)]:justify-start w-[120px] min-w-[120px]">
          <LoggedIn
            status={false}
            loginBox={loginBox}
            onClick={handleLoginClick}
          />
          <div className="hidden [@media(width<=767px)]:block m-[14px]">
            <LuMenuSquare
              className="w-[40px] h-[40px]"
              onClick={handleMobileClick}
            />
          </div>
        </div>
      </div>
      {mobileMenu && (
        <div className="hidden z-10 [@media(width<=767px)]:flex flex flex-wrap items-center justify-center fixed bg-mywhite top-[100px] right-[75px] w-[20vw] min-w-[150px] h-[350px] rounded-[20px]">
          <Page text="Home" />
          <Page text="Filter Sets" />
          <Page text="About" />
          <Page text="Support" />
        </div>
      )}
      <Outlet />
    </>
  );
}

type PageProps = {
  text: string;
};

function Page({ text }: PageProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        'flex justify-center items-center rounded-[40px] w-[100px] h-10 m-[4px]' +
        (isActive ? ' bg-myyellow' : ' bg-mywhite') +
        ' hover:bg-myyellow'
      }
      to={
        text === 'Home'
          ? '/'
          : text === 'Filter Sets'
          ? 'filter-sets'
          : text === 'About'
          ? '/about'
          : '/support'
      }>
      <h2 className="text-black text-[15px]">{text}</h2>
    </NavLink>
  );
}
