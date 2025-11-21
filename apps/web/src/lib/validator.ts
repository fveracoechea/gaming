import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import type { z } from 'zod';

export type FieldErrors = Record<string, unknown>;
export type ValidationErrorResult = [FieldErrors, null];
export type ValidationSuccessResult<T> = [null, T];

export function createValidator<S extends z.ZodType>(schema: S) {
  type Output = z.output<S>;

  // @ts-expect-error standardSchemaResolver expects a different schema type
  const resolver = standardSchemaResolver(schema);

  return {
    resolver,
    async tryValidate(body: unknown) {
      // @ts-expect-error standardSchemaResolver has different types
      const { errors, values } = await resolver(body, undefined, {
        shouldUseNativeValidation: false,
        fields: {},
      });

      if (Object.values(errors).length) {
        return [errors, null] as ValidationErrorResult;
      }

      return [null, values] as ValidationSuccessResult<Output>;
    },
    async validate(body: unknown) {
      return await schema.parseAsync(body);
    },
  };
}
