import { UserPassEntry } from '../../components/LogIn';
import { Button } from '../../components/Button';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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
      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const user = await res.json();
      console.log('Registered', user);
      alert(
        `Successfully registered ${user.username} as userId ${user.userId}.`
      );
      navigate('/', { state: { from: '/sign-up' } });
    } catch (error) {
      alert(`Error registering user: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex justify-center items-center rounded-[500px] bg-myyellow h-[500px] w-[500px]">
        <form className="m-[10px]" onSubmit={handleSubmit}>
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
            <UserPassEntry type="user" size={15} />
          </div>
          <div className="flex mb-[20px] text-[22px]">
            <UserPassEntry type="password" size={15} />
          </div>
          <div className="flex justify-center mb-[40px] mt-[50px]">
            <div
              className="flex justify-between w-[200px]"
              onClick={() => navigate('/', { state: { from: '/sign-up' } })}>
              <p className="underline">Log in...</p>
              <Button text="Submit" disabled={isLoading} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
