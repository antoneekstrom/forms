import { Question } from "@prisma/client";
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
import { FormType } from "./Form";

/**
 *
 */
@ObjectType()
export class QuestionType implements Question {
  @Field()
  id!: number;
  @Field()
  text!: string;
  @Field()
  mandatory!: boolean;
}

/**
 *
 */
@InputType()
export class AddQuestionInput implements Partial<QuestionType> {
  @Field()
  formId!: number;
  @Field()
  text!: string;
  @Field()
  mandatory!: boolean;
}

/**
 *
 */
@Service()
@Resolver((of) => QuestionType)
export class QuestionResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Mutation((returns) => FormType)
  async addQuestion(@Arg("data") { formId: id, ...create }: AddQuestionInput) {
    return await this.prisma.client.form.update({
      where: {
        id,
      },
      data: {
        questions: {
          create,
        },
      },
    });
  }
}
