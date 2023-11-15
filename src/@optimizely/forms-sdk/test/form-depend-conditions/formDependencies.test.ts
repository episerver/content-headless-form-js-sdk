import { Condition, FormDependConditions, FormElementBase, FormSubmission, InputElementBase } from "../../src";

describe("Test FormDependConditions class", () => {
    let formDependConditions: FormDependConditions
    let formSubmissions: FormSubmission[]
    let element: FormElementBase
    describe("Test checkConditions function", () => {
        beforeAll(() => {
            formSubmissions = [
                {
                    elementKey: "1490ca1deeb744f1aa7c33db0aefe5a8",
                    value: "11"
                },
                {
                    elementKey: "2490ca1deeb744f1aa7c33db0aefe5a8",
                    value: "22"
                },
                {
                    elementKey: "3490ca1deeb744f1aa7c33db0aefe5a8",
                    value: "33"
                },
                {
                    elementKey: "4490ca1deeb744f1aa7c33db0aefe5a8",
                    value: "44"
                }
            ]
        });
        describe("Test single condition", () => {
            describe("Test Contains condition", () => {
                test("When value of the element in formSubmissions contain dependencies fieldValue, should return true", () => {
                    element = {
                        properties: {
                            satisfiedAction: "show",
                            conditionCombination: "Any",
                            conditions: [
                                {
                                    "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "Contains",
                                    "fieldValue": "1"
                                }
                            ]
                        }
                    } as InputElementBase;
                    formDependConditions = new FormDependConditions(element)
                    expect(formDependConditions.checkConditions(formSubmissions)).toBeTruthy();
                });
                test("When value of the element in formSubmissions do not contain dependencies fieldValue, should return false", () => {
                    element = {
                        properties: {
                            satisfiedAction: "show",
                            conditionCombination: "Any",
                            conditions: [
                                {
                                    "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "Contains",
                                    "fieldValue": "2"
                                }
                            ]
                        }
                    } as InputElementBase;
                    formDependConditions = new FormDependConditions(element)
                    expect(formDependConditions.checkConditions(formSubmissions)).toBeFalsy();
                });
            });
            describe("Test NotContains condition", () => {
                test("When value of the element in formSubmissions contain dependencies fieldValue, should return false", () => {
                    element = {
                        properties: {
                            satisfiedAction: "show",
                            conditionCombination: "Any",
                            conditions: [
                                {
                                    "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "NotContains",
                                    "fieldValue": "1"
                                }
                            ]
                        }
                    } as InputElementBase;
                    formDependConditions = new FormDependConditions(element)
                    expect(formDependConditions.checkConditions(formSubmissions)).toBeFalsy();
                });
                test("When value of the element in formSubmissions do not contain dependencies fieldValue, should return true", () => {
                    element = {
                        properties: {
                            satisfiedAction: "show",
                            conditionCombination: "Any",
                            conditions: [
                                {
                                    "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "NotContains",
                                    "fieldValue": "2"
                                }
                            ]
                        }
                    } as InputElementBase;
                    formDependConditions = new FormDependConditions(element)
                    expect(formDependConditions.checkConditions(formSubmissions)).toBeTruthy();
                });
            });
            describe("Test Equals condition", () => {
                test("When value of the element in formSubmissions is equal to dependencies fieldValue, should return true", () => {
                    element = {
                        properties: {
                            satisfiedAction: "show",
                            conditionCombination: "Any",
                            conditions: [
                                {
                                    "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "Equals",
                                    "fieldValue": "11"
                                }
                            ]
                        }
                    } as InputElementBase;
                    formDependConditions = new FormDependConditions(element)
                    expect(formDependConditions.checkConditions(formSubmissions)).toBeTruthy();
                });
                test("When value of the element in formSubmissions is not equal to dependencies fieldValue, should return false", () => {
                    element = {
                        properties: {
                            satisfiedAction: "show",
                            conditionCombination: "Any",
                            conditions: [
                                {
                                    "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "Equals",
                                    "fieldValue": "112"
                                }
                            ]
                        }
                    } as InputElementBase;
                    formDependConditions = new FormDependConditions(element)
                    expect(formDependConditions.checkConditions(formSubmissions)).toBeFalsy();
                });
            });
            describe("Test NotEquals condition", () => {
                test("When value of the element in formSubmissions is equal to dependencies fieldValue, should return false", () => {
                    element = {
                        properties: {
                            satisfiedAction: "show",
                            conditionCombination: "Any",
                            conditions: [
                                {
                                    "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "NotEquals",
                                    "fieldValue": "11"
                                }
                            ]
                        }
                    } as InputElementBase;
                    formDependConditions = new FormDependConditions(element)
                    expect(formDependConditions.checkConditions(formSubmissions)).toBeFalsy();
                });
                test("When value of the element in formSubmissions is not equal to dependencies fieldValue, should return true", () => {
                    element = {
                        properties: {
                            satisfiedAction: "show",
                            conditionCombination: "Any",
                            conditions: [
                                {
                                    "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "NotEquals",
                                    "fieldValue": "112"
                                }
                            ]
                        }
                    } as InputElementBase;
                    formDependConditions = new FormDependConditions(element)
                    expect(formDependConditions.checkConditions(formSubmissions)).toBeTruthy();
                });
            });
            describe("Test MatchRegularExpression condition", () => {
                test("When value of the element in formSubmissions is match with dependencies fieldValue, should return true", () => {
                    element = {
                        properties: {
                            satisfiedAction: "show",
                            conditionCombination: "Any",
                            conditions: [
                                {
                                    "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "MatchRegularExpression",
                                    "fieldValue": "1+"
                                }
                            ]
                        }
                    } as InputElementBase;
                    formDependConditions = new FormDependConditions(element)
                    expect(formDependConditions.checkConditions(formSubmissions)).toBeTruthy();
                });
                test("When value of the element in formSubmissions is not match with dependencies fieldValue, should return false", () => {
                    element = {
                        properties: {
                            satisfiedAction: "show",
                            conditionCombination: "Any",
                            conditions: [
                                {
                                    "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "MatchRegularExpression",
                                    "fieldValue": "2+"
                                }
                            ]
                        }
                    } as InputElementBase;
                    formDependConditions = new FormDependConditions(element)
                    expect(formDependConditions.checkConditions(formSubmissions)).toBeFalsy();
                });
            });
            describe("Test NotApplicable condition", () => {
                test("When conditionCombination is Any, should return false", () => {
                    element = {
                        properties: {
                            satisfiedAction: "show",
                            conditionCombination: "Any",
                            conditions: [
                                {
                                    "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "NotApplicable",
                                    "fieldValue": ""
                                }
                            ]
                        }
                    } as InputElementBase;
                    formDependConditions = new FormDependConditions(element)
                    expect(formDependConditions.checkConditions(formSubmissions)).toBeFalsy();
                });
                test("When conditionCombination is All, should return false", () => {
                    element = {
                        properties: {
                            satisfiedAction: "show",
                            conditionCombination: "All",
                            conditions: [
                                {
                                    "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "NotApplicable",
                                    "fieldValue": ""
                                }
                            ]
                        }
                    } as InputElementBase;
                    formDependConditions = new FormDependConditions(element)
                    expect(formDependConditions.checkConditions(formSubmissions)).toBeFalsy();
                });
            });
        });
        describe("Test multiply condition", () => {
            test("When conditionCombination is All, and a condition is not met, should return false", () => {
                element = {
                    properties: {
                        satisfiedAction: "show",
                        conditionCombination: "All",
                        conditions: [
                            {
                                "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                "operator": "Contains",
                                "fieldValue": "f" // This will not be met
                            },
                            {
                                "field": "2490ca1deeb744f1aa7c33db0aefe5a8",
                                "operator": "NotEqual",
                                "fieldValue": "3"
                            },
                            {
                                "field": "3490ca1deeb744f1aa7c33db0aefe5a8",
                                "operator": "Equals",
                                "fieldValue": "33"
                            },
                            {
                                "field": "4490ca1deeb744f1aa7c33db0aefe5a8",
                                "operator": "Contains",
                                "fieldValue": "4"
                            }
                        ]
                    }
                } as InputElementBase;
                formDependConditions = new FormDependConditions(element)
                expect(formDependConditions.checkConditions(formSubmissions)).toBeFalsy();
            });

            test("When conditionCombination is Any, and any condition is met, should return false", () => {
                element = {
                    properties: {
                        satisfiedAction: "show",
                        conditionCombination: "All",
                        conditions: [
                            {
                                "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                "operator": "Contains",
                                "fieldValue": "f"
                            },
                            {
                                "field": "2490ca1deeb744f1aa7c33db0aefe5a8",
                                "operator": "NotEqual",
                                "fieldValue": "a"
                            },
                            {
                                "field": "3490ca1deeb744f1aa7c33db0aefe5a8",
                                "operator": "Equals",
                                "fieldValue": "a"
                            },
                            {
                                "field": "4490ca1deeb744f1aa7c33db0aefe5a8",
                                "operator": "Contains",
                                "fieldValue": "a"
                            }
                        ]
                    }
                } as InputElementBase;
                formDependConditions = new FormDependConditions(element)
                expect(formDependConditions.checkConditions(formSubmissions)).toBeFalsy();
            });
        })
    });
});