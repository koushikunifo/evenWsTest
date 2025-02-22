import { spawn } from "child_process";
import { logToFile } from "./initLogger";

const startServer = (name:string, path:string, command:string):void => {
  const serverProcess = spawn(command, { cwd: path, shell: true });
  serverProcess.stdout.on("data", async(data) => {
    logToFile(name,data)
  });

  serverProcess.stderr.on("data", async(data) => {
    logToFile(name,data)
  });

  serverProcess.on("close", (code) => {
    console.log(`Server exited with code ${code}`);
  });
};

export default startServer
