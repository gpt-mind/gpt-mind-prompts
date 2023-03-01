/**
 * standard prompt set for basic unary, binary, and ternary statements
 */
export declare const prompts: any;
/**
 * extract replacement tokens from a string
 * @param inputStr the string to extract tokens from
 * @returns an array of tokens
 */
export declare function extractReplacementTokens(inputStr: string): string[];
/**
 * get a function that will replace tokens in a string with values from an object
 * @param prompt the string to replace tokens in
 * @param arrayJoin the  string to join array values with
 * @param quote the string to quote array values with
 * @returns a function that takes an object and returns a string
 */
export declare function getPromptReplacementFunction(prompt: any, arrayJoin?: string, quote?: string): (params: {
    [x: string]: any;
}) => any;
/**
 * validate that all tokens in a prompt have been replaced
 * @param prompt the prompt to validate
 * @param params the params to validate against
 * @returns true if all tokens have been replaced, or an array of missing tokens
 */
export declare function validatePrompt(prompt: any, params: {
    [x: string]: any;
}): true | string[];
/**
 * the default openai settings
 */
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
 * build the example attachment for a prompt
 * @param responseFields the fields that will be returned in the response
 * @returns the example attachment
 */
export declare function buildExampleAttachment(responseFields: any): string;
/**
 * get the prompt definition for a given prompt
 * @param prompt the prompt to get the definition for
 * @returns the prompt definition
 */
export declare function getPromptDefinition(prompt: string): {
    prompt: string;
    params: string[];
    validate: (params: {
        [x: string]: any;
    }) => void;
    replace: (params: {
        [x: string]: any;
    }) => string;
    complete(params: any, apiKey: any, settings: any, responseFields?: string[]): Promise<any>;
};
