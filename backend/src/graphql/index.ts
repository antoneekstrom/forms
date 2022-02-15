import { buildSchema } from "type-graphql";
import Container from "typedi";
import {
  AnswerResolver,
  FormResolver,
  PluppResolver,
  QuestionResolver,
  ResponderResolver,
  ResponseResolver,
} from "./schema";

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
    authChecker: (options) => {
      return false;
    }
  });
}
