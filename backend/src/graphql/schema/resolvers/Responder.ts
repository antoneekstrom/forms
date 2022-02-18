import { Responder } from "@prisma/client";
import {
  ObjectType,
  Field,
  InputType,
  Resolver,
  Mutation,
  Arg,
} from "type-graphql";
import { Service } from "typedi";
import { PrismaService } from "../../../services/prisma";

/**
 *
 */
@ObjectType()
export class ResponderType implements Responder {
  @Field()
  id!: number;
  @Field()
  name!: string;
}

/**
 *
 */
@InputType()
export class AddResponderInput implements Partial<ResponderType> {
  @Field()
  name!: string;
}

/**
 *
 */
@Service()
@Resolver((of) => ResponderType)
export class ResponderResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Mutation((returns) => ResponderType)
  async addResponder(@Arg("data") data: AddResponderInput) {
    return await this.prisma.client.responder.create({
      data,
    });
  }
}
