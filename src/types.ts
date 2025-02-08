type Repo = {
    name: string;
    path: string;
    description: string;
    startCommand: string;
};

type Server = {
    name: string;
    port: number;
}

type ConsumerMessage = {
    users: string[];
    message: any;
}

type TestCaseAddUser = {
    action: "addUser";
    name: string;
    server: string;
    consumedBy: ConsumerMessage[];
}

type TestCaseSendMessage = {
    action: "sendMessage";
    producedBy: {
        name: string;
        message: any;
    }
    consumedBy: ConsumerMessage[];
}

type TestCaseRemoveUser = {
    action: "removeUser";
    name: string;
    consumedBy: ConsumerMessage[];
}

type TestCase = TestCaseAddUser | TestCaseSendMessage | TestCaseRemoveUser

type TestSuite = {
    name: string;
    description: string;
    testCases: TestCase[]
}

export type TestConfig = {
    repo: Repo;
    servers: Server[];
    testSuites: TestSuite[]
}