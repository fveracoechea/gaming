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

// UI-only mock data for profile view
const mockProfile = {
  id: 'u123',
  handle: 'AetherStrike',
  name: 'Lucas "Aether" Mendoza',
  avatarUrl: 'https://placehold.co/96x96?text=AS',
  rank: 'Ancient III',
  mmr: 4250,
  region: 'NA',
  bio: 'Strategic mid-laner focusing on tempo control, vision, and efficient rotations. Passionate about community-driven tournaments.',
  totalEarnings: 2450.75,
  tournamentsPlayed: 23,
  tournamentsWon: 7,
  matchesPlayed: 108,
  averagePlacement: 4.2,
  hostCount: 5, // tournaments hosted as organizer
};

const mockTeams: Array<{
  id: string;
  name: string;
  role: 'CAPTAIN' | 'MEMBER' | 'COACH' | 'SUB';
  joined: string;
  earnings: number;
}> = [
  {
    id: 't1',
    name: 'Radiant Vanguard',
    role: 'CAPTAIN',
    joined: '2024-01-12',
    earnings: 1650,
  },
  { id: 't2', name: 'Echo Legion', role: 'MEMBER', joined: '2024-02-20', earnings: 420 },
  { id: 't3', name: 'Draft Scholars', role: 'COACH', joined: '2024-03-05', earnings: 380 },
];

const mockRecentEarnings = [
  {
    id: 'e1',
    tournament: 'Summer Championship 2024',
    amount: 500,
    placement: 1,
    date: '2024-03-15',
  },
  { id: 'e2', tournament: 'Weekly Clash #47', amount: 150, placement: 3, date: '2024-03-10' },
  { id: 'e3', tournament: 'Community Cup #9', amount: 75, placement: 5, date: '2024-03-02' },
];

const mockIntegrations = [
  {
    id: 'steam',
    name: 'Steam Account',
    status: 'CONNECTED',
    description: 'Linked for identity & future OAuth.',
    actionable: false,
  },
  {
    id: 'dota2',
    name: 'Dota 2 Bot Sync',
    status: 'PENDING',
    description: 'Awaiting first lobby interaction.',
    actionable: true,
  },
  {
    id: 'opendota',
    name: 'OpenDota Stats',
    status: 'ENABLED',
    description: 'Match history & hero stats imported.',
    actionable: false,
  },
];

