import { cn } from '@/lib/utils';

function H1(props: React.ComponentProps<'h1'>) {
  return (
    <h1
      {...props}
      className={cn(
        'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
        props.className,
      )}
    />
  );
}

function H2(props: React.ComponentProps<'h2'>) {
  return (
    <h2
      {...props}
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        props.className,
      )}
    />
  );
}

function H3(props: React.ComponentProps<'h3'>) {
  return (
    <h3
      {...props}
      className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', props.className)}
    />
  );
}

function H4(props: React.ComponentProps<'h3'>) {
  return (
    <h3
      {...props}
      className={cn('scroll-m-20 text-xl font-semibold tracking-tight', props.className)}
    />
  );
}

function P(props: React.ComponentProps<'p'>) {
  return (
    <p {...props} className={cn('leading-7 [&:not(:first-child)]:mt-6', props.className)} />
  );
}

function Blockquote(props: React.ComponentProps<'blockquote'>) {
  return (
    <blockquote {...props} className={cn('mt-6 border-l-2 pl-6 italic', props.className)} />
  );
}

function Lead(props: React.ComponentProps<'span'>) {
  return <span {...props} className={cn('text-xl text-muted-foreground', props.className)} />;
}

function Large(props: React.ComponentProps<'span'>) {
  return <span {...props} className={cn('text-lg font-semibold', props.className)} />;
}

function Small(props: React.ComponentProps<'small'>) {
  return (
    <span {...props} className={cn('text-sm leading-none font-medium', props.className)} />
  );
}

function Muted(props: React.ComponentProps<'span'>) {
  return <span {...props} className={cn('text-sm text-muted-foreground', props.className)} />;
}

export const Typography = { H1, H2, H3, H4, P, Blockquote, Lead, Large, Small, Muted };
