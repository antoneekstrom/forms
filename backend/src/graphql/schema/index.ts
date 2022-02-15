import { Answer, Form, Question, Responder, Response } from "@prisma/client";
import {
  ObjectType,
  Resolver,
  Query,
  Field,
  Root,
  FieldResolver,
  Mutation,
  InputType,
  Arg,
  Authorized,
} from "type-graphql";
import { Service } from "typedi";
import { PrismaService } from "../di";

@ObjectType()
export class ResponderType implements Responder {
  @Field()
  id!: number;
  @Field()
  name!: string;
}

@ObjectType()
export class ResponseType implements Response {
  formId!: number;
  responderId!: number;
}

@ObjectType()
export class FormType implements Form {
  id!: number;
  @Field()
  title!: string;
}

@ObjectType()
export class AnswerType implements Answer {
  @Field()
  value!: string;
  questionId!: number;
  formId!: number;
  responderId!: number;
}

@ObjectType()
export class QuestionType implements Question {
  @Field()
  id!: number;
  @Field()
  text!: string;
  @Field()
  mandatory!: boolean;
}

@InputType()
export class AddFormInput implements Partial<FormType> {
  @Field()
  title!: string;
}

@InputType()
export class AddResponseInput implements ResponseType {
  @Field()
  formId!: number;
  @Field()
  responderId!: number;
}

@InputType()
export class AddResponderInput implements Partial<ResponderType> {
  @Field()
  name!: string;
}

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

@InputType()
export class AddQuestionInput implements Partial<QuestionType> {
  @Field()
  formId!: number;
  @Field()
  text!: string;
  @Field()
  mandatory!: boolean;
}

@ObjectType()
export class Plupp {
  @Field()
  plupp!: string
}

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

@Service()
@Resolver((of) => Plupp)
export class PluppResolver {
  @Query((returns) => Plupp)
  plupp(): Plupp {
    return {
      plupp: "plupp",
    }
  }
}

@Service()
@Resolver((of) => FormType)
export class FormResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Authorized()
  @Mutation((returns) => FormType)
  async addForm(@Arg("data") data: AddFormInput) {
    return await this.prisma.client.form.create({
      data,
    });
  }

  @Query((returns) => [FormType])
  async forms() {
    return await this.prisma.client.form.findMany();
  }

  @FieldResolver(() => [QuestionType])
  async questions(@Root() form: FormType) {
    return (
      (
        await this.prisma.client.form.findFirst({
          select: {
            questions: {},
          },
          where: {
            ...form,
          },
        })
      )?.questions ?? []
    );
  }

  @FieldResolver((returns) => [ResponseType])
  async responses(@Root() form: FormType) {
    return await this.prisma.client.response.findMany({
      where: {
        form,
      },
    });
  }
}
