import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetBalancesArgs {
  @Field(() => String, { nullable: true })
  type?: string;
  @Field(() => String, { nullable: true })
  group?: string;

  @Field(() => Date, { nullable: true })
  startDate?: Date;
  @Field(() => Date, { nullable: true })
  endDate?: Date;
}
