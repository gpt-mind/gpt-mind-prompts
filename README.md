# GPT Mind Prompts

This repository contains a collection of prompts for the [GPT-3](https://openai.com/blog/openai-api/) API.

## Installing

```bash
npm install @gpt-mind/prompts
```

## Usage

```js
const prompts = require('@gpt-mind/prompts');


const definition = prompts.getPromptDefinition(`given the following three statements:
"{{statement1}}"
"{{statement2}}", and 
"{{statement3}}", which top two statements are most likely to be true?`);

const statements = {
  statement1: 'The sky is blue.',
  statement2: 'The sky is green.',
  statement3: 'The sky is red.',
};

if (definition.validate(statements)) { // check that all required params are present
  const response = await definition.complete(params, apiKey, {}, ['mostlikely', 'nextmostlikely']);
  console.log(response); // { "mostlikely": "The sky is blue.", "nextmostlikely": "The sky is green." }
}
```

## Function Signature

```ts
function getPromptDefinition(prompt: string): PromptDefinition
```

## Description

This function gets the prompt definition object based on a given prompt string. It extracts replacement tokens from the prompt string, and creates an object with properties for prompt, params, validate, replace, and complete.

The validate property checks if all required parameters are present in the params object. The replace property replaces all replacement tokens in the prompt string with their corresponding values from the params object. The complete property uses an OpenAI API to complete the given prompt with a valid response.

## Parameters

**prompt** - A string representing the prompt to generate the prompt definition object for.
Return Value
Returns an object of type PromptDefinition which contains the following properties:

### prompt
A string representing the original prompt.
- params - An array of strings representing the replacement tokens in the prompt string.

### validate
A function that validates the params object to make sure all required params are present. It takes one parameter:
- params - An object containing the parameter values.
Returns a boolean value indicating whether the params object is valid or not.

### replace
A function that replaces all replacement tokens in the prompt string with their corresponding values from the params object. It takes one parameter:
- params - An object containing the parameter values.
Returns a string representing the prompt with replacement tokens replaced by their values.

### complete
A function that uses the OpenAI API to complete the given prompt with a valid response. It takes three parameters:
- params - An object containing the parameter values.
- apiKey - A string representing the API key to use for the OpenAI API.
- settings - An optional object containing additional settings to use for the OpenAI API.
- responseFields - An optional array of strings representing the fields to return from the OpenAI API response. Defaults to ['results'].
Returns a Promise that resolves to a string representing the completed prompt.

## Example Usage

```typescript
const apiKey = 'my-api-key';

const prompt = 'My name is {{name}} and I like {{food}}.';
const params = { name: 'John', food: 'pizza' };
const promptDefinition = getPromptDefinition(prompt);

if (promptDefinition.validate(params)) {
  const completedPrompt = await promptDefinition.complete(params, apiKey);
  console.log(promptDefinition.replace(params) + completedPrompt);
}
```

## Prompts

- meaningOfStatement - What does this statement mean?
- provideEvidence - Provide evidence for this statement.
- truthfulness - Is this statement true?
- provideImplications - Provide implications for this statement.
- provideContext - Provide context for this statement.
- provideCounterExamples - Provide counter examples for this statement.
- provideEvidenceComparison - Provide evidence for this statement compared to this other statement.
- logicalContradiction - Is this statement a logical contradiction?
- provideImplicationsComparison - Provide implications for this statement compared to this other statement.
- orderStatementsByGenerality - Order these statements by generality.
- provideStatementRelationship - Provide a relationship between these two statements.
- logicalContradictionMultiple - Is this statement a logical contradiction with these other statements?
- provideEvidenceRelationship - Provide evidence for this statement compared to this other statement.
- isStatementVisualizable - Is this statement visualizable?
- describeImageFromStatement - Describe an image from the statement
- identifyChallengesVisualizingStatement - Identify challenges visualizing this statement.
- feelingAgent - provide a conversational response given an emotional state and current conversation
- leftBrainAgent - provide a conversational response given a left brain state and current conversation
- rightBrainAgent - provide a conversational response given a right brain state and current conversation
- expandedContext - provide a conversational response given a context and current conversation
- concensus - provide a conversational response given a concensus and current conversation
- testComprehension - provide a conversational response given a test and current conversation
- testComprehensionScale - provide a conversational response given a test and current conversation
- conversationThoughts - provide a conversational response given a thought and current conversation
- thoughtFeelings - provide a conversational response given a thought and current conversation

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for more information.





------
summary with usage:


# GPT Mind Prompts

A library for generating prompts for the [GPT-3](https://openai.com/blog/openai-api/) API. contains a number of pre-generated prompts as well as a function for generating your own. The function allows you to create prompts with replacement tokens that can be replaced with values from a params object, giving an easy programmatic interface for calling propmpts.

## Installing

```bash
npm install @gpt-mind/prompts
```

## Usage

### Example 1
```js
const prompts = require('@gpt-mind/prompts');
const definition = prompts.getPromptDefinition(prompts.meaningOfStatement);

const params = {
  statement: 'The sky is blue.',
};

if (definition.validate(params)) {
  const completedPrompt = await definition.complete(params, apiKey);
  console.log(definition.replace(params) + completedPrompt);
}
```

### Example 2
```js
const prompts = require('@gpt-mind/prompts');
const definition = prompts.getPromptDefinition(`My name is {{name}} and I like {{food}}.`);
const params = { name: 'John', food: 'pizza' };

if (definition.validate(params)) {
  const completedPrompt = await definition.complete(params, apiKey);
  console.log(definition.replace(params) + completedPrompt);
}
```