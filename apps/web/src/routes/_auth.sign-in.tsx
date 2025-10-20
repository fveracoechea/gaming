import { Link, href } from 'react-router';

import { Button } from '@gaming/ui/components/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@gaming/ui/components/field';
import { Input } from '@gaming/ui/components/input';
import { cn } from '@gaming/ui/lib/utils';
import { GithubIcon } from 'lucide-react';

export default function SignIn() {
  return (
    <form className={cn('flex flex-col gap-6')}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </Field>
        <Field>
          <Button type="submit">Login</Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button">
            <GithubIcon className="fill-current" />
            <span>Login with GitHub</span>
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{' '}
            <Link to={href('/sign-up')} className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
