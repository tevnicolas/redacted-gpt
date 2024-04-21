import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LogIn, Triangle } from './LogIn';
import { LuMenuSquare } from 'react-icons/lu';
import { useState } from 'react';
import { FadeInWrapper } from './FadeInWrapper';

export function Header() {
  const location = useLocation();
  const [mobileMenuDropdown, setMobileMenuDropdown] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);

  function handleLoginClick() {
    setLoginDropdown((prev) => !prev);
    if (mobileMenuDropdown) {
      setMobileMenuDropdown(false);
    }
  }
  function handleMobileClick() {
    setMobileMenuDropdown((prev) => !prev);
    if (loginDropdown) {
      setLoginDropdown(false);
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
          <LogIn
            status={false}
            loginDropdown={loginDropdown}
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
      {mobileMenuDropdown && (
        <div className="hidden [@media(width<=767px)]:flex flex flex-wrap justify-end absolute top-[80px] right-[49px]">
          <Triangle />
          <div className="z-10 flex flex-wrap items-center justify-center bg-mywhite w-[20vw] min-w-[150px] h-[350px] rounded-[20px]">
            <Page text="Home" />
            <Page text="Filter Sets" />
            <Page text="About" />
            <Page text="Support" />
          </div>
        </div>
      )}
      <FadeInWrapper key={location.pathname}>
        <Outlet />
      </FadeInWrapper>
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
        (isActive ? ' bg-myyellow' : ' bg-mywhite hover:bg-myconcrete') +
        ' transition-colors duration-300 ease-in-out'
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
