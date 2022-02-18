import { buildSchema, NonEmptyArray } from "type-graphql";
import Container from "typedi";
import { User } from "../../auth/types";
import { AnswerResolver } from "./resolvers/Answer";
import { FormResolver } from "./resolvers/Form";
import { QuestionResolver } from "./resolvers/Question";
import { ResponderResolver } from "./resolvers/Responder";
import { ResponseResolver } from "./resolvers/Response";

/**
 *
 */
const resolvers: NonEmptyArray<Function> = [
  AnswerResolver,
  FormResolver,
  QuestionResolver,
  ResponderResolver,
  ResponseResolver,
];

/**
 * Creates the graphql schema.
 * @returns the schema
 */
export async function schema() {
  return await buildSchema({
    resolvers,
    container: Container,
    authChecker: (options, roles) => {
      const user = options.context.user as User | undefined;
      return user != undefined;
    },
  });
}
