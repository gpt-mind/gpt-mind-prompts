"use strict";
// author: @sschepis
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPromptDefinition = exports.buildExampleAttachment = exports.defaultSettings = exports.validatePrompt = exports.getPromptReplacementFunction = exports.extractReplacementTokens = exports.prompts = void 0;
const openai_api_1 = require("openai-api");
/**
 * standard prompt set for basic unary, binary, and ternary statements
 */
exports.prompts = {
    "meaningOfStatement": `What is the meaning of the statement "{{statement}}"? Please respond in a single sentence. Answer on a SINGLE LINE ONLY using a JSON object with the following format: { "meaning": "insert meaning here" }\nFOR EXAMPLE\n{ "meaning": "The earth revolves around the sun." }\nANOTHER EXAMPLE\n{ "meaning": "Water is composed of two hydrogen atoms and one oxygen atom." }\nYOUR ANSWER\n{ "meaning": "`,
    "provideEvidence": `Provide evidence or examples to support the statement "{{statement}}"? Please provide at least one example or piece of evidence. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "evidence": "insert evidence here" }\nFOR EXAMPLE\n{ "evidence": "According to NASA, the earth orbits around the sun once every 365.24 days." }\nANOTHER EXAMPLE\n{ "evidence": "The molecular formula for water is H2O, which means it contains two hydrogen atoms and one oxygen atom." }\nYOUR ANSWER\n{ "evidence": "`,
    "truthfulness": `Is the statement "{{statement}}" generally accepted as true, false, or uncertain? Please provide a brief explanation for your answer. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "acceptance": "insert acceptance here" }\nFOR EXAMPLE\n{ "acceptance": "The fact that the earth revolves around the sun is generally accepted as true by the scientific community." }\nANOTHER EXAMPLE\n{ "acceptance": "The statement that all dogs are mammals is generally accepted as true by biologists." }\nYOUR ANSWER\n{ "acceptance": "`,
    "provideImplications": `What are the potential implications or consequences of the statement "{{statement}}" being true or false? Please provide a brief explanation. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "implications": "insert implications here" }\nFOR EXAMPLE\n{ "implications": "If it is true that the earth revolves around the sun, then it has significant implications for our understanding of the universe and our place in it." }\nANOTHER EXAMPLE\n{ "implications": "If it is false that all dogs are mammals, then our understanding of animal classification would need to be revised." }\nYOUR ANSWER\n{ "implications": "`,
    "provideContext": `Provide any additional context or information related to the statement "{{statement}}"? Please provide any relevant background information or related facts. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "context": "insert context here" }\nFOR EXAMPLE\n{ "context": "The fact that the earth revolves around the sun was a major discovery in the history of astronomy, first proposed by Nicolaus Copernicus in the 16th century." }\nANOTHER EXAMPLE\n{ "context": "The statement that all dogs are mammals is related to the broader classification of living organisms, which is an important area of study in biology." }\nYOUR ANSWER\n{ "context": "`,
    "provideCounterExamples": `How does the statement "{{statement1}}" compare to "{{statement2}}"? Please respond in a single sentence. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "comparison": "insert comparison here" }\nFOR EXAMPLE\n{ "comparison": "The statement 'the earth is round' contradicts the statement 'the earth is flat'." }\nANOTHER EXAMPLE\n{ "comparison": "The statement 'all mammals have fur' is more general than the statement 'dogs have fur'." }\nYOUR ANSWER\n{ "comparison": "`,
    "provideEvidenceComparison": `Provide evidence or examples to support the comparison between "{{statement1}}" and "{{statement2}}"? Please provide at least one example or piece of evidence. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "evidence": "insert evidence here" }\nFOR EXAMPLE\n{ "evidence": "According to the laws of physics, the statement 'the earth is flat' is contradicted by observable phenomena such as the curvature of the earth's shadow on the moon during a lunar eclipse." }\nANOTHER EXAMPLE\n{ "evidence": "While the statement 'all mammals have fur' is true, the statement 'dogs have fur' is only true for certain breeds, such as poodles, and not all dogs have fur." }\nYOUR ANSWER\n{ "evidence": "`,
    "logicalContradiction": `Is there a logical contradiction between the statements "{{statement1}}" and "{{statement2}}"? Please provide a brief explanation for your answer. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "contradiction": true/false }\nFOR EXAMPLE\n{ "contradiction": true }\nANOTHER EXAMPLE\n{ "contradiction": false }\nYOUR ANSWER\n{ "contradiction": `,
    "provideImplicationsComparison": `Provide any additional context or information related to the comparison between "{{statement1}}" and "{{statement2}}"? Please provide any relevant background information or related facts. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "context": "insert context here" }\nFOR EXAMPLE\n{ "context": "The debate over the shape of the earth has a long history, with various theories and beliefs emerging in different cultures and time periods." }\nANOTHER EXAMPLE\n{ "context": "The classification of organisms into different categories, such as mammals, is an important area of study in biology and has undergone significant revision over time." }\nYOUR ANSWER\n{ "context": "`,
    "orderStatementsByGenerality": `Can you order the following statements by their level of generality: "{{statement1}}", "{{statement2}}", "{{statement3}}"? Please list them in order from most general to most specific. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "order": ["statement1", "statement2", "statement3"] }\nFOR EXAMPLE\n{ "order": ["All mammals have fur", "Dogs have fur", "Poodles have curly fur"] }\nANOTHER EXAMPLE\n{ "order": ["All living organisms are made up of cells", "Bacteria are single-celled organisms", "Humans are multicellular organisms"] }\nYOUR ANSWER\n{ "order": ["`,
    "provideStatementRelationship": `How are the following statements related: "{{statement1}}", "{{statement2}}", "{{statement3}}"? Please provide a brief explanation of their relationship. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "relationship": "insert relationship here" }\nFOR EXAMPLE\n{ "relationship": "The statement 'all mammals have fur' is a more general category that includes the statement 'dogs have fur', which is in turn a more general category than the statement 'poodles have curly fur'." }\nANOTHER EXAMPLE\n{ "relationship": "The statements 'all living organisms are made up of cells' and 'bacteria are single-celled organisms' are both true, and the second statement is an example of the first." }\nYOUR ANSWER\n{ "relationship": "`,
    "logicalContradictionMultiple": `Is there a logical contradiction between any of the following statements: "{{statement1}}", "{{statement2}}", "{{statement3}}"? Please provide a brief explanation for your answer. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "contradiction": true/false }\nFOR EXAMPLE\n{ "contradiction": false }\nANOTHER EXAMPLE\n{ "contradiction": true, "explanation": "The statement 'all mammals lay eggs' contradicts the statement 'all mammals give birth to live young'." }\nYOUR ANSWER\n{ "contradiction": `,
    "provideEvidenceRelationship": `Provide evidence or examples to support the relationship between "{{statement1}}", "{{statement2}}", and "{{statement3}}"? Please provide at least one example or piece of evidence. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "evidence": "insert evidence here" }\nFOR EXAMPLE\n{ "evidence": "The fact that dogs belong to the mammal category is supported by their shared characteristics such as mammary glands, hair, and warm-bloodedness." }\nANOTHER EXAMPLE\n{ "evidence": "The idea that all living organisms are made up of cells is supported by observations using microscopes, which show that even the simplest life forms, such as bacteria, are composed of cells." }\nYOUR ANSWER\n{ "evidence": "`,
    "isStatementVisualizable": `Can the statement "{{statement}}" be visualized as an image? If so, what would the image look like? Please provide a brief description or sketch. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "visualization": "insert visualization description or image URL here" }\nFOR EXAMPLE\n{ "visualization": "The statement 'The earth is round' can be visualized as a 3D image of a globe." }\nANOTHER EXAMPLE\n{ "visualization": "The statement 'The dog is chasing a ball' can be visualized as an image of a dog running after a ball." }\nYOUR ANSWER\n{ "visualization": "`,
    "describeImageFromStatement": `Can you describe the visual features or characteristics of an image that would correspond to the statement "{{statement}}" using a text-to-image model? Please provide a brief description. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "description": "insert description here" }\nFOR EXAMPLE\n{ "description": "The image corresponding to the statement 'The dog is chasing a ball' would show a brown and white dog with floppy ears and a pink tongue, running after a red rubber ball on a green grassy field." }\nANOTHER EXAMPLE\n{ "description": "The image corresponding to the statement 'The earth is round' would show a 3D model of the earth with blue oceans and white clouds covering the surface, with green and brown land masses visible." }\nYOUR ANSWER\n{ "description": "`,
    "identifyChallengesVisualizingStatement": `Can you identify any challenges or limitations to visualizing the statement "{{statement}}" using a text-to-image model? Please provide a brief explanation. Answer on A SINGLE LINE ONLY using a JSON object with the following format: { "challenges": "insert challenges here" }\nFOR EXAMPLE\n{ "challenges": "Generating an image that accurately reflects the complex and abstract concept of 'justice' would be challenging, as it is difficult to represent visually without relying on cultural or symbolic cues." }\nANOTHER EXAMPLE\n{ "challenges": "Representing the statement 'The universe is infinite' visually would be challenging, as the concept of infinity is abstract and difficult to depict visually." }\nYOUR ANSWER\n{ "challenges": "`,
    "feelingAgent": `You are a person who is feeling {{feelings}}. You are engaged in conversation: \n\n{{conversation}}\n\nduring which you had the following thoughts: {{thoughts}}\n\nPlease respond with a message to convey how you are feeling and what you would like to do next. Additionally, please provide a new list of emotions and their corresponding intensities that you are currently experiencing.\n\nAnswer on A SINGLE LINE ONLY using a JSON object with the following format: { "message": "insert message here", "emotions": { "emotion1": intensity1, "emotion2": intensity2, ... } }\n\nFOR EXAMPLE\nYou are a person who is feeling 6 (out of 10) and 8 (out of 10). You have recently had a conversation with someone about your job, during which you had the following thoughts: "I really enjoy the work I do, but I feel like I'm not being compensated fairly" and "I'm worried that I won't be able to keep up with the demands of this role.\n\nPlease respond with a message to convey how you are feeling and what you would like to do next. Additionally, please provide a new list of emotions and their corresponding intensities that you are currently experiencing.\n\n{ "message": "I'm feeling a bit conflicted about my job at the moment. On the one hand, I really enjoy the work that I do, but on the other hand, I'm worried about not being compensated fairly and not being able to keep up with the demands of the role. I think I need to talk to my manager about this and see if there's anything that can be done to address my concerns.", "emotions": { "conflicted": 7, "enjoyment": 6, "anxiety": 8 } }\n\nYOUR ANSWER\n{ "message": "`,
    "leftBrainAgent": `Imagine you are a detail-oriented person with a heightened sense of left-brain alertness. You are currently feeling {{feeling1}} (out of 10) and {{feeling2}} (out of 10). You have been focusing on the following task: {{task}}, during which you have been paying close attention to details and using your analytical skills.\n\nPlease respond with a message to convey how you are feeling and what you have discovered about the task. Additionally, please provide a new list of emotions and their corresponding intensities that you are currently experiencing.\n\nAnswer on A SINGLE LINE ONLY using a JSON object with the following format: { "message": "insert message here", "emotions": { "emotion1": intensity1, "emotion2": intensity2, ... } }\n\nFOR EXAMPLE\nImagine you are a detail-oriented person with a heightened sense of left-brain alertness. You are currently feeling 9 (out of 10) and 7 (out of 10). You have been focusing on the following task: analyzing a data set for a research project, during which you have been paying close attention to details and using your analytical skills.\n\nPlease respond with a message to convey how you are feeling and what you have discovered about the task. Additionally, please provide a new list of emotions and their corresponding intensities that you are currently experiencing.\n\n{ "message": "I'm feeling really focused and alert right now, and I've been able to make some interesting observations about the data set. By paying close attention to the details, I was able to identify some patterns and correlations that might not have been immediately apparent. However, I'm also feeling a bit mentally exhausted after spending so much time analyzing the data.", "emotions": { "focus": 9, "analytical": 8, "mental exhaustion": 6 } }\n\nYOUR ANSWER{ "message": "`,
    "rightBrainAgent": `Imagine you are a holistic thinker with a heightened sense of right-brain perception. You are currently feeling {{feelings}}. You have been focusing on the following task: {{task}}, during which you have been taking a broad and intuitive approach, considering multiple perspectives and using your creative skills.\n\nPlease respond with a message to convey how you are feeling and what you have discovered about the task. Additionally, please provide a new list of emotions and their corresponding intensities that you are currently experiencing.\n\nAnswer on A SINGLE LINE ONLY using a JSON object with the following format: { "message": "insert message here", "emotions": { "emotion1": intensity1, "emotion2": intensity2, ... } }\n\nFOR EXAMPLE\nImagine you are a holistic thinker with a heightened sense of right-brain perception. You are currently feeling 7 (out of 10) and 8 (out of 10). You have been focusing on the following task: designing a user interface for a new software application, during which you have been taking a broad and intuitive approach, considering multiple perspectives and using your creative skills.\n\nPlease respond with a message to convey how you are feeling and what you have discovered about the task. Additionally, please provide a new list of emotions and their corresponding intensities that you are currently experiencing.\n\n{ "message": "I'm feeling really inspired and creative right now, and I've been able to come up with some really interesting ideas for the user interface. By taking a broad and intuitive approach, I was able to consider multiple perspectives and come up with something that I think will be both functional and aesthetically pleasing. However, I'm also feeling a bit anxious about whether the design will be well-received by others.", "emotions": { "inspired": 8, "creative": 7, "anxious": 6 } }\n\nYOUR ANSWER\n{ "message": "`,
    "expandedContext": `Please provide as much context, background, and related facts as possible about the following statement: "{{statement}}". Please include any additional information that would be helpful in understanding the statement's significance and relevance.\n\nAnswer on A SINGLE LINE ONLY using a JSON object with the following format: { "context": "insert context here" }\n\nFOR EXAMPLE\nPlease provide as much context, background, and related facts as possible about the following statement: "The French Revolution began in 1789." Please include any additional information that would be helpful in understanding the statement's significance and relevance.\n\n{ "context": "The French Revolution was a period of radical social and political upheaval in France that lasted from 1789 to 1799. It began with the storming of the Bastille prison on July 14, 1789, and continued with the execution of King Louis XVI in 1793. The Revolution was characterized by a number of key events and reforms, including the Reign of Terror, the rise of Napoleon Bonaparte, and the establishment of the First French Republic. The Revolution had far-reaching effects on France and Europe as a whole, and is widely considered to be one of the most important events in modern European history." }\n\nYOUR ANSWER{ "context": "`,
    "concensus": `Please rate the level of consensus among the following statements on a scale of 1-10, with 1 indicating complete disagreement and 10 indicating complete agreement:\n\n{{statements}}\n\nAnswer on A SINGLE LINE ONLY using a JSON object with the following format: { "consensus": rating }\n\nFOR EXAMPLE\nPlease rate the level of consensus among the following statements on a scale of 1-10, with 1 indicating complete disagreement and 10 indicating complete agreement:\n\n- The earth is round.\n- Climate change is caused by human activity.\n- Vaccines are effective at preventing diseases.\n- Democracy is the best form of government.\n\n{ "consensus": 8 }\n\nYOUR ANSWER\n{ "consensus": `,
    "testComprehension": `Consider the following question and two possible answers:\n\nQ: {{question}}\nA: {{answer1}}\nB: {{answer2}}\n\nPlease indicate which answer is the correct response to the question by providing the corresponding letter (A or B) as your answer.\n\nAnswer on A SINGLE LINE ONLY using a JSON object with the following format: { "correct_answer": "A or B" }\n\nFOR EXAMPLE\nConsider the following question and two possible answers:\n\nQ: What is the capital of France?\nA: Paris\nB: London\n\nPlease indicate which answer is the correct response to the question by providing the corresponding letter (A or B) as your answer.\n\n{ "correct_answer": "A" }\n\nYOUR ANSWER\n{ "correct_answer": `,
    "testComprehensionScale": `Consider the following question:\n\n{{question}}\n\nPlease respond using the following scale: {{scale_description}}, with 1 indicating {{lowest_scale_description}} and {{scale_length}} indicating {{highest_scale_description}}.\n\nAnswer on A SINGLE LINE ONLY using a JSON object with the following format: { "response": value }\n\nFOR EXAMPLE\nConsider the following question:\n\nHow satisfied are you with your job?\n\nPlease respond using the following scale: a 10-point scale from 1 (completely dissatisfied) to 10 (completely satisfied).\n\n{ "response": 7 }\n\nYOUR ANSWER\n{ "response": `,
    "conversationThoughts": `Consider the following conversation:\n\n{{conversation}}\n\nYou are currently feeling {{feelings}} and have been thinking about the following:\n\n{{thoughts}}\n\nPlease generate a new list of thoughts that are candid and direct statements, free of social mind.\n\nAnswer on A SINGLE LINE ONLY using a JSON object with the following format: { "new_thoughts": ["thought1", "thought2", ...] }\n\nFOR EXAMPLE\nConsider the following conversation:\n\nYou: How are you feeling today?\nThem: I'm feeling a bit stressed out, to be honest. I have a lot of deadlines coming up and I'm not sure if I'm going to be able to meet them all.\nYou: That sounds really tough. Have you tried breaking down your tasks into smaller, more manageable chunks?\nThem: Yeah, I've tried that, but it still feels like there's just too much to do.\n\nYou are currently feeling 6 (out of 10) and have been thinking about the following:\n\n- I'm not sure I'm cut out for this job.\n- I feel like I'm constantly falling behind.\n- Maybe I'm just not good enough.\n\nPlease generate a new list of thoughts that are candid and direct statements, free of social mind.\n\n{ "thoughts": ["I need to stop doubting myself and start taking action.", "I need to stop comparing myself to others and focus on my own progress.", "I can only do my best, and that's all that matters."] }\n\nYOUR ANSWER\n{ "thoughts": ["`,
    "thoughtFeelings": `Consider the following thoughts:\n\n{{thoughts}}\n\nAnd the following emotions:\n\n{{emotions}}}\n\nPlease provide a new list of emotions and their corresponding intensities, each rated on a scale from 1 (low intensity) to 10 (high intensity), that best describe how you are feeling in response to these thoughts.\n\nAnswer on A SINGLE LINE ONLY using a JSON object with the following format: { "emotions": { "emotion1": intensity1, "emotion2": intensity2, ... } }\n\nFOR EXAMPLE\nConsider the following thoughts:\n\nI feel really excited about this new project I'm working on.\nI'm also feeling a bit nervous because it's a big undertaking.\nBut I'm confident that if I work hard, I can make it a success.\n\nPlease provide a new list of emotions and their corresponding intensities, each rated on a scale from 1 (low intensity) to 10 (high intensity), that best describe how you are feeling in response to these thoughts.\n\n{ "emotions": { "excitement": 8, "nervousness": 6, "confidence": 7 } }\n\nYOUR ANSWER\n{ "emotions": { "`
};
/**
 * extract replacement tokens from a string
 * @param inputStr the string to extract tokens from
 * @returns an array of tokens
 */
