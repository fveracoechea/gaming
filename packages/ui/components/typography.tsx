import { type ElementType } from 'react';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

type CustomTypographyProps<T extends ElementType> = React.ComponentProps<T> & {
  asChild?: boolean;
};

function createTypography<T extends ElementType>(args: { element: T; className: string }) {
  return function TypographyComponent(props: CustomTypographyProps<T>) {
    const { asChild = false, className, ...otherProps } = props;
    const Comp = asChild ? Slot : args.element;
    return <Comp {...otherProps} className={cn(args.className, className)} />;
  };
}

export const H1 = createTypography({
  element: 'h1',
  className: 'scroll-m-20 text-3xl font-bold text-balance',
});

export const H2 = createTypography({
  element: 'h2',
  className: 'scroll-m-20 text-2xl font-semibold text-balance',
});

export const H3 = createTypography({
  element: 'h3',
  className: 'scroll-m-20 text-xl font-semibold tracking-tight',
});

export const H4 = createTypography({
  element: 'h4',
  className: 'scroll-m-20 text-lg font-semibold tracking-tight',
});

export const Paragraph = createTypography({
  element: 'p',
  className: 'text-base leading-4 [&:not(:first-child)]:mt-4',
});

export const Blockquote = createTypography({
  element: 'blockquote',
  className: 'mt-6 border-l-2 pl-6 italic',
});

const typographyVariants = cva('', {
  variants: {
    variant: {
      lead: 'text-3xl font-light leading-none',
      large: 'text-xl font-normal leading-loose',
      base: 'text-base font-normal leading-normal',
      small: 'text-sm font-normal leading-tight',
      muted: 'text-sm text-muted-foreground',
    },
    defaultVariants: {
      variant: 'base',
    },
  },
});

export type TypographyProps = CustomTypographyProps<'span'> &
  VariantProps<typeof typographyVariants>;

export function Typography(props: TypographyProps) {
  const { asChild = false, className, variant, ...otherProps } = props;
  const Comp = asChild ? Slot : 'span';
  return <Comp {...otherProps} className={cn(typographyVariants({ variant }), className)} />;
}
