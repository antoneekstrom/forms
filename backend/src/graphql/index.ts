import { buildSchema } from "type-graphql";
import Container from "typedi";
import { User } from "../auth/types";
import {
  AnswerResolver,
  FormResolver,
  PluppResolver,
  QuestionResolver,
  ResponderResolver,
  ResponseResolver,
} from "./schema";

/**
 * Creates the graphql schema.
 * @returns the schema
 */
export async function schema() {
  return await buildSchema({
    resolvers: [
      FormResolver,
      ResponseResolver,
      AnswerResolver,
      ResponderResolver,
      QuestionResolver,
      PluppResolver,
    ],
    container: Container,
    authChecker: (options, roles) => {
      const user = options.context.user as User | undefined;
      return user != undefined;
    },
  });
}
