import { SessionData } from "express-session";
import { buildSchema, NonEmptyArray, ResolverData } from "type-graphql";
import Container from "typedi";
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
    authChecker: authorize,
  });
}

function authorize(
  options: ResolverData<{ session: SessionData }>,
  roles: string[]
) {
  return options.context.session.user !== undefined;
}