function statusVariant(status: string): 'default' | 'outline' | 'destructive' | 'secondary' {
  switch (status) {
    case 'CONNECTED':
    case 'ENABLED':
      return 'default';
    case 'PENDING':
      return 'secondary';
    case 'ERROR':
    case 'DISABLED':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function MyProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground text-sm">
          Personal performance, teams, earnings, and integrations.
        </p>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-start gap-4">
            <img
              src={mockProfile.avatarUrl}
              alt={mockProfile.handle}
              className="h-24 w-24 rounded-md border bg-muted object-cover"
            />
            <div className="space-y-2">
              <CardTitle className="flex flex-col">
                <span className="text-xl font-bold">{mockProfile.name}</span>
                <span className="text-sm text-muted-foreground">@{mockProfile.handle}</span>
              </CardTitle>
              <CardDescription className="text-sm max-w-prose leading-relaxed">
                {mockProfile.bio}
              </CardDescription>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline">{mockProfile.rank}</Badge>
                <Badge variant="outline">{mockProfile.mmr} MMR</Badge>
                <Badge variant="outline">Region: {mockProfile.region}</Badge>
                <Badge variant="default">Tournaments Hosted: {mockProfile.hostCount}</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Edit Profile</Button>
            <Button>Create Tournament</Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 pt-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Tournaments Played</p>
            <p className="text-xl font-bold">{mockProfile.tournamentsPlayed}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Tournaments Won</p>
            <p className="text-xl font-bold">{mockProfile.tournamentsWon}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Win Rate</p>
            <p className="text-xl font-bold">
              {((mockProfile.tournamentsWon / mockProfile.tournamentsPlayed) * 100).toFixed(1)}
              %
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Avg. Placement</p>
            <p className="text-xl font-bold">{mockProfile.averagePlacement}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Matches Played</p>
            <p className="text-xl font-bold">{mockProfile.matchesPlayed}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Earnings</p>
            <p className="text-xl font-bold text-green-600">
              ${mockProfile.totalEarnings.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Teams Membership */}
        <Card>
          <CardHeader>
            <CardTitle>Teams</CardTitle>
            <CardDescription>Active squads & roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockTeams.map(team => (
              <div key={team.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-xs font-medium border">
                    {team.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{team.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Joined {team.joined}</span>
                      <span>•</span>
                      <span>${team.earnings} earned</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={team.role === 'CAPTAIN' ? 'default' : 'outline'}>
                    {team.role}
                  </Badge>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Looking to join or create a new team?
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Find Team
                </Button>
                <Button size="sm">Create Team</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Earnings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Earnings</CardTitle>
            <CardDescription>Tournament payouts & placements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentEarnings.map(e => (
              <div key={e.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{e.tournament}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>#{e.placement}</span>
                    <span>•</span>
                    <span>{e.date}</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-green-600">+${e.amount}</p>
              </div>
            ))}
            <Separator />
            <div className="text-xs text-muted-foreground">
              Historical payout graphs coming soon.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle>Gaming Integrations</CardTitle>
            <CardDescription>Platform & data sync status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockIntegrations.map(i => (
              <div key={i.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{i.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{i.description}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant(i.status)}>{i.status}</Badge>
                  {i.actionable && (
                    <Button size="sm" variant="outline">
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Separator />
            <div className="text-xs text-muted-foreground">
              Dota 2 bot handles lobby creation & result ingestion.
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump into common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <button className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-4 text-center hover:bg-muted/50 transition-colors">
                <div className="text-2xl mb-2">🏆</div>
                <div className="text-sm font-medium">Join Tournament</div>
                <div className="text-xs text-muted-foreground">Find active events</div>
              </button>
              <button className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-4 text-center hover:bg-muted/50 transition-colors">
                <div className="text-2xl mb-2">📥</div>
                <div className="text-sm font-medium">Withdraw Earnings</div>
                <div className="text-xs text-muted-foreground">Cash out balance</div>
              </button>
              <button className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-4 text-center hover:bg-muted/50 transition-colors">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="text-sm font-medium">Manage Integrations</div>
                <div className="text-xs text-muted-foreground">Steam / OpenDota / Bot</div>
              </button>
              <button className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-4 text-center hover:bg-muted/50 transition-colors">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-sm font-medium">Find Team</div>
                <div className="text-xs text-muted-foreground">Join a squad</div>
              </button>
              <button className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-4 text-center hover:bg-muted/50 transition-colors">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium">View Stats</div>
                <div className="text-xs text-muted-foreground">Detailed analysis</div>
              </button>
              <button className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-4 text-center hover:bg-muted/50 transition-colors">
                <div className="text-2xl mb-2">🖊️</div>
                <div className="text-sm font-medium">Edit Profile</div>
                <div className="text-xs text-muted-foreground">Update details</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simple Preferences / Placeholder form (UI only) */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Preferences</CardTitle>
          <CardDescription>Update display settings & social links (UI only)</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="max-w-xl">
            <Field>
              <FieldLabel htmlFor="profile-twitter">Twitter / X</FieldLabel>
              <Input id="profile-twitter" placeholder="@handle" />
              <FieldDescription>Optional public social handle.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="profile-twitch">Twitch</FieldLabel>
              <Input id="profile-twitch" placeholder="channel" />
              <FieldDescription>Used for featured organizer streams.</FieldDescription>
            </Field>
            <Field>
              <Button type="button">Save Changes</Button>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