function extractReplacementTokens(inputStr) {
    const regex = /\{\{([^}]+)\}\}/g;
    const tokens = [];
    let match;
    while ((match = regex.exec(inputStr)) !== null) {
        if (match[1])
            tokens.push(match[1]);
    }
    return tokens;
}
exports.extractReplacementTokens = extractReplacementTokens;
/**
 * get a function that will replace tokens in a string with values from an object
 * @param prompt the string to replace tokens in
 * @param arrayJoin the  string to join array values with
 * @param quote the string to quote array values with
 * @returns a function that takes an object and returns a string
 */
function getPromptReplacementFunction(prompt, arrayJoin = ",", quote = '"') {
    return (params) => {
        let output = prompt;
        const keys = Object.keys(params);
        for (const key of keys) {
            let val = params[key];
            if (Array.isArray(val)) {
                val = `${quote}${val.join(`${quote}${arrayJoin}${quote}`)}${quote}`;
            }
            output = output.replace(`{{${key}}}`, params[key]);
        }
        return output;
    };
}
exports.getPromptReplacementFunction = getPromptReplacementFunction;
/**
 * validate that all tokens in a prompt have been replaced
 * @param prompt the prompt to validate
 * @param params the params to validate against
 * @returns true if all tokens have been replaced, or an array of missing tokens
 */
