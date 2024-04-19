import { LoginEntry } from '../components/LoggedIn';
import { Button } from '../components/Button';

export function SignUp() {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex justify-center items-center rounded-[500px] bg-myyellow h-[500px] w-[500px]">
        <form className="m-[10px]">
          <div className="mb-[20px]">
            <h1 className="font-Righteous w-full">SignUp</h1>
          </div>
          <div className="mb-[36px]">
            <p>
              to save your filter sets across
              <br /> web sessions
            </p>
          </div>
          <div className="flex mb-[40px] text-[22px]">
            <LoginEntry type="user" size={15} />
          </div>
          <div className="flex mb-[20px] text-[22px]">
            <LoginEntry type="password" size={15} />
          </div>
          <div className="flex justify-center mb-[40px] mt-[50px]">
            <div className="flex justify-between w-[200px]">
              <p className="underline">Log in...</p>
              <Button text="Submit" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
