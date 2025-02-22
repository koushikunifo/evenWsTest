import { parentPort, threadId } from "worker_threads";
import { TestResult, TestSuite } from "./types";

if (parentPort) {
  parentPort.on("message", async(testSuite: TestSuite) => {
    for (let testCase of testSuite.testCases) {
      console.log(
        `${threadId} is executing test suite with id: ${testCase.id}`
      );
    //   const testResult: TestResult = {
    //     testSuiteId: testSuite.id,
    //     testCaseId: testCase.id,
    //     isPassed: true,
    //     message: "",
    //   };

      const randomTime: number = Math.floor(Math.random() * (15 - 10 + 1));
      async function fakeAsyncFunction() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
                testSuiteId: testSuite.id,
                testCaseId: testCase.id,
                isPassed: true,
                message: `${randomTime}`,
              });
          }, randomTime*1000);
        });
      }


        let testResult = await fakeAsyncFunction();
        parentPort?.postMessage(testResult);


    //   parentPort?.postMessage(testResult);
    }
  });
} else {
  console.error("Parent port error");
}