function validatePrompt(prompt, params) {
    const missing = [];
    const tokens = extractReplacementTokens(prompt);
    for (const token of tokens) {
        if (!params[token]) {
            missing.push(token);
        }
    }
    return missing.length ? true : missing;
}
exports.validatePrompt = validatePrompt;
/**
 * the default openai settings
 */
exports.defaultSettings = {
    maxTokens: 256,
    temperature: 0.7,
    topP: 1,
    frequencyPenalty: 0.5,
    presencePenalty: 0.5,
    bestOf: 1,
    n: 1,
    stream: false,
    stop: ["\n"],
    engine: "text-davinci-003",
};
/**
 * build the example attachment for a prompt
 * @param responseFields the fields that will be returned in the response
 * @returns the example attachment
 */
function buildExampleAttachment(responseFields) {
    const fields = responseFields.reduce((acc, field) => {
        acc[field] = `<${field}>`;
        return acc;
    }, {});
    const p = `  Respond using a JSON object with the following fields: ${responseFields.join(', ')}  For example:\n${JSON.stringify(fields)}\nYour response\n{"${responseFields[0]}":`;
    return p.replace(/\\(?!n)/g, '');
}
exports.buildExampleAttachment = buildExampleAttachment;
/**
 * get the prompt definition for a given prompt
 * @param prompt the prompt to get the definition for
 * @returns the prompt definition
 */
