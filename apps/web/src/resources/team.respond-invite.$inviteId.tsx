import { href, useFetcher } from 'react-router';

import { getORPCClient } from '@/lib/middlewares.server';
import { createValidator } from '@/lib/validator';
import { Button } from '@gaming/ui/components/button';
import { toast } from '@gaming/ui/components/sonner';
import { Spinner } from '@gaming/ui/components/spinner';
import { RespondToInviteSchema } from '@gaming/zod';
import { isDefinedError, safe } from '@orpc/server';
import { CheckIcon, XIcon } from 'lucide-react';

import type { Route } from './+types/team.respond-invite.$inviteId';

const validator = createValidator(RespondToInviteSchema);

export async function action({ context, request }: Route.ActionArgs) {
  const rpc = getORPCClient(context);

  const [fieldErrors, input] = await validator.validate(await request.json());
  if (fieldErrors) return { fieldErrors };

  const [error, data] = await safe(rpc.team.respondToInvite(input));
  if (isDefinedError(error)) return { error: error.message };
  else if (error)
    return { error: 'Unable to respond to invite, an unexpected error occurred.' };
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
  action: 'accept' | 'reject';
  variant?: 'default' | 'outline' | 'destructive';
  children?: React.ReactNode;
};

export function RespondToInviteButton({ inviteId, action, variant, children }: Props) {
  const respond = useFetcher();

  const handleRespond = async () => {
    await respond.submit(
      { inviteId, action },
      {
        method: 'post',
        encType: 'application/json',
        action: href('/resource/team/respond-invite/:inviteId', { inviteId }),
      },
    );
  };

  const isLoading = respond.state !== 'idle';
  const buttonVariant = variant || (action === 'accept' ? 'default' : 'destructive');

  return (
    <Button
      variant={buttonVariant}
      size="sm"
      onClick={handleRespond}
      disabled={isLoading}
      aria-label={action === 'accept' ? 'Accept Invite' : 'Reject Invite'}
    >
      {isLoading ? (
        <Spinner />
      ) : action === 'accept' ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <XIcon className="h-4 w-4" />
      )}
      {children || (action === 'accept' ? 'Accept' : 'Reject')}
    </Button>
  );
}
