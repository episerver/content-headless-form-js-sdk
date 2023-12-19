/**
 * Represent type of API exception
 */
export interface ProblemDetail {
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    traceId: string;
}