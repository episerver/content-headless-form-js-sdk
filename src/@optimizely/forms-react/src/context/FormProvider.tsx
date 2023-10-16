import React, { ReactNode, useReducer } from "react";
import { FormState } from "../models/FormContext";
import { formReducer } from "./reducer";
import { FormContext, FormDispatchContext } from "./store";

interface FormsProviderProps {
    children: ReactNode
    initialState: FormState
}

export const FormProvider: React.FunctionComponent<FormsProviderProps> = ({ children, initialState }: FormsProviderProps) => {
    const [formContext, dispatch] = useReducer(
      formReducer,
      initialState
    );
  
    return (
        <FormContext.Provider value={formContext}>
            <FormDispatchContext.Provider value={dispatch}>
                {children}
            </FormDispatchContext.Provider>
        </FormContext.Provider>
    );
  }