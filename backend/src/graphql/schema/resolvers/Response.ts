import { Response } from "@prisma/client";
import {
  ObjectType,
  InputType,
  Field,
  Resolver,
  Mutation,
  Arg,
  FieldResolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";
import { PrismaService } from "../../../services/prisma";
import { AnswerType } from "./Answer";
import { ResponderType } from "./Responder";

/**
 *
 */
@ObjectType()
export class ResponseType implements Response {
  formId!: number;
  responderId!: number;
}

/**
 *
 */
@InputType()
export class AddResponseInput implements ResponseType {
  @Field()
  formId!: number;
  @Field()
  responderId!: number;
}

/**
 *
 */
@Service()
@Resolver((of) => ResponseType)
export class ResponseResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Mutation((returns) => ResponseType)
  async addResponse(@Arg("data") data: AddResponseInput) {
    return await this.prisma.client.response.create({
      data,
    });
  }

  @FieldResolver((returns) => ResponderType)
  async responder(@Root() { responderId: id }: ResponseType) {
    return await this.prisma.client.responder.findFirst({
      where: {
        id,
      },
    });
  }

  @FieldResolver((returns) => [AnswerType])
  async answers(@Root() response: ResponseType) {
    return await this.prisma.client.answer.findMany({
      where: {
        response,
      },
    });
  }
}
