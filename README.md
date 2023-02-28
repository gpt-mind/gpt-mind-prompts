# GPT Mind Prompts

This repository contains a collection of prompts for the [GPT-3](https://openai.com/blog/openai-api/) API.

## Installing

```bash
npm install @gpt-mind/prompts
```

## Usage

```js
const prompts = require('@gpt-mind/prompts');
const definition = prompts.get('definition');
const prompt = definition.replace({ word: 'hello' });
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