import { QuestionAnswer } from "../InputRequester";

const DotEnvBuilder = (questionAnswers: QuestionAnswer[]) =>
  questionAnswers
    .map((questionAnswer) => {
      const answer = typeof questionAnswer.answer === "string" ? questionAnswer.answer : "";
      return `\n${questionAnswer.question}=${answer}`;
    })
    .join("");

export { DotEnvBuilder };
