import type { PropsWithChildren } from 'react';
import { Link, Outlet, isRouteErrorResponse, useRouteLoaderData } from 'react-router';

import type { RootLoaderData } from '@/root';
import { Button } from '@gaming/ui/components/button';
import { Typography } from '@gaming/ui/components/typography';
import { ArrowLeftIcon, TriangleAlert, TrophyIcon } from 'lucide-react';

import type { Route } from './+types/_auth';

function AuthLayoutTemplate(props: PropsWithChildren<{ image: string }>) {
  const { children, image } = props;
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
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={image}
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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const data = useRouteLoaderData<RootLoaderData>('root');
  let stack: string | undefined;

  let headline = 'We ran into an unexpected issue';

  let message =
    'We apologize for the inconvenience. Please try again later. If the issue persists, contact support.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      headline = 'Page Not Found';
      message =
        'We couldn’t find what you were looking for. It might have moved or doesn’t exist';
    }
    if (error.status === 403) {
      headline = 'Oops! You don’t have access.';
      message = 'It looks like you don’t have permission to access this resource';
    }
  }

  if (data?.stage !== 'production' && error instanceof Error) {
    stack = error.stack;
  }

  if (data?.stage !== 'production') {
    console.warn(error);
  }

  return (
    <AuthLayoutTemplate image="/error.jpg">
      <section className="mx-auto flex flex-1 items-center pb-10">
        <div className="flex flex-col items-center gap-4">
          <TriangleAlert className="stroke-destructive-foreground h-24 w-24" />
          <div className="flex max-w-screen-md flex-col justify-center gap-0 text-center">
            <Typography.Large>{headline}</Typography.Large>
            <Typography.Muted>{message}</Typography.Muted>
          </div>
          <Button asChild>
            <Link to="/" replace>
              Go to Homepage
            </Link>
          </Button>

          {stack && (
            <div className="border-border max-w-full rounded-md border p-2 text-sm">
              <pre className="max-w-screen-2xl overflow-x-auto p-4">
                <code>{stack}</code>
              </pre>
            </div>
          )}
        </div>
      </section>
    </AuthLayoutTemplate>
  );
}

export default function AuthLayout({ matches }: Route.ComponentProps) {
  const isSignIn = matches?.at(-1)?.pathname === '/sign-in';
  const isSignUp = matches?.at(-1)?.pathname === '/sign-up';

  let image = '';
  if (isSignIn) image = '/sign-in.png';
  if (isSignUp) image = '/sign-up.jpg';

  return (
    <AuthLayoutTemplate image={image}>
      <Outlet />
    </AuthLayoutTemplate>
  );
}
