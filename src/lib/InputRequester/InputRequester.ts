import readline from "readline";

interface QuestionAnswer {
  question: string;
  answer: string | unknown;
}

const ask = (question: string, isSecrete: boolean) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (isSecrete) {
      const handle = (Buff: Buffer) => {
        const char = Buff.toString();
        switch (char) {
          case "\n":
          case "\r":
          case "\u0004":
            process.stdin.pause();
            process.stdin.removeListener("data", handle);
            break;
          default:
            process.stdout.clearLine(0);
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`${question}${Array(rl.line.length + 1).join("*")}`);
            break;
        }
      };
      process.stdin.on("data", handle);
    }
    rl.question(`${question}`, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });

const InputRequester = async (questions: string[], hiddenInputQuestionKeys: string[]) => {
  const questionAnswers: QuestionAnswer[] = [];
  for (let i = 0; i < questions.length; i += 1) {
    const question = questions[i];
    const isSecrete = hiddenInputQuestionKeys.indexOf(question) !== -1;
    // eslint-disable-next-line no-await-in-loop
    const answer = await ask(`${question}: `, isSecrete);
    questionAnswers.push({ question, answer });
  }
  return questionAnswers;
};

export { InputRequester, QuestionAnswer };
