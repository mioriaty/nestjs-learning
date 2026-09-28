import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'match', async: false })
class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints as [string];
    const object = args.object as Record<string, unknown>;

    return value === object[relatedPropertyName];
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints as [string];

    return `${args.property} must match ${relatedPropertyName}`;
  }
}

export function Match(relatedPropertyName: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'match',
      target: object.constructor,
      propertyName,
      constraints: [relatedPropertyName],
      options: validationOptions,
      validator: MatchConstraint,
    });
  };
}
