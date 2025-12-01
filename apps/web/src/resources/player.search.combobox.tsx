import { useState } from 'react';
import { href, useFetcher } from 'react-router';

import { getORPCClient } from '@/lib/middlewares.server';
import { parseURLSearchParams } from '@/utils/object';
import { Button } from '@gaming/ui/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@gaming/ui/components/command';
import { Popover, PopoverContent, PopoverTrigger } from '@gaming/ui/components/popover';
import { cn } from '@gaming/ui/lib/utils';
import { SearchPlayersSchema } from '@gaming/zod';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';

import type { Route } from './+types/player.search.combobox';

export type PlayerSearchResult = Route.ComponentProps['loaderData'];
export type PlayerSearchData = PlayerSearchResult['players'][number];

export async function loader({ context, request }: Route.LoaderArgs) {
  const rpc = getORPCClient(context);
  const { searchParams } = new URL(request.url);

  const players = await rpc.player.search(
    parseURLSearchParams(SearchPlayersSchema, searchParams),
  );

  return { players };
}

type Props = {
  selectedPlayersIds: string[];
  onSelectPlayer: (player: PlayerSearchData) => void;
};

export function PlayerSearchCombobox(props: Props) {
  const { onSelectPlayer, selectedPlayersIds } = props;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const fetcher = useFetcher<PlayerSearchResult>();

  const { players } = fetcher.data || { players: [] };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" justify-between"
        >
          <span>Select players</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search for players..."
            className="h-9"
            value={search}
            onValueChange={v => {
              setSearch(v);
              if (v) fetcher.load(href('/resource/player/search/combobox') + `?query=${v}`);
            }}
          />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {players.map(player => (
                <CommandItem
                  key={player.id}
                  value={player.id}
                  disabled={selectedPlayersIds.includes(player.id)}
                  onSelect={() => {
                    setSearch('');
                    setOpen(false);
                    onSelectPlayer(player);
                  }}
                >
                  {player.name}
                  <CheckIcon
                    className={cn(
                      'ml-auto',
                      selectedPlayersIds.includes(player.id) ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
