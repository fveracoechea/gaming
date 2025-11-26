import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { href, redirect, useFetcher } from 'react-router';

import { getORPCClient } from '@/lib/middlewares.server';
import { createValidator } from '@/lib/validator';
import { Button } from '@gaming/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gaming/ui/components/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@gaming/ui/components/field';
import { Input } from '@gaming/ui/components/input';
import { toast } from '@gaming/ui/components/sonner';
import { Spinner } from '@gaming/ui/components/spinner';
import { Typography } from '@gaming/ui/components/typography';
import { DeleteTeamSchema } from '@gaming/zod';
import { isDefinedError, safe } from '@orpc/server';

import type { Route } from './+types/team.delete.$teamId';

const validator = createValidator(DeleteTeamSchema);

export async function action({ context, request, params: { teamId } }: Route.ActionArgs) {
  const rpc = getORPCClient(context);

  const [fieldErrors] = await validator.validate(await request.json());
  if (fieldErrors) return { fieldErrors };

  const [error, data] = await safe(rpc.team.deleteById({ teamId }));
  if (isDefinedError(error)) return { error: error.message };
  else if (error) return { error: 'Unable to delete team, an unexpected error occurred.' };
  return { success: data.message };
}

export async function clientAction({ serverAction }: Route.ClientActionArgs) {
  const result = await serverAction();
  if (result.error) toast.error(result.error);
  if (result.fieldErrors) return result.fieldErrors;
  if (result.success) {
    toast.success(result.success);
    return redirect(href('/dashboard/my-teams'));
  }
}

type Props = {
  team: {
    id: string;
    name: string;
  };
};

export function DeleteTeamDialog({ team }: Props) {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    errors: fetcher.data,
    resolver: validator.resolver,
    defaultValues: { teamId: team.id },
  });

  const onSubmit = handleSubmit(async fields => {
    await fetcher.submit(fields, {
      method: 'post',
      encType: 'application/json',
      action: href('/resource/team/delete/:teamId', { teamId: team.id }),
    });
  });

  return (
    <Dialog
      open={open}
      onOpenChange={value => {
        if (!value) reset();
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the team <b>{team.name}</b>?
          </DialogDescription>
        </DialogHeader>
        <div>
          <form noValidate method="post" onSubmit={onSubmit}>
            <FieldGroup>
              <Field data-invalid={!!errors?.comfirm}>
                <Typography.Small>
                  Type <b>I confirm that I want to delete this team</b> to confirm
                </Typography.Small>
                <Input
                  id="confirm"
                  required
                  aria-invalid={!!errors?.comfirm}
                  autoComplete="off"
                  {...register('comfirm')}
                />
                {errors?.comfirm && <FieldError errors={[errors?.comfirm]} />}
              </Field>

              <Field orientation="horizontal" className="justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                {fetcher.state === 'idle' ? (
                  <Button type="submit" variant="destructive" disabled={!isDirty}>
                    Delete
                  </Button>
                ) : (
                  <Button disabled variant="destructive">
                    <Spinner />
                    <span>Deleting...</span>
                  </Button>
                )}
              </Field>
            </FieldGroup>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
