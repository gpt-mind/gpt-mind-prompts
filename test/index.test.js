import chai from 'chai';

import * as Prompts from '../src/index';

const expect = chai.expect;

describe('Prompts', () => {
    describe('export', () => {
        it('should export getPromptDefinition', () => {
            expect(Prompts.getPromptDefinition).to.be.a('function');
        });
        it('should export validatePrompt', () => {
            expect(Prompts.validatePrompt).to.be.a('function');
        });
        it('should export getPromptReplacementFunction', () => {
            expect(Prompts.getPromptReplacementFunction).to.be.a('function');
        });
        it('should export extractReplacementTokens', () => {
            expect(Prompts.extractReplacementTokens).to.be.a('function');
        });
        it('should export prompts', () => {
            expect(Prompts.prompts).to.be.an('object');
        });
    });
    describe('getPromptDefinition', () => {
        it('should return a prompt definition', () => {
            const prompt = Prompts.getPromptDefinition('name');
            expect(prompt).to.be.an('object');
            expect(prompt).to.have.property('prompt');
            expect(prompt).to.have.property('params');
            expect(prompt).to.have.property('validate');
            expect(prompt).to.have.property('replace');
        });
    });
    describe('validatePrompt', () => {
        it('should return true for valid prompt', () => {
            const valid = Prompts.validatePrompt('name', 'test');
            expect(valid).to.be.true;
        });
        it('should return false for invalid prompt', () => {
            const valid = Prompts.validatePrompt('name', '');
            expect(valid).to.be.false;
        });
    });
    describe('getPromptReplacementFunction', () => {
        it('should return a function', () => {
            const fn = Prompts.getPromptReplacementFunction('name');
            expect(fn).to.be.a('function');
        });
    });;
});

