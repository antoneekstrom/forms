import { Answer } from "@prisma/client";
import {
  ObjectType,
  Field,
  InputType,
  Resolver,
  Mutation,
  Arg,
  FieldResolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";
import { PrismaService } from "../../../services/prisma";
import { QuestionType } from "./Question";

/**
 *
 */
@ObjectType()
export class AnswerType implements Answer {
  @Field()
  value!: string;
  questionId!: number;
  formId!: number;
  responderId!: number;
}

/**
 *
 */
@InputType()
export class AddAnswerInput implements AnswerType {
  @Field()
  value!: string;
  @Field()
  questionId!: number;
  @Field()
  formId!: number;
  @Field()
  responderId!: number;
}

/**
 *
 */
@Service()
@Resolver((of) => AnswerType)
export class AnswerResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Mutation((returns) => AnswerType)
  async addAnswer(@Arg("data") data: AddAnswerInput) {
    return await this.prisma.client.answer.create({
      data,
    });
  }

  @FieldResolver((returns) => QuestionType)
  async question(@Root() { questionId: id }: AnswerType) {
    return await this.prisma.client.question.findFirst({
      where: {
        id,
      },
    });
  }
}
