import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { User } from 'firebase/auth';
import Login from './Components/Login';
import UserCard from './Components/UserCard';
import ViewOffOverlay from './Components/ViewOffOverlay';
import SmallScreenOverlay from './Components/SmallScreenOverlay';
import ClockComponent from './Components/ClockComponent';
import TimerComponent from './Components/TimerComponent';
import ChatBotComponent from './Components/ChatBotComponent';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      try {
        if (u) {
          localStorage.setItem(
            'user',
            JSON.stringify({
              uid: u.uid,
              displayName: u.displayName,
              email: u.email,
              photoURL: u.photoURL,
            })
          );
        } else {
          localStorage.removeItem('user');
        }
      } catch {
        // ignore storage failures
      }
    });

    return () => unsubscribe();
  }, []);


  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Login />
      </div>
    );
  }

  return (
    <div className='height-screen overflow-hidden relative'>
      <div className='pt-1.5 new-glass height-screen'>
        <button
          type="button"
          onClick={() => setView(!view)}
          className="fixed top-4 left-4 z-[10000] accent-btn rounded-2xl p-2 shadow-lg transition-transform glass border border-[rgba(255,255,255,0.05)] group pointer-events-auto"
        >
          {view ? (
              <svg
                width="32px"
                height="32px"
                viewBox="0 0 24.00 24.00"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#ffffff"
                transform="matrix(1, 0, 0, 1, 0, 0)"
                className="transition-transform duration-300 ease-out group-hover:scale-105 group-active:scale-95 group-hover:drop-shadow-[0_0_10px_rgba(203,166,247,0.4)]"
              ><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier" ></g><g id="SVGRepo_iconCarrier"> <g id="style=linear"> <g id="eye-close"> <path id="vector" d="M15.6487 5.39489C14.4859 4.95254 13.2582 4.72021 12 4.72021C8.46997 4.72021 5.17997 6.54885 2.88997 9.71381C1.98997 10.9534 1.98997 13.037 2.88997 14.2766C3.34474 14.9051 3.83895 15.481 4.36664 16.0002M19.3248 7.69653C19.9692 8.28964 20.5676 8.96425 21.11 9.71381C22.01 10.9534 22.01 13.037 21.11 14.2766C18.82 17.4416 15.53 19.2702 12 19.2702C10.6143 19.2702 9.26561 18.9884 7.99988 18.4547" stroke="#cdd6f4" ></path> <path id="vector_2" d="M15 12C15 13.6592 13.6592 15 12 15M14.0996 9.85541C13.5589 9.32599 12.8181 9 12 9C10.3408 9 9 10.3408 9 12C9 12.7293 9.25906 13.3971 9.69035 13.9166" stroke="#cdd6f4" ></path> <path id="vector_3" d="M2 21.0002L22 2.7002" stroke="#cdd6f4" strokeLinecap="round"></path> </g> </g> </g></svg>
          ) : (
              <svg
                width="32px"
                height="32px"
                viewBox="0 0 24.00 24.00"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 ease-out group-hover:scale-105 group-active:scale-95 group-hover:drop-shadow-[0_0_10px_rgba(203,166,247,0.4)]"
              ><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier" ></g><g id="SVGRepo_iconCarrier"> <g id="style=linear"> <g id="eye-open"> <path id="vector" d="M15 12C15 13.6592 13.6592 15 12 15C10.3408 15 9 13.6592 9 12C9 10.3408 10.3408 9 12 9C13.6592 9 15 10.3408 15 12Z" stroke="#cdd6f4" ></path> <path id="vector_2" d="M12 19.27C15.53 19.27 18.82 17.4413 21.11 14.2764C22.01 13.0368 22.01 10.9532 21.11 9.71356C18.82 6.54861 15.53 4.71997 12 4.71997C8.46997 4.71997 5.17997 6.54861 2.88997 9.71356C1.98997 10.9532 1.98997 13.0368 2.88997 14.2764C5.17997 17.4413 8.46997 19.27 12 19.27Z" stroke="#cdd6f4" ></path> </g> </g> </g></svg>
          )}
        </button>
      </div>
      <div
        className={`flex items-center justify-center px-4 transition-all duration-500 ${
          view
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto ease-out'
            : 'opacity-0 translate-y-6 scale-95 pointer-events-none ease-in'
        }`}
      >
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-4 grid-rows-3 gap-3 auto-rows-fr">
            <div className="col-start-1 col-end-2 row-start-1 row-end-2 rounded-2xl glass border border-[rgba(255,255,255,0.05)] p-5 flex flex-col justify-between">
              <UserCard user={user} onSignOut={() => auth.signOut()} />
            </div>
            <div className="col-start-2 col-end-4 row-start-1 row-end-3 rounded-2xl glass border border-[rgba(255,255,255,0.05)] p-8 flex flex-col justify-between" >
              Calendar / Events
            </div>
            <div className="col-start-4 col-end-5 row-start-1 row-end-2 rounded-2xl glass border border-[rgba(255,255,255,0.05)] p-2 flex flex-col justify-between" >
              <TimerComponent />
            </div>
            <div className="col-start-1 col-end-2 row-start-2 row-end-4 rounded-2xl glass border border-[rgba(255,255,255,0.05)] p-2 flex flex-col gap-4" >
              <ChatBotComponent />
            </div>
            <div className="col-start-4 col-end-5 row-start-2 row-end-3 rounded-2xl glass border border-[rgba(255,255,255,0.05)] p-2 flex flex-col justify-between" >
              <ClockComponent />
            </div>
            <div className="col-start-4 col-end-5 row-start-3 row-end-4 rounded-2xl glass border border-[rgba(255,255,255,0.05)] p-5 flex flex-col justify-between" >
            </div>
            <div className="col-start-2 col-end-3 row-start-3 row-end-4 rounded-2xl glass border border-[rgba(255,255,255,0.05)] p-5 flex flex-col justify-between" >
              Notes / To-Do
            </div>
            <div className="col-start-3 col-end-4 row-start-3 row-end-4 rounded-2xl glass border border-[rgba(255,255,255,0.05)] p-5 flex flex-col justify-between" >
              Streak / Stats
            </div>
          </div>
        </div>
      </div>
      <ViewOffOverlay view={view} />
      <SmallScreenOverlay />
    </div>
  );
};

export default App;