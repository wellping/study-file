/**
 * These are common schemas that are used by other schemas.
 * It is moved here to avoid circular dependency.
 */
import uniq from "lodash/uniq";
import * as z from "zod";

import { idRegex, idRegexErrorMessage } from "./helper";

export const StudyIdSchema = z
  .string()
  .nonempty()
  .regex(idRegex, {
    message: idRegexErrorMessage("Study ID"),
  });

export const StreamNameSchema = z
  .string()
  .nonempty()
  .regex(idRegex, {
    message: idRegexErrorMessage("Stream name"),
  });

export const QuestionIdSchema = z
  .string()
  .nonempty()
  // We allow `[\]` because `withVariable` uses "[__something__]".
  .regex(/^[\w[\]]+$/, {
    message: `Question ID can only include letters, numbers, "_", "[", and "]".`,
  });

export const PingIdSchema = z
  .string()
  .nonempty()
  .regex(idRegex, {
    message: idRegexErrorMessage("Stream name"),
  });

/**
 * Note: This isn't current used anywhere because this breaks the type
 * inference (it will set the type to `any`).
 *
 * This is a workaround such that the error message for missing it will be
 * > Issue #0: invalid_type at
 * > Required
 * instead of the more confusing
 * > Issue #0: invalid_union at
 * > Invalid input
 *
 * Notice that if an `.optional()` follows, it is unnecessary to use this.
 *
 * Probably don't need to use it after https://github.com/vriad/zod/issues/97
 * is addressed.
 */
export const CustomNullable = (Schema: z.ZodType<any, any>, path: string[]) =>
  Schema.nullable().refine((val) => {
    if (val === undefined) {
      z.null().parse(val, { path });
    }
    return true;
  });

export const ChoiceSchema = z.string().nonempty();

export const ChoicesListSchema = z
  .array(ChoiceSchema)
  .nonempty()
  .refine(
    (choices) => {
      // Check if there is any duplicate items.
      return choices.length === uniq(choices).length;
    },
    {
      message: "There should not be duplicate elements in the choices list.",
    },
  );
