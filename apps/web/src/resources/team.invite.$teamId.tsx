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
import { Field, FieldGroup } from '@gaming/ui/components/field';
import { toast } from '@gaming/ui/components/sonner';
import { Spinner } from '@gaming/ui/components/spinner';
import { InvitePlayersToTeamSchema, SearchPlayersSchema } from '@gaming/zod';
import { isDefinedError, safe } from '@orpc/server';

import type { Route } from './+types/team.invite.$teamId';
import { PlayerSearchCombobox } from './player.search.combobox';

const validator = createValidator(InvitePlayersToTeamSchema);

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

export function InvitePlayersToTeamDialog({ team }: Props) {
  const [open, setOpen] = useState(false);
  const invite = useFetcher();
  const players = useFetcher();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    errors: invite.data,
    resolver: validator.resolver,
    defaultValues: { teamId: team.id },
  });

  const onSubmit = handleSubmit(async fields => {
    await invite.submit(fields, {
      method: 'post',
      encType: 'application/json',
      action: href('/resource/team/invite/:teamId', { teamId: team.id }),
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
        <Button variant="outline">Invite Players</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Players</DialogTitle>
          <DialogDescription>
            Invite players to join the team by selecting them from the list below.
          </DialogDescription>
        </DialogHeader>
        <div>
          <form noValidate method="post" onSubmit={onSubmit}>
            <FieldGroup>
              <PlayerSearchCombobox />
              <Field orientation="horizontal" className="justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                {invite.state === 'idle' ? (
                  <Button type="submit" disabled={!isDirty}>
                    Send Invite
                  </Button>
                ) : (
                  <Button disabled>
                    <Spinner />
                    <span>Sending...</span>
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
