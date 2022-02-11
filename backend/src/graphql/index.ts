import { buildSchema } from "type-graphql";
import Container from "typedi";
import {
  AnswerResolver,
  FormResolver,
  PluppResolver,
  QuestionResolver,
  ResponderResolver,
  ResponseResolver,
} from "./schema/form";

export async function schema() {
  return await buildSchema({
    resolvers: [
      FormResolver,
      ResponseResolver,
      AnswerResolver,
      ResponderResolver,
      QuestionResolver,
      PluppResolver
    ],
    container: Container,
  });
}
