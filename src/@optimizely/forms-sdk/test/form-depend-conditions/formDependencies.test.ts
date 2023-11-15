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
        describe("Single condition", () => {
            describe("Contains", () => {
                test("When value of the element in formSubmissions contain dependencies fieldValue, should return True", () => {
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
                test("When value of the element in formSubmissions do not contain dependencies fieldValue, should return False", () => {
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
            describe("NotContains", () => {
                test("When value of the element in formSubmissions contain dependencies fieldValue, should return False", () => {
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
                test("When value of the element in formSubmissions do not contain dependencies fieldValue, should return True", () => {
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
            describe("Equals", () => {
                test("When value of the element in formSubmissions is equal to dependencies fieldValue, should return True", () => {
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
                test("When value of the element in formSubmissions is not equal to dependencies fieldValue, should return False", () => {
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
            describe("NotEquals", () => {
                test("When value of the element in formSubmissions is equal to dependencies fieldValue, should return False", () => {
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
                test("When value of the element in formSubmissions is not equal to dependencies fieldValue, should return True", () => {
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
            describe("MatchRegularExpression", () => {
                test("When value of the element in formSubmissions is match with dependencies fieldValue, should return True", () => {
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
                test("When value of the element in formSubmissions is not match with dependencies fieldValue, should return False", () => {
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
            describe("NotApplicable", () => {
                test("When conditionCombination is Any, should return False", () => {
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
                test("When conditionCombination is All, should return False", () => {
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
        describe("Multiple conditions", () => {
            describe("All conditionCombination", () => {
                test("When all condition is met, should return True", () => {
                    element = {
                        properties: {
                            satisfiedAction: "show",
                            conditionCombination: "All",
                            conditions: [
                                {
                                    "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "Contains",
                                    "fieldValue": "1" 
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
                test("When a condition is not met, should return False", () => {
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
            });
            describe("Any conditionCombination", () => {
                test("When any condition is met, should return True", () => {
                    element = {
                        properties: {
                            satisfiedAction: "show",
                            conditionCombination: "Any",
                            conditions: [
                                {
                                    "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "Contains",
                                    "fieldValue": "f"
                                },
                                {
                                    "field": "2490ca1deeb744f1aa7c33db0aefe5a8",
                                    "operator": "NotEquals",
                                    "fieldValue": "a" // This will be met
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
                    expect(formDependConditions.checkConditions(formSubmissions)).toBeTruthy();
                });
                test("When all condition is not met, should return False", () => {
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
                                    "operator": "NotApplicable",
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
            });
            
        });
        describe("Nullable variables", () => {
            test("When field of condition is null or not found in formSubmissions, should return False", () => {
                element = {
                    properties: {
                        satisfiedAction: "show",
                        conditionCombination: "Any",
                        conditions: [
                            {
                                "field": "1",
                                "operator": "Contains",
                                "fieldValue": "1"
                            }
                        ]
                    }
                } as InputElementBase;

                let element2 = {
                    properties: {
                        satisfiedAction: "show",
                        conditionCombination: "Any",
                        conditions: [
                            {
                                "operator": "Contains",
                                "fieldValue": "1"
                            }
                        ]
                    }
                } as InputElementBase;

                formDependConditions = new FormDependConditions(element)
                expect(formDependConditions.checkConditions(formSubmissions)).toBeFalsy();

                const formDependConditions2 = new FormDependConditions(element2)
                expect(formDependConditions2.checkConditions(formSubmissions)).toBeFalsy();
            });
            test("When operator of condition is null or not found in formSubmissions, should return False", () => {
                element = {
                    properties: {
                        satisfiedAction: "show",
                        conditionCombination: "Any",
                        conditions: [
                            {
                                "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                "operator": "DontExistOperator",
                                "fieldValue": "1"
                            }
                        ]
                    }
                } as InputElementBase;

                let element2 = {
                    properties: {
                        satisfiedAction: "show",
                        conditionCombination: "Any",
                        conditions: [
                            {
                                "field": "1490ca1deeb744f1aa7c33db0aefe5a8",
                                "fieldValue": "1"
                            }
                        ]
                    }
                } as InputElementBase;

                formDependConditions = new FormDependConditions(element)
                expect(formDependConditions.checkConditions(formSubmissions)).toBeFalsy();

                const formDependConditions2 = new FormDependConditions(element2)
                expect(formDependConditions2.checkConditions(formSubmissions)).toBeFalsy();
            });
            test("When conditionCombination is not All or Any, should return False", () => {
                element = {
                    properties: {
                        satisfiedAction: "show",
                        conditionCombination: "NotFoundConditionCombination",
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
                expect(formDependConditions.checkConditions(formSubmissions)).toBeFalsy();
            });
        });
    });
});