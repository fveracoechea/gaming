import { TeamCreateForm } from '@/resources/team.create';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gaming/ui/components/card';
import { Separator } from '@gaming/ui/components/separator';

import type { Route } from './+types/dashboard.create-team';

export default function CreateTeamPage({}: Route.ComponentProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Create Team</h1>
        <p className="text-muted-foreground text-sm">
          Set up your competitive squad profile. This is UI only.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Team Details</CardTitle>
            <CardDescription>Public information shown on tournaments.</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamCreateForm />
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
