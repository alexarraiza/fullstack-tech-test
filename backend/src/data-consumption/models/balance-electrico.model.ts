import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BalanceElectrico {
  @Field(() => Date)
  date: Date;

  @Field()
  type: string;

  @Field()
  group: string;

  @Field(() => Float)
  value: number;
}
