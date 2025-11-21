import type { FieldErrors, FieldValues } from 'react-hook-form';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { type StandardSchemaV1 } from '@standard-schema/spec';

type ValidationError<T extends FieldValues> = [FieldErrors<T>, null];
type ValidationSuccess<T extends FieldValues> = [null, T];

export type ValidationResult<Input extends FieldValues, Output extends FieldValues> =
  | ValidationError<Input>
  | ValidationSuccess<Output>;

export function createValidator<Input extends FieldValues, Output extends FieldValues>(
  schema: StandardSchemaV1<Input, Output>,
) {
  const resolver = standardSchemaResolver(schema);
  return {
    resolver,
    async validate(body: unknown): Promise<ValidationResult<Input, Output>> {
      const { errors, values } = await resolver(body as Input, undefined, {
        shouldUseNativeValidation: false,
        fields: {},
      });

      if (Object.values(errors).length) {
        return [errors as FieldErrors<Input>, null];
      }

      return [null, values as Output];
    },
  };
}