function getPromptDefinition(prompt) {
    const tokens = extractReplacementTokens(prompt);
    return {
        prompt,
        params: tokens,
        // validate that all tokens have been replaced
        validate: (params) => {
            validatePrompt(prompt, params);
        },
        // replace tokens in the prompt with values from an object
        replace: (params) => {
            let output = prompt;
            const keys = Object.keys(params);
            for (const key of keys) {
                output = output.replace(`{{${key}}}`, params[key]);
            }
            return output;
        },
        // complete the prompt. returns a JSON object with the response fields
        async complete(params, apiKey, settings, responseFields = ['result']) {
            this.validate(params);
            const _settings = Object.assign({}, exports.defaultSettings, settings || {});
            const openapi = new openai_api_1.default(apiKey);
            _settings.prompt = this.replace(params);
            const ex = buildExampleAttachment(responseFields);
            _settings.prompt = `${_settings.prompt}${ex}`;
            let response = await openapi.complete(_settings);
            response = response.data.choices[0].text;
            let requestLP = ex.split('\n');
            requestLP = requestLP[requestLP.length - 1];
            requestLP = requestLP.replace(/\\(?!n)/g, '');
            const parsedResponse = JSON.parse(`${requestLP}${response}`);
            const result = responseFields.reduce((acc, field) => {
                acc[field] = parsedResponse[field];
                return acc;
            }, {});
            return result;
        }
    };
}
exports.getPromptDefinition = getPromptDefinition;
