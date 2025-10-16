import { ArrowLeftIcon, TrophyIcon } from "lucide-react";
import { Link, Outlet } from "react-router";

import type { Route } from "./+types/_auth";

export default function AuthLayout({ matches }: Route.ComponentProps) {
  const isSignIn = matches?.at(-1)?.pathname === "/sign-in";
  const isSignUp = matches?.at(-1)?.pathname === "/sign-up";

  let imageSrc = "";
  if (isSignIn) imageSrc = "/sign-in.png";
  if (isSignUp) imageSrc = "/sign-up.jpg";

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 group">
            <ArrowLeftIcon className="h-5 w-5 text-muted-foreground mr-2 transition-transform group-hover:translate-x-1" />
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
      <div className="bg-muted relative hidden lg:block">
        <img
          src={imageSrc}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover brightness-50 blur-[1px]"
        />
      </div>
    </div>
  );
}
