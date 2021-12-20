import { QuestionType } from "../../../helpers";
import {
  ChoicesWithMultipleAnswersQuestionSchema,
  ChoicesWithSingleAnswerQuestionSchema,
  ChoicesQuestionSchema,
} from "../../../schemas/Question";

describe("ChoicesQuestionSchema", () => {
  test("type", () => {
    const question = {
      id: "Feel_Ideal",
      question: "Choice question",
      next: "Next_Question",
      choices: ["Hello?", "World!"],
    };

    expect(() => {
      ChoicesQuestionSchema.parse({
        ...question,
        type: QuestionType.ChoicesWithSingleAnswer,
      });
    }).not.toThrowError();

    expect(() => {
      ChoicesQuestionSchema.parse({
        ...question,
        type: QuestionType.ChoicesWithMultipleAnswers,
      });
    }).not.toThrowError();

    expect(() => {
      ChoicesQuestionSchema.parse({
        ...question,
        type: QuestionType.HowLongAgo,
      });
    }).toThrowErrorMatchingSnapshot();
  });

  describe("choices", () => {
    const question = {
      id: "Feel_Ideal",
      type: QuestionType.ChoicesWithSingleAnswer,
      question: "Choice question",
      next: "Next_Question",
    };

    test("should not be undefined", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("should not be empty", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          choices: [],
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("can be an array of strings", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          choices: ["Hello", "World"],
        });
      }).not.toThrowError();

      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          choices: ["人之初", "性本善"],
        });
      }).not.toThrowError();

      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          choices: [2, 3, 5],
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("can be a string", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          choices: "helloworld",
        });
      }).not.toThrowError();

      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          choices: "NAMES",
        });
      }).not.toThrowError();

      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          choices: 5,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("choices string cannot be empty", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          choices: ["", "world"],
        });
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          choices: [""],
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("choices should not be duplicated", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          choices: ["world", "world"],
        });
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          choices: ["行路难", "行路难"],
        });
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe("specialCasesStartId", () => {
    const question = {
      id: "Feel_Ideal",
      type: QuestionType.ChoicesWithSingleAnswer,
      question: "Choice question",
      choices: ["Hello?", "World!"],
      next: "Next_Question",
    };

    test("can be undefined", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
        });
      }).not.toThrowError();
    });

    test("should not be null", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          specialCasesStartId: null,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("can be empty array", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          specialCasesStartId: [],
        });
      }).not.toThrowError();
    });

    test(`will not be tested if choices is string`, () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          choices: "NAMES",
          specialCasesStartId: [["一尊还酹江月", "dream"]],
        });
      }).not.toThrowError();
    });

    test(`can include choices keys`, () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          specialCasesStartId: [["Hello?", "hello_world"]],
        });
      }).not.toThrowError();
    });

    test(`cannot include non-choices key`, () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          specialCasesStartId: [["notakey", "nonono"]],
        });
      }).toThrowErrorMatchingSnapshot("non-choices key only");

      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          specialCasesStartId: [
            ["notakey", "nonono"],
            ["World!", "stillno"],
          ],
        });
      }).toThrowErrorMatchingSnapshot("non-choices key with choice key");
    });

    test(`question id can be null`, () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          specialCasesStartId: [
            ["Hello?", "new_world"],
            ["World!", null],
          ],
        });
      }).not.toThrowError();

      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          specialCasesStartId: [["World!", null]],
        });
      }).not.toThrowError();
    });
  });

  describe("randomizeChoicesOrder", () => {
    const question = {
      id: "Feel_Ideal",
      type: QuestionType.ChoicesWithSingleAnswer,
      question: "Choice question",
      choices: ["Hello?", "World!"],
      next: "Next_Question",
    };

    test("can be undefined", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
        });
      }).not.toThrowError();
    });

    test("should not be null", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          randomizeChoicesOrder: null,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("can be true and false", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          randomizeChoicesOrder: true,
        });
      }).not.toThrowError();

      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          randomizeChoicesOrder: false,
        });
      }).not.toThrowError();
    });
  });

  describe("randomizeExceptForChoiceIds", () => {
    const question = {
      id: "Feel_Ideal",
      type: QuestionType.ChoicesWithSingleAnswer,
      question: "Choice question",
      choices: ["Hello?", "World!"],
      randomizeChoicesOrder: true,
      next: "Next_Question",
    };

    test("can be undefined", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
        });
      }).not.toThrowError();
    });

    test("should not be null", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          randomizeExceptForChoiceIds: null,
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("should not be set if `randomizeChoicesOrder` is false", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          randomizeChoicesOrder: false,
          randomizeExceptForChoiceIds: ["Hello?"],
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test("can be empty", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          randomizeExceptForChoiceIds: [],
        });
      }).not.toThrowError();
    });

    test(`will not be tested if choices is string`, () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          choices: "NAMES",
          randomizeExceptForChoiceIds: ["花间一壶酒", "独酌无相亲"],
        });
      }).not.toThrowError();
    });

    test("can be choices keys", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          randomizeExceptForChoiceIds: ["Hello?", "World!"],
        });
      }).not.toThrowError();

      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          randomizeExceptForChoiceIds: ["World!"],
        });
      }).not.toThrowError();
    });

    test("should not be non-choices keys", () => {
      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          randomizeExceptForChoiceIds: ["nono", "World!"],
        });
      }).toThrowErrorMatchingSnapshot("with choice keys");

      expect(() => {
        ChoicesQuestionSchema.parse({
          ...question,
          randomizeExceptForChoiceIds: ["haha"],
        });
      }).toThrowErrorMatchingSnapshot("without choice keys");
    });
  });
});

describe("ChoicesWithSingleAnswerQuestionSchema", () => {
  test("type", () => {
    const question = {
      id: "Feel_Ideal",
      question: "Choice question",
      next: "Next_Question",
      choices: ["Hello?", "World!"],
    };

    expect(() => {
      ChoicesWithSingleAnswerQuestionSchema.parse({
        ...question,
        type: QuestionType.ChoicesWithSingleAnswer,
      });
    }).not.toThrowError();

    expect(() => {
      ChoicesWithSingleAnswerQuestionSchema.parse({
        ...question,
        type: QuestionType.ChoicesWithMultipleAnswers,
      });
    }).toThrowErrorMatchingSnapshot("ChoicesWithMultipleAnswers");

    expect(() => {
      ChoicesWithSingleAnswerQuestionSchema.parse({
        ...question,
        type: QuestionType.YesNo,
      });
    }).toThrowErrorMatchingSnapshot("other");
  });
});

describe("ChoicesWithMultipleAnswersQuestionSchema", () => {
  test("type", () => {
    const question = {
      id: "Feel_Ideal",
      question: "Choice question",
      next: "Next_Question",
      choices: ["Hello?", "World!"],
    };

    expect(() => {
      ChoicesWithMultipleAnswersQuestionSchema.parse({
        ...question,
        type: QuestionType.ChoicesWithMultipleAnswers,
      });
    }).not.toThrowError();

    expect(() => {
      ChoicesWithMultipleAnswersQuestionSchema.parse({
        ...question,
        type: QuestionType.ChoicesWithSingleAnswer,
      });
    }).toThrowErrorMatchingSnapshot("ChoicesWithSingleAnswer");

    expect(() => {
      ChoicesWithMultipleAnswersQuestionSchema.parse({
        ...question,
        type: QuestionType.YesNo,
      });
    }).toThrowErrorMatchingSnapshot("other");
  });
});
