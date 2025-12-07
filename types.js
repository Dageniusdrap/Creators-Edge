"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbortError = void 0;
// ADDED ABORT ERROR CLASS
class AbortError extends Error {
    constructor(message) {
        super(message);
        this.name = "AbortError";
    }
}
exports.AbortError = AbortError;
