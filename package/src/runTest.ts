import { TestConfig, TestResult, TestSuite } from "./types";
import { Worker } from "worker_threads";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import { initLogger } from "./function/initLogger";
import startServer from "./function/startServer";
import { dataScript } from "./function/dataScript";

export class EvenWsTest {
  private readonly testConfig: TestConfig;
  private readonly numThreads: number;
  private workerPool: Worker[];
  private readonly workerPath: string;
  private finalTestResult: TestResult[];
  private mutex: Promise<void>;
  private testSuites: TestSuite[];

  constructor(testConfig: TestConfig) {
    this.testConfig = testConfig;
    this.numThreads =
      os.cpus().length < this.testConfig.testSuites.length
        ? os.cpus().length
        : this.testConfig.testSuites.length;
    this.workerPool = [];
    this.workerPath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "./worker.js"
    );
    this.finalTestResult = [];
    this.mutex = Promise.resolve();
    this.testSuites = this.testConfig.testSuites;
  }

  public async run(
    callbackFn: (testResult: TestResult) => any
  ): Promise<TestResult[]> {
    //Creating the necessary log files
    await initLogger(this.testConfig.servers);

    //Run the init script
    await dataScript(
      this.testConfig.dataScript.init,
      this.testConfig.dataScript.initTimeout
    );

    //Start the websocket servers
    this.testConfig.servers.forEach((server) => {
      const startCommand: string = this.testConfig.repo.startCommand.replace(
        "$$$$",
        `${server.port}`
      );
      startServer(server.name, this.testConfig.repo.path, startCommand);
    });

    //Create the worker threads and assign the test suites to it.
    const testResults: TestResult[] = await this.createWorkers(callbackFn);

    //Run the cleanUp script
    await dataScript(
      this.testConfig.dataScript.cleanUp,
      this.testConfig.dataScript.cleanUpTimeout
    );
    
    //Terminate all the worker threads
    this.workerPool.forEach(async (worker: Worker) => {
      await worker.terminate();
    });
    return testResults;
  }

  private async assignTask(worker: Worker): Promise<void> {
    //Mutex is used to ensure test cases are synchronously assigned to the worker threads. Here mutex is implemented using the sequential execution pattern using promises in node js
    this.mutex = this.mutex
      .then(async () => {
        const testSuite: TestSuite | undefined = this.testSuites.shift();
        if (testSuite) {
          worker.postMessage(testSuite);
        } else {
          console.log("No test suite to assign to the worker");
        }
      })
      .catch((err) => {
        console.error("Error when assigning task to the worker threads");
      });

    return this.mutex;
  }

  private async createWorkers(
    callbackFn: (testResult: TestResult) => any
  ): Promise<TestResult[]> {
    return new Promise((res) => {
      for (let i = 0; i < this.numThreads; i++) {
        const worker: Worker = new Worker(this.workerPath);
        this.workerPool.push(worker);
        worker.on("message", (testResult: TestResult) => {
          callbackFn(testResult);
          this.finalTestResult.push(testResult);
          if (this.finalTestResult.length === this.testConfig.totalTestCases) {
            res(this.finalTestResult);
          }
          this.assignTask(worker);
        });

        worker.on("error", (error) => {
          console.error(
            "Worker Thread: Error while processing the test suite",
            error
          );
        });

        this.assignTask(worker);
      }
    });
  }
}
