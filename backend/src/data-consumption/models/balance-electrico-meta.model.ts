import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BalanceElectricoMeta {
  @Field(() => Date)
  minDate: Date;
  @Field(() => Date)
  maxDate: Date;

  @Field(() => Int)
  count: number;
}
