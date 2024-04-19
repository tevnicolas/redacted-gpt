import { Outlet, NavLink } from 'react-router-dom';
import { LoggedIn } from './LoggedIn';

export function Header() {
  return (
    <>
      <div className="flex justify-between w-full">
        <div className="w-[120px] min-w-[120px]">
          <img src="/images/logo.png" className="w-full" />
        </div>
        <div className="hidden [@media(width>=767px)]:block flex items-center bg-mywhite mt-[14px] rounded-[40px] w-[410px] h-14">
          <div className="flex w-[97%] justify-center ml-[5px]">
            <Page text="Home" />
            <Page text="Filter Sets" />
            <Page text="About" />
            <Page text="Support" />
          </div>
        </div>
        <div className="flex flex-wrap justify-end w-[120px] min-w-[120px]">
          <LoggedIn status={false} />
        </div>
      </div>
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
