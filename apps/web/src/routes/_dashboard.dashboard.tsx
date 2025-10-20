import { Badge } from '@gaming/ui/components/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gaming/ui/components/card';

const mockUserStats = {
  totalEarnings: 2450.75,
  tournamentsPlayed: 23,
  tournamentsWon: 7,
  teamWinRate: 68.2,
  currentRank: 'Ancient III',
  mmr: 4250,
};

const mockRecentTournaments = [
  {
    id: 1,
    name: 'Summer Championship 2024',
    placement: 1,
    prizeWon: 500,
    date: '2024-03-15',
    participants: 32,
    status: 'completed',
  },
  {
    id: 2,
    name: 'Weekly Clash #47',
    placement: 3,
    prizeWon: 150,
    date: '2024-03-10',
    participants: 16,
    status: 'completed',
  },
  {
    id: 3,
    name: 'Pro League Qualifier',
    placement: 8,
    prizeWon: 0,
    date: '2024-03-05',
    participants: 64,
    status: 'completed',
  },
];

const mockRecentMatches = [
  {
    id: 1,
    opponent: 'Team Phoenix',
    result: 'win',
    score: '2-1',
    date: '2024-03-18',
    duration: '45:32',
    hero: 'Invoker',
  },
  {
    id: 2,
    opponent: 'Storm Raiders',
    result: 'loss',
    score: '1-2',
    date: '2024-03-17',
    duration: '38:15',
    hero: 'Pudge',
  },
  {
    id: 3,
    opponent: 'Dark Wolves',
    result: 'win',
    score: '2-0',
    date: '2024-03-16',
    duration: '32:48',
    hero: 'Crystal Maiden',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your gaming performance overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${mockUserStats.totalEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tournaments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserStats.tournamentsPlayed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockUserStats.tournamentsWon} wins (
              {(
                (mockUserStats.tournamentsWon / mockUserStats.tournamentsPlayed) *
                100
              ).toFixed(1)}
              % win rate)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Team Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserStats.teamWinRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 games</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockUserStats.currentRank}</div>
            <p className="text-xs text-muted-foreground mt-1">{mockUserStats.mmr} MMR</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Tournaments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tournaments</CardTitle>
            <CardDescription>Your latest tournament performances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentTournaments.map(tournament => (
              <div key={tournament.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{tournament.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{tournament.participants} players</span>
                    <span>•</span>
                    <span>{tournament.date}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={tournament.placement <= 3 ? 'default' : 'outline'}>
                      #{tournament.placement}
                    </Badge>
                  </div>
                  {tournament.prizeWon > 0 && (
                    <p className="text-xs text-green-600 font-medium">
                      +${tournament.prizeWon}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Matches */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
            <CardDescription>Your latest match results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRecentMatches.map(match => (
              <div key={match.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={match.result === 'win' ? 'default' : 'destructive'}>
                      {match.result.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium">{match.opponent}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{match.hero}</span>
                    <span>•</span>
                    <span>{match.duration}</span>
                    <span>•</span>
                    <span>{match.date}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{match.score}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with tournament activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-4 text-center hover:bg-muted/50 transition-colors">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-sm font-medium">Join Tournament</div>
              <div className="text-xs text-muted-foreground">Find active events</div>
            </button>

            <button className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 p-4 text-center hover:bg-muted/50 transition-colors">
              <div className="text-2xl mb-2">⚔️</div>
              <div className="text-sm font-medium">Quick Match</div>
              <div className="text-xs text-muted-foreground">Find opponents</div>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
