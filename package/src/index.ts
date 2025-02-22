export {EvenWsTest} from "./runTest";
export * from "./types";
import testConfig from "./dummyInput";
import {EvenWsTest} from "./runTest" 
import { TestResult } from "./types";



(async() => {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    const a = new EvenWsTest(testConfig)
    const callbackFn: (testResult: TestResult) => void = (testResult) => console.log(testResult)
    await a.run(callbackFn)
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@22")
})()