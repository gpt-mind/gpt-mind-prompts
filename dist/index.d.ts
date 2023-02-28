export declare const prompts: any;
export declare function getPromptReplacementFunction(prompt: string): (params: any) => string;
export declare function validatePrompt(prompt: string, params: any): boolean;
export declare function getPromptDefinition(prompt: string): {
    prompt: string;
    params: any;
    validate: (params: any) => boolean;
    replace: (params: any) => string;
};
export declare function getPromptDefinitionList(): void;
