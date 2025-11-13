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

import type { Route } from './+types/dashboard.my-teams';

const mockMembershipContext = {
  maxTeamsFree: 1,
  proMaxTeamsComingSoon: 5,
};

// Mock data – UI only
const mockTeam = {
  name: 'Radiant Vanguard',
  description:
    'Competitive Dota 2 squad focused on strategy-heavy drafts and disciplined macro play.',
  logoUrl: 'https://placehold.co/64x64?text=RV',
  totalEarnings: 3420,
  tournamentsPlayed: 18,
  tournamentsWon: 5,
  winRate: 62.5,
};

const mockMembers: Array<{
  id: string;
  name: string;
  role: 'CAPTAIN' | 'MEMBER' | 'COACH';
  joined: string;
  mmr?: number;
}> = [
  { id: '1', name: 'AetherStrike', role: 'CAPTAIN', joined: '2024-01-12', mmr: 4800 },
  { id: '2', name: 'FogWalker', role: 'MEMBER', joined: '2024-02-03', mmr: 4550 },
  { id: '3', name: 'RuneCrafter', role: 'MEMBER', joined: '2024-02-10', mmr: 4300 },
  { id: '4', name: 'LaneSentinel', role: 'MEMBER', joined: '2024-03-01', mmr: 4100 },
  { id: '5', name: 'DraftSage', role: 'COACH', joined: '2024-03-15' },
];

const mockTournamentRegistrations = [
  {
    id: 't1',
    name: 'Spring Clash #12',
    status: 'REGISTERED',
    format: 'Double Elimination',
    date: '2024-04-05',
    participants: 32,
  },
  {
    id: 't2',
    name: 'Weekend Brawl #88',
    status: 'ACTIVE',
    format: 'Single Elimination',
    date: '2024-04-01',
    participants: 16,
  },
  {
    id: 't3',
    name: 'Pro Circuit Qualifier',
    status: 'CHECKED_IN',
    format: 'Swiss',
    date: '2024-04-12',
    participants: 64,
  },
];

function statusVariant(status: string): 'default' | 'outline' | 'destructive' | 'secondary' {
  switch (status) {
    case 'ACTIVE':
      return 'default';
    case 'REGISTERED':
    case 'CHECKED_IN':
      return 'secondary';
    case 'ELIMINATED':
    case 'WITHDRAWN':
    case 'DISQUALIFIED':
      return 'destructive';
    case 'WINNER':
      return 'default';
    default:
      return 'outline';
  }
}

export async function loader({ context }: Route.LoaderArgs) {
  const rpc = getORPCClient(context);
  const teams = await rpc.team.findMyTeams();
  return { teams };
}

export default function MyTeamPage({ loaderData }: Route.ComponentProps) {
  const { teams } = loaderData;

  const { maxTeamsFree: maxAllowed } = mockMembershipContext;
  const canJoinOrCreateAnother = teams.length < maxAllowed;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Teams</h1>
        <p className="text-muted-foreground text-sm">
          Overview of your squad, members, and tournament activity.
        </p>
      </div>

      <Card className="border-dashed bg-transparent border-muted-foreground/50 py-4 px-0">
        <CardHeader>
          <CardTitle className="text-xs uppercase font-semibold text-accent">
            Multiple teams coming soon
          </CardTitle>
          <CardDescription className="flex gap-2 text-sm text-muted-foreground">
            Soon you will be able to belong to up to 5 teams with the Pro plan.
          </CardDescription>
        </CardHeader>
      </Card>

      {teams.map(team => {
        return (
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-start gap-4">
                <img
                  alt={team.name}
                  className="h-16 w-16 rounded-md border bg-muted object-cover"
                  src={
                    team.logoUrl ||
                    `https://placehold.co/64x64?text=${team.name.charAt(0).toUpperCase()}`
                  }
                />
                <div className="space-y-1">
                  <CardTitle>{team.name}</CardTitle>
                  <CardDescription className="text-sm max-w-prose">
                    {team.description}
                  </CardDescription>
                </div>
              </div>
              <Button>Manage Team</Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-base">Roster and Roles</p>

              {mockMembers.map(m => (
                <div
                  key={m.id}
                  className="flex items-center justify-between even:bg-muted/50  py-2 px-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium border">
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{m.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Joined {m.joined}</span>
                        {m.mmr && (
                          <>
                            <span>•</span>
                            <span>{m.mmr} MMR</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant={m.role === 'CAPTAIN' ? 'secondary' : 'outline'}>
                    {m.role}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
