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
import { cn } from '@gaming/ui/lib/utils';

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

export default function MyTeamPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Team</h1>
        <p className="text-muted-foreground text-sm">
          Overview of your squad, members, and tournament activity.
        </p>
      </div>

      {/* Team Overview */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-start gap-4">
            <img
              src={mockTeam.logoUrl}
              alt={mockTeam.name}
              className="h-16 w-16 rounded-md border bg-muted object-cover"
            />
            <div className="space-y-1">
              <CardTitle>{mockTeam.name}</CardTitle>
              <CardDescription className="text-sm max-w-prose">
                {mockTeam.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Invite Member</Button>
            <Button>Create Tournament</Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Tournaments Played</p>
            <p className="text-xl font-bold">{mockTeam.tournamentsPlayed}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Tournaments Won</p>
            <p className="text-xl font-bold">{mockTeam.tournamentsWon}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <p className="text-xl font-bold">{mockTeam.winRate}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Earnings</p>
            <p className="text-xl font-bold text-green-600">${mockTeam.totalEarnings}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Members */}
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>Current roster and roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockMembers.map(m => (
              <div key={m.id} className="flex items-center justify-between">
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
                <div className="flex items-center gap-2">
                  <Badge variant={m.role === 'CAPTAIN' ? 'default' : 'outline'}>
                    {m.role}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tournament Registrations */}
        <Card>
          <CardHeader>
            <CardTitle>Tournaments</CardTitle>
            <CardDescription>Recent or active registrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockTournamentRegistrations.map(t => (
              <div key={t.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{t.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{t.format}</span>
                    <span>•</span>
                    <span>{t.participants} teams</span>
                    <span>•</span>
                    <span>{t.date}</span>
                  </div>
                </div>
                <Badge variant={statusVariant(t.status)}>{t.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Member Invite (UI only) */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Invite</CardTitle>
          <CardDescription>Invite players via username or email</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="max-w-xl">
            <Field>
              <FieldLabel htmlFor="invite-handle">Player Handle / Email</FieldLabel>
              <Input id="invite-handle" placeholder="player@example.com" />
              <FieldDescription>Enter one at a time – UI only.</FieldDescription>
            </Field>
            <Field>
              <Button type="button">Send Invite</Button>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
