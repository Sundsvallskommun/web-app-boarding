import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

const isNull = (value: any) => {
  return value !== null;
};

@ValidatorConstraint()
export class IsNull implements ValidatorConstraintInterface {
  validate(value: any) {
    return isNull(value);
  }
}

export const additionalConverters = {
  IsNull: () => ({ nullable: true }),
};
