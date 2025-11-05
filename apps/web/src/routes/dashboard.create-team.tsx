import { Form, href, redirect, useNavigation } from 'react-router';

import { getORPCClient } from '@/lib/middlewares.server';
import { Badge } from '@gaming/ui/components/badge';
import { Button } from '@gaming/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gaming/ui/components/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@gaming/ui/components/field';
import { Input } from '@gaming/ui/components/input';
import { Separator } from '@gaming/ui/components/separator';
import { Spinner } from '@gaming/ui/components/spinner';
import { safe } from '@orpc/server';
import { parseFormData } from '@remix-run/form-data-parser';
import z from 'zod';

import type { Route } from './+types/dashboard.create-team';

const CreateTeamFormSchema = z.object({
  name: z.string().min(3).max(30),
  logoUrl: z.url().optional(),
  description: z.string().max(500).optional(),
});

export async function action({ context, request }: Route.ActionArgs) {
  const rpc = getORPCClient(context);
  const formData = await parseFormData(request);

  const validation = CreateTeamFormSchema.transform(async (fields, ctx) => {
    const { error, data } = await safe(rpc.team.create(fields));
    if (error) {
      ctx.addIssue({ code: 'custom', message: error.message });
      return z.NEVER;
    }
    return data;
  });

  const { error } = await validation.safeParseAsync(Object.fromEntries(formData));
  if (error) return z.flattenError(error);
  return redirect(href('/dashboard/my-team'));
}

export default function CreateTeamPage({ actionData }: Route.ComponentProps) {
  const { fieldErrors, formErrors } = actionData ?? {};
  const navigation = useNavigation();
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create Team</h1>
        <p className="text-muted-foreground text-sm">
          Set up your competitive squad profile. This is UI only.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Details</CardTitle>
            <CardDescription>Public information shown on tournaments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="team-name">Team Name</FieldLabel>
                  <Input id="team-name" placeholder="e.g. Radiant Vanguard" />
                  <FieldDescription>Unique name identifying your team.</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="team-logo">Logo URL</FieldLabel>
                  <Input id="team-logo" placeholder="https://..." />
                  <FieldDescription>External image link (64x64 recommended).</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="team-desc">Description / Bio</FieldLabel>
                  <textarea
                    id="team-desc"
                    placeholder="Competitive Dota 2 team specializing in macro strategy and disciplined drafts."
                    className="min-h-32 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <FieldDescription>Tell others what your squad excels at.</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel>Primary Game</FieldLabel>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {['Dota 2', 'CS2', 'Rocket League', 'League of Legends'].map(game => (
                      <button
                        key={game}
                        type="button"
                        className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-4 text-center hover:bg-muted/50 transition-colors"
                      >
                        <div className="text-sm font-medium">{game}</div>
                      </button>
                    ))}
                  </div>
                  <FieldDescription>Future: Select one then add alternates.</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel>Recruitment Status</FieldLabel>
                  <div className="flex gap-3 flex-wrap">
                    {['OPEN', 'LOOKING FOR ONE', 'CLOSED'].map(status => (
                      <Badge key={status} variant="outline" className="cursor-pointer">
                        {status}
                      </Badge>
                    ))}
                  </div>
                  <FieldDescription>Display whether you accept new members.</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel>Preferred Formats</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Single Elimination',
                      'Double Elimination',
                      'Round Robin',
                      'Swiss',
                      'League',
                    ].map(format => (
                      <Badge key={format} variant="secondary" className="cursor-pointer">
                        {format}
                      </Badge>
                    ))}
                  </div>
                  <FieldDescription>
                    Inform organizers what formats your team likes.
                  </FieldDescription>
                </Field>

                <Field>
                  <Button type="button">
                    {navigation.state === 'submitting' ? (
                      <Spinner />
                    ) : (
                      <span>Create Team</span>
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </Form>
          </CardContent>
        </Card>

        {/* Sidebar guidance */}
        <Card className="h-min">
          <CardHeader>
            <CardTitle>Tips</CardTitle>
            <CardDescription>Recommendations for effective setup</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium">Clear Identity</p>
              <p className="text-muted-foreground">
                Short memorable name & simple logo improve recognition.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Bio Focus</p>
              <p className="text-muted-foreground">
                Highlight strengths (drafting, laning, macro, coaching) and timezone.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Recruitment Clarity</p>
              <p className="text-muted-foreground">
                Status helps players know if they should reach out.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Format Preferences</p>
              <p className="text-muted-foreground">
                Lets organizers match teams with bracket styles they enjoy.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">Future Integrations</p>
              <p className="text-muted-foreground">
                Dota 2 lobby automation will use your roster to seed matches.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
