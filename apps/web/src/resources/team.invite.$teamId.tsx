import { useFieldArray, useForm } from 'react-hook-form';
import { href, redirect, useFetcher } from 'react-router';

import { getORPCClient } from '@/lib/middlewares.server';
import { createValidator } from '@/lib/validator';
import { Badge } from '@gaming/ui/components/badge';
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
import { getInitials } from '@gaming/ui/lib/utils';
import { InvitePlayersToTeamSchema } from '@gaming/zod';
import { isDefinedError, safe } from '@orpc/server';
import { TrashIcon } from 'lucide-react';

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
  const invite = useFetcher();

  const {
    reset,
    control,
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

  const players = useFieldArray({ control, name: 'players' });

  return (
    <Dialog>
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
              <PlayerSearchCombobox
                selectedPlayersIds={players.fields.map(p => p.id)}
                onSelectPlayer={newPlayer => {
                  if (players.fields.find(p => p.id === newPlayer.id)) return;
                  players.append({ id: newPlayer.id, name: newPlayer.name, role: 'MEMBER' });
                }}
              />
              <Field className="h-60 overflow-y-auto">
                {players.fields.map((player, idx) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between px-4  py-2 even:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-sm font-medium">
                        {getInitials(player.name)}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm leading-none font-medium">{player.name}</p>
                        <span className="text-xs text-muted-foreground">LOREM IPSUM</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{player.role}</Badge>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Remove Member"
                        onClick={() => players.remove(idx)}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </div>
                ))}
              </Field>
              <Field orientation="horizontal" className="justify-end">
                <DialogClose asChild onClick={() => reset({ players: [] })}>
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
