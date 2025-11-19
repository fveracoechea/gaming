import { Form, useFetcher } from 'react-router';

import { getORPCClient } from '@/lib/middlewares.server';
import { Badge } from '@gaming/ui/components/badge';
import { Button } from '@gaming/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gaming/ui/components/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@gaming/ui/components/field';
import { Input } from '@gaming/ui/components/input';
import { toast } from '@gaming/ui/components/sonner';
import { getInitials } from '@gaming/ui/lib/utils';
import { CreateTeamSchema } from '@gaming/zod';
import { safe } from '@orpc/server';
import { parseFormData } from '@remix-run/form-data-parser';
import { formatDistanceToNow } from 'date-fns';
import { TrashIcon } from 'lucide-react';
import z from 'zod';

import type { Route } from './+types/dashboard.teams.$teamId';

export async function action({ context, request, params: { teamId } }: Route.ActionArgs) {
  const rpc = getORPCClient(context);
  const formData = await parseFormData(request);

  const validation = CreateTeamSchema.transform(async (fields, ctx) => {
    const { error, data } = await safe(rpc.team.edit({ teamId, update: fields }));
    if (data) return data;
    ctx.addIssue({ code: 'custom', message: error.message });
    return z.NEVER;
  });

  const { error } = await validation.safeParseAsync(Object.fromEntries(formData));
  if (error) return z.flattenError(error);
  return null;
}

export async function clientAction({ serverAction }: Route.ClientActionArgs) {
  const errors = await serverAction();
  if (errors) {
    errors.formErrors?.forEach(e => toast.error(e));
    return errors;
  }
  toast.success('Team update successfully!');
  return null;
}

export async function loader({ context, params }: Route.LoaderArgs) {
  const rpc = getORPCClient(context);
  const team = await rpc.team.findById(params.teamId);
  return { team };
}

export default function TeamDetails({ loaderData, actionData }: Route.ComponentProps) {
  const { team } = loaderData;
  const { fieldErrors } = actionData ?? {};
  const editFormId = 'edit-team-form';
  const editFetcher = useFetcher();
  return (
    <div className="@container space-y-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{team?.name}</h1>
        <p className="text-sm text-muted-foreground">
          {team?.description || 'No description provided.'}
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Team Roster</CardTitle>
          <CardDescription>
            List of players, coaches, and staff associated with your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {team.members.map(member => (
            <div
              key={member.id}
              className="flex items-center justify-between px-4  py-2 even:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs font-medium">
                  {getInitials(member.user.name)}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm leading-none font-medium">{member.user.name}</p>
                  <span className="text-xs text-muted-foreground">
                    Joined {formatDistanceToNow(member.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={member.role === 'CAPTAIN' ? 'secondary' : 'outline'}>
                  {member.role}
                </Badge>
                <Button variant="ghost" size="icon-sm" aria-label="Remove Member">
                  <TrashIcon />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-end gap-4">
          <Button size="sm" variant="outline">
            <span>Invite Member</span>
          </Button>
          <Button size="sm">
            <span>Find Tournaments</span>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit Team</CardTitle>
          <CardDescription>
            Update your team&apos;s information, including name, logo, and description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <editFetcher.Form method="post" noValidate id={editFormId}>
            <FieldGroup>
              <Field data-invalid={!!fieldErrors?.name?.length}>
                <FieldLabel htmlFor="team-name">Team Name</FieldLabel>
                <Input
                  id="team-name"
                  name="name"
                  defaultValue={team.name}
                  placeholder="Unique name identifying your team."
                  required
                  aria-invalid={!!fieldErrors?.name?.length}
                />
                <FieldError errors={fieldErrors?.name?.map(message => ({ message }))} />
              </Field>

              <Field data-invalid={!!fieldErrors?.logoUrl?.length}>
                <FieldLabel htmlFor="team-logo">Logo URL</FieldLabel>
                <Input
                  id="team-logo"
                  name="logoUrl"
                  defaultValue={team.logoUrl || ''}
                  placeholder="External image link (64x64 recommended)."
                  aria-invalid={!!fieldErrors?.logoUrl?.length}
                />
                <FieldError errors={fieldErrors?.logoUrl?.map(message => ({ message }))} />
              </Field>

              <Field data-invalid={!!fieldErrors?.description?.length}>
                <FieldLabel htmlFor="team-desc">Description / Bio</FieldLabel>
                <textarea
                  id="team-desc"
                  name="description"
                  defaultValue={team.description || ''}
                  placeholder="Tell others what your squad excels at."
                  className="min-h-32 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  aria-invalid={!!fieldErrors?.description?.length}
                />
                <FieldError errors={fieldErrors?.description?.map(message => ({ message }))} />
              </Field>
            </FieldGroup>
          </editFetcher.Form>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" form={editFormId} variant="outline">
            <span>{editFetcher.state === 'submitting' ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-dashed border-destructive/50 bg-transparent px-0 py-4">
        <CardHeader>
          <CardTitle className="text-xs font-semibold text-destructive uppercase">
            Danger Zone
          </CardTitle>
          <CardDescription>
            Delete this team and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
