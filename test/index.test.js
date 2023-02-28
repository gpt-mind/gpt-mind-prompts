const chai = require('chai');
const { extractReplacementTokens, getPromptReplacementFunction, validatePrompt, getPromptDefinition } = require('../src/index');
const expect = chai.expect;
const jest = require('jest');

describe('Prompts', () => {
    describe("extractReplacementTokens", () => {
        it("should return an empty array when no replacement tokens are present", () => {
            const input = "This is a simple string.";
            const result = extractReplacementTokens(input);
            expect(result).toEqual([]);
        });

        it("should return an array of tokens when replacement tokens are present", () => {
            const input = "Hello, my name is {{name}} and I am {{age}} years old.";
            const result = extractReplacementTokens(input);
            expect(result).toEqual(["name", "age"]);
        });

        it("should return an array of unique tokens when duplicate replacement tokens are present", () => {
            const input = "{{name}} is {{age}} years old. {{name}} likes to {{activity}}.";
            const result = extractReplacementTokens(input);
            expect(result).toEqual(["name", "age", "activity"]);
        });

        it("should not return tokens that contain curly braces", () => {
            const input = "{{name}} is {{age}} years old, but {{invalid {token}} is not valid.";
            const result = extractReplacementTokens(input);
            expect(result).toEqual(["name", "age"]);
        });

        it("should not modify the input string", () => {
            const input = "Hello, my name is {{name}} and I am {{age}} years old.";
            const result = extractReplacementTokens(input);
            expect(input).toEqual("Hello, my name is {{name}} and I am {{age}} years old.");
        });
    });
    describe("getPromptReplacementFunction", () => {
        it("should return a function", () => {
            const result = getPromptReplacementFunction("Hello, {{name}}!");
            expect(typeof result).toEqual("function");
        });

        it("should return a function that replaces a single token", () => {
            const prompt = "Hello, {{name}}!";
            const replace = getPromptReplacementFunction(prompt);
            const result = replace({ name: "John" });
            expect(result).toEqual("Hello, John!");
        });

        it("should return a function that replaces multiple tokens", () => {
            const prompt = "My name is {{name}} and I am {{age}} years old.";
            const replace = getPromptReplacementFunction(prompt);
            const result = replace({ name: "John", age: 30 });
            expect(result).toEqual("My name is John and I am 30 years old.");
        });

        it("should return a function that handles missing tokens", () => {
            const prompt = "My name is {{name}} and I am {{age}} years old.";
            const replace = getPromptReplacementFunction(prompt);
            const result = replace({ name: "John" });
            expect(result).toEqual("My name is John and I am {{age}} years old.");
        });

        it("should return a function that handles extra tokens", () => {
            const prompt = "Hello, {{name}}!";
            const replace = getPromptReplacementFunction(prompt);
            const result = replace({ name: "John", age: 30 });
            expect(result).toEqual("Hello, John!");
        });
    });
    describe("validatePrompt", () => {
        it("should return true when all tokens are present in the params object", () => {
            const prompt = "Hello, {{name}}!";
            const params = { name: "John" };
            const result = validatePrompt(prompt, params);
            expect(result).toBe(true);
        });

        it("should return false when a token is missing from the params object", () => {
            const prompt = "My name is {{name}} and I am {{age}} years old.";
            const params = { name: "John" };
            const result = validatePrompt(prompt, params);
            expect(result).toBe(false);
        });

        it("should return true when there are no tokens in the prompt string", () => {
            const prompt = "Hello, World!";
            const params = {};
            const result = validatePrompt(prompt, params);
            expect(result).toBe(true);
        });

        it("should return true when there are extra properties in the params object", () => {
            const prompt = "Hello, {{name}}!";
            const params = { name: "John", age: 30 };
            const result = validatePrompt(prompt, params);
            expect(result).toBe(true);
        });
    });
    describe("getPromptDefinition", () => {
        const apiKey = "my-api-key";
        const prompt = "My name is {{name}} and I like {{food}}.";
        const params = { name: "John", food: "pizza" };
        const settings = { temperature: 0.5 };
        const promptDefinition = getPromptDefinition(prompt);

        it("should return an object with the prompt string and params array", () => {
            expect(promptDefinition.prompt).toEqual(prompt);
            expect(promptDefinition.params).toEqual(["name", "food"]);
        });

        it("should return an object with a validate function that returns true for valid params and false for invalid params", () => {
            expect(promptDefinition.validate(params)).toBe(true);
            expect(promptDefinition.validate({ name: "John" })).toBe(false);
            expect(promptDefinition.validate({})).toBe(false);
        });

        it("should return an object with a replace function that correctly replaces tokens in the prompt string", () => {
            const replacedPrompt = promptDefinition.replace(params);
            expect(replacedPrompt).toEqual("My name is John and I like pizza.");
        });

        it("should return an object with a complete function that calls the OpenAI API with the correct settings and returns the completed prompt", async () => {
            const mockComplete = jest.fn().mockResolvedValue({ data: { choices: [{ text: "I love pizza!" }] } });
            const mockOpenAI = jest.fn().mockReturnValue({ complete: mockComplete });
            const originalOpenAI = OpenAI;
            // @ts-ignore
            OpenAI = mockOpenAI;
            const response = await promptDefinition.complete(params, apiKey, settings);
            expect(mockComplete).toHaveBeenCalledWith(Object.assign({}, defaultSettings, settings, { prompt: "My name is John and I like pizza." }));
            expect(response).toEqual("I love pizza!");

            OpenAI = originalOpenAI;
        });

        it("should throw an error if the params object is invalid when calling the complete function", async () => {
            try {
                await promptDefinition.complete({ name: "John" }, apiKey, settings);
                expect(true).toBe(false);
            } catch (e) {
                expect(e.message).toEqual("Invalid params object");
            }
        });
    });

    describe("getPromptDefinitions", () => {
        const mockConsoleLog = jest.spyOn(console, "log").mockImplementation(() => { });

        afterEach(() => {
            mockConsoleLog.mockClear();
        });

        afterAll(() => {
            mockConsoleLog.mockRestore();
        });

        it("should return an array of prompt definitions", () => {
            const promptDefinitions = getPromptDefinitions();
            expect(promptDefinitions.length).toBeGreaterThan(0);
            promptDefinitions.forEach((promptDefinition) => {
                expect(promptDefinition.prompt).toBeDefined();
                expect(promptDefinition.params).toBeDefined();
                expect(promptDefinition.validate).toBeInstanceOf(Function);
                expect(promptDefinition.replace).toBeInstanceOf(Function);
                expect(promptDefinition.complete).toBeInstanceOf(Function);
            });
        });

        it("should validate each prompt definition and replace the prompt string with a valid example", () => {
            const promptDefinitions = getPromptDefinitions();
            promptDefinitions.forEach((promptDefinition) => {
                expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining(promptDefinition.prompt));
            });
        });

        it("should throw an error if a prompt is invalid", () => {
            const invalidPrompts = { invalidPrompt: "My name is {{name}} and I am {{age}} years old." };
            const originalPrompts = prompts;
            // @ts-ignore
            prompts = invalidPrompts;
            expect(() => {
                getPromptDefinitions();
            }).toThrowError("Invalid prompt: My name is {{name}} and I am {{age}} years old.");

            prompts = originalPrompts;
        });
    });
});
