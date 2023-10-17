import React from 'react';
import { TextareaElementBlock, TextboxElementBlock, PredefinedHiddenElementBlock } from './elements';
import { FormElementBase } from '@optimizely/forms-sdk';

const components: Record<string, any> = {
    TextboxElementBlock,
    TextareaElementBlock,
	PredefinedHiddenElementBlock
};

export interface ElementProps {
    name: string,
    element: FormElementBase
}

export function RenderElement(props: ElementProps) {
  const { element } = props;
  const FoundElement = components[props.name];

  if(typeof FoundElement === "undefined"){
    return (<p>{`Cannot render ${props.name} component`}</p>)
  }

  return <FoundElement element={element} />
}