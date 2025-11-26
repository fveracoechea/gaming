import { useForm } from 'react-hook-form';
import { href, useFetcher } from 'react-router';

import { getORPCClient } from '@/lib/middlewares.server';
import { createValidator } from '@/lib/validator';
import { Button } from '@gaming/ui/components/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@gaming/ui/components/field';
import { Input } from '@gaming/ui/components/input';
import { toast } from '@gaming/ui/components/sonner';
import { Spinner } from '@gaming/ui/components/spinner';
import { CreateOrUpdateTeamSchema } from '@gaming/zod';
import { isDefinedError, safe } from '@orpc/server';

import type { Route } from './+types/team.edit.$teamId';

const validator = createValidator(CreateOrUpdateTeamSchema);

export async function action({ context, request, params: { teamId } }: Route.ActionArgs) {
  const rpc = getORPCClient(context);

  const [fieldErrors, formValues] = await validator.validate(await request.json());
  if (fieldErrors) return { fieldErrors };

  const { error } = await safe(rpc.team.edit({ teamId, update: formValues }));
  if (isDefinedError(error)) return { error: error.message };
  else if (error) return { error: 'Unable to edit team, an unexpected error occurred.' };
  return { success: 'Team updated successfully.' };
}

export async function clientAction({ serverAction }: Route.ClientActionArgs) {
  const result = await serverAction();
  if (result.error) toast.error(result.error);
  if (result.success) toast.success(result.success);
  return result.fieldErrors;
}

type Props = {
  team: {
    id: string;
    name: string;
    logoUrl: string | null;
    description: string | null;
  };
};

export function TeamEditForm({ team }: Props) {
  const fetcher = useFetcher();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    errors: fetcher.data,
    resolver: validator.resolver,
    values: {
      name: team.name || '',
      logoUrl: team.logoUrl || '',
      description: team.description || '',
    },
  });

  const onSubmit = handleSubmit(async fields => {
    await fetcher.submit(fields, {
      method: 'post',
      encType: 'application/json',
      action: href('/resource/team/edit/:teamId', { teamId: team.id }),
    });
  });

  return (
    <form noValidate method="post" onSubmit={onSubmit}>
      <FieldGroup>
        <Field data-invalid={!!errors?.name}>
          <FieldLabel htmlFor="team-name">Team Name</FieldLabel>
          <Input
            id="team-name"
            required
            placeholder="Unique name identifying your team."
            aria-invalid={!!errors?.name}
            {...register('name')}
          />
          {errors?.name && <FieldError errors={[errors?.name]} />}
        </Field>

        <Field data-invalid={!!errors?.logoUrl}>
          <FieldLabel htmlFor="team-logo">Logo URL</FieldLabel>
          <Input
            id="team-logo"
            placeholder="External image link (180x180 recommended)."
            aria-invalid={!!errors?.logoUrl}
            {...register('logoUrl')}
          />
          {errors?.logoUrl && <FieldError errors={[errors?.logoUrl]} />}
        </Field>

        <Field data-invalid={!!errors?.description}>
          <FieldLabel htmlFor="team-desc">Description / Bio</FieldLabel>
          <textarea
            id="team-desc"
            placeholder="Tell others what your squad excels at."
            className="min-h-32 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            aria-invalid={!!errors?.description}
            {...register('description')}
          />
          {errors?.description && <FieldError errors={[errors?.description]} />}
        </Field>

        <Field orientation="horizontal" className="justify-end">
          {fetcher.state === 'idle' ? (
            <Button type="submit" variant="outline" disabled={!isDirty}>
              Save Changes
            </Button>
          ) : (
            <Button disabled variant="outline">
              <Spinner />
              <span>Saving...</span>
            </Button>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
}
