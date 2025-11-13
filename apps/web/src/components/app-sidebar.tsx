import * as React from 'react';
import { NavLink } from 'react-router';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@gaming/ui/components/sidebar';

import { SearchForm } from './search-form';
import { VersionSwitcher } from './version-switcher';

const data = {
  versions: ['Dota 2', 'CS2', 'Apex Legends'],
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      items: [
        {
          title: 'Overview',
          url: '/dashboard',
        },
        {
          title: 'My Profile',
          url: '/dashboard/my-profile',
        },
        {
          title: 'My Stats',
          url: '/dashboard/stats',
        },
        {
          title: 'Earnings',
          url: '/dashboard/earnings',
        },
      ],
    },
    {
      title: 'Tournaments',
      url: '/tournaments',
      items: [
        {
          title: 'Browse All',
          url: '/tournaments',
        },
        {
          title: 'My Tournaments',
          url: '/tournaments/my-tournaments',
        },
        {
          title: 'Create Tournament',
          url: '/tournaments/create',
        },
        {
          title: 'Tournament History',
          url: '/tournaments/history',
        },
        {
          title: 'Featured Events',
          url: '/tournaments/featured',
        },
      ],
    },
    {
      title: 'Teams & Players',
      url: '/teams',
      items: [
        {
          title: 'Find Teams',
          url: '/teams',
        },
        {
          title: 'My Team',
          url: '/dashboard/my-teams',
        },
        {
          title: 'Create Team',
          url: '/dashboard/create-team',
        },
        {
          title: 'Player Directory',
          url: '/players',
        },
        {
          title: 'Leaderboards',
          url: '/leaderboards',
        },
      ],
    },
    {
      title: 'Matches & Results',
      url: '/matches',
      items: [
        {
          title: 'Live Matches',
          url: '/matches/live',
        },
        {
          title: 'Match History',
          url: '/matches/history',
        },
        {
          title: 'Results & Brackets',
          url: '/matches/results',
        },
        {
          title: 'Replays',
          url: '/matches/replays',
        },
      ],
    },
    {
      title: 'Organizer Tools',
      url: '/organizer',
      items: [
        {
          title: 'Event Management',
          url: '/organizer/events',
        },
        {
          title: 'Lobby Control',
          url: '/organizer/lobbies',
        },
        {
          title: 'Registration Management',
          url: '/organizer/registrations',
        },
        {
          title: 'Payout Management',
          url: '/organizer/payouts',
        },
        {
          title: 'Analytics',
          url: '/organizer/analytics',
        },
      ],
    },
    {
      title: 'Financial',
      url: '/financial',
      items: [
        {
          title: 'Payment History',
          url: '/financial/payments',
        },
        {
          title: 'Prize Pool Status',
          url: '/financial/prize-pools',
        },
        {
          title: 'Refunds & Disputes',
          url: '/financial/refunds',
        },
        {
          title: 'Tax Documents',
          url: '/financial/tax-documents',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map(item => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <NavLink to={item.url} end>
                      {({ isActive }) => (
                        <SidebarMenuButton asChild isActive={isActive}>
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
