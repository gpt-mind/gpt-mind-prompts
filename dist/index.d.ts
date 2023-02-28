import { CompletionOpts } from "openai-api";
export declare const prompts: any;
/**
 * get a function that will replace {{tokens}} in a string with values from a params object
 * @param prompt the prompt string to replace tokens in
 * @returns the replacement function
 */
export declare function getPromptReplacementFunction(prompt: string): (params: any) => string;
/**
 * validate a prompt string against a params object
 * @param prompt the prompt string to validate
 * @param params the params object to validate against
 * @returns true if all required tokens are present in the params object, false otherwise
 */
export declare function validatePrompt(prompt: string, params: any): boolean;
export declare const defaultSettings: {
    maxTokens: number;
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    bestOf: number;
    n: number;
    stream: boolean;
    stop: string[];
    engine: string;
};
/**
 * @function getPromptDefinition
 * @description This function gets the prompt definition object based on a given prompt string. It extracts replacement tokens from the prompt string, and creates an object with properties for prompt, params, validate, replace and complete. The validate property checks if all required parameters are present in the params object. The replace property replaces all replacement tokens in the prompt string with their corresponding values from the params object. The complete property uses an OpenAI API to complete the given prompt with a valid response.
 * @param {string} prompt
 * @returns {object} prompt definition object
 */
export declare function getPromptDefinition(prompt: string): {
    prompt: string;
    params: any;
    validate: (params: any) => boolean;
    replace: (params: any) => string;
    complete: (params: any, apiKey: string, settings: CompletionOpts | undefined) => Promise<string | undefined>;
};
/**
 * get the prompt definiitions for all the prompts in this file
 */
export declare function getPromptDefinitions(): void;
