import { href, useFetcher } from 'react-router';

import { getORPCClient } from '@/lib/middlewares.server';
import { createValidator } from '@/lib/validator';
import { Button } from '@gaming/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@gaming/ui/components/dialog';
import { toast } from '@gaming/ui/components/sonner';
import { Spinner } from '@gaming/ui/components/spinner';
import { WithdrawInviteSchema } from '@gaming/zod';
import { isDefinedError, safe } from '@orpc/server';
import { XIcon } from 'lucide-react';

import type { Route } from './+types/team.withdraw-invite.$inviteId';

const validator = createValidator(WithdrawInviteSchema);

export async function action({ context, request }: Route.ActionArgs) {
  const rpc = getORPCClient(context);

  const [fieldErrors, input] = await validator.validate(await request.json());
  if (fieldErrors) return { fieldErrors };

  const [error, data] = await safe(rpc.team.withdrawInvite(input));
  if (isDefinedError(error)) return { error: error.message };
  else if (error) return { error: 'Unable to withdraw invite, an unexpected error occurred.' };
  return { success: data.message };
}

export async function clientAction({ serverAction }: Route.ClientActionArgs) {
  const result = await serverAction();
  if (result.error) toast.error(result.error);
  if (result.fieldErrors) return result.fieldErrors;
  if (result.success) {
    toast.success(result.success);
    return { success: true };
  }
}

type Props = {
  inviteId: string;
  playerName: string;
};

export function WithdrawInviteButton({ inviteId, playerName }: Props) {
  const withdraw = useFetcher();

  const handleWithdraw = async () => {
    await withdraw.submit(
      { inviteId },
      {
        method: 'post',
        encType: 'application/json',
        action: href('/resource/team/withdraw-invite/:inviteId', { inviteId }),
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Withdraw Invite">
          <XIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Invite</DialogTitle>
          <DialogDescription>
            Are you sure you want to withdraw the invite sent to {playerName}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {withdraw.state === 'idle' ? (
            <Button variant="destructive" onClick={handleWithdraw}>
              Withdraw Invite
            </Button>
          ) : (
            <Button disabled>
              <Spinner />
              <span>Withdrawing...</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
