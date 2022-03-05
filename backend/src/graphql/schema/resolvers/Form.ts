import { Form } from "@prisma/client";
import {
  ObjectType,
  Field,
  Resolver,
  Mutation,
  Arg,
  Authorized,
  Query,
  FieldResolver,
  Root,
  InputType,
} from "type-graphql";
import { Service } from "typedi";
import { PrismaService } from "../../../services/prisma";
import { QuestionType } from "./Question";
import { ResponseType } from "./Response";

/**
 *
 */
@ObjectType()
export class FormType implements Form {
  @Field()
  id!: number;
  @Field()
  title!: string;
}

/**
 *
 */
@InputType()
export class AddFormInput implements Partial<FormType> {
  @Field()
  title!: string;
}

@InputType()
export class RemoveFormInput implements Partial<FormType> {
  @Field()
  id!: number;
}

/**
 *
 */
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

  @Authorized()
  @Mutation((returns) => FormType)
  async removeForm(@Arg("data") { id }: RemoveFormInput) {
    return await this.prisma.client.form.delete({
      where: {
        id,
      },
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

  @Authorized()
  @FieldResolver((returns) => [ResponseType])
  async responses(@Root() form: FormType) {
    return await this.prisma.client.response.findMany({
      where: {
        form,
      },
    });
  }
}
