import { Form, Link, href, redirect } from 'react-router';

import { authClient } from '@gaming/auth/client';
import { Button } from '@gaming/ui/components/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@gaming/ui/components/field';
import { Input } from '@gaming/ui/components/input';
import { cn } from '@gaming/ui/lib/utils';
import { SignInFormSchema } from '@gaming/zod';
import { GithubIcon } from 'lucide-react';
import z from 'zod';

import type { Route } from './+types/_auth.sign-in';

export async function clientAction({ request }: Route.ClientActionArgs) {
  const { data: formData, error: formError } = SignInFormSchema.safeParse(
    Object.fromEntries(await request.formData()),
  );

  if (formError) return z.flattenError(formError);

  const { error } = await authClient.signIn.email({
    email: formData.email,
    password: formData.password,
  });

  if (error) return { formErrors: [error.message], fieldErrors: null };

  return redirect(href('/dashboard'));
}

export default function SignIn({ actionData }: Route.ComponentProps) {
  const { formErrors, fieldErrors } = actionData || {};
  return (
    <Form noValidate method="POST" className={cn('flex flex-col gap-6')}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>

          {formErrors &&
            formErrors?.map(e => (
              <p key={e} className="text-sm text-destructive">
                {e}
              </p>
            ))}
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" name="email" placeholder="m@example.com" required />
          {fieldErrors?.email && <FieldError>{fieldErrors.email}</FieldError>}
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" name="password" type="password" required />
          {fieldErrors?.password && <FieldError>{fieldErrors.password}</FieldError>}
          <FieldDescription>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </FieldDescription>
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
    </Form>
  );
}
