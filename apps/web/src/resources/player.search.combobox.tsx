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

type PlayerSearchData = Route.ComponentProps['loaderData'];

export async function loader({ context, request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  console.log('Search Params:', searchParams.toString());
  const rpc = getORPCClient(context);

  const players = await rpc.player.search(
    parseURLSearchParams(SearchPlayersSchema, searchParams),
  );

  return { players };
}

export function PlayerSearchCombobox() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const fetcher = useFetcher<PlayerSearchData>();

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
          <span>Search for players</span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search framework..."
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
                  onSelect={currentValue => {
                    setSearch(currentValue === search ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  {player.name}
                  <CheckIcon
                    className={cn(
                      'ml-auto',
                      search === player.id ? 'opacity-100' : 'opacity-0',
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
