// Online Typescript Editor for free
// Write, Edit and Run your Typescript code using TS Online Compiler

type Service = "BACKSTAGE" | "GITEA" | "INFISICAL";

interface IApplication {
  port: string;
  service: Service;
  env: string;
}

const backStage: IApplication = {
  port: "9000",
  service: "BACKSTAGE",
  env: "node",
};

class Orchestrator {
  port: string;
  service: string;
  env: string;
  constructor(port: string, service: string, env: string) {
    this.port = port;
    this.service = service;
    this.env = env;
  }

  validate(): Boolean {
    try {
      // if(typeof(this.service) != Service ) {
      //     throw new Error("wrong service type");
      // }

      if (this.service === backStage.service) {
        if (this.port != backStage.port) {
          throw new Error("wrong port number");
        } else if (this.env != backStage.env) {
          throw new Error("wrong env");
        } else {
          return true;
        }
      }
    } catch (error: any) {
      console.log(`error occured ${error}`);
      return false;
    }
  }
}

const obj = new Orchestrator("8000", "BACKSTAGE", "node");
let result = obj.validate();

console.log(result);
