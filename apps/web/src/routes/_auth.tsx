import { Link, Outlet } from 'react-router';

import { ArrowLeftIcon, TrophyIcon } from 'lucide-react';

import type { Route } from './+types/_auth';

export default function AuthLayout({ matches }: Route.ComponentProps) {
  const isSignIn = matches?.at(-1)?.pathname === '/sign-in';
  const isSignUp = matches?.at(-1)?.pathname === '/sign-up';

  let imageSrc = '';
  if (isSignIn) imageSrc = '/sign-in.png';
  if (isSignUp) imageSrc = '/sign-up.jpg';

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="group flex items-center gap-2">
            <ArrowLeftIcon className="mr-2 h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <TrophyIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">BattleStage</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={imageSrc}
          alt="Image"
          width={720}
          height={900}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
        <div className="absolute inset-0 pointer-events-none bg-g bg-gradient-to-r from-primary/20 to-accent/20" />
      </div>
    </div>
  );
}
