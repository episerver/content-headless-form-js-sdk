import React from 'react';
import { TextboxElementBlock, ChoiceElementBlock } from './elements';
import { FormElementBase, isNull } from '@optimizely/forms-sdk';

const components: Record<string, any> = {
    TextboxElementBlock,
    ChoiceElementBlock
};

export interface ElementProps {
    name: string,
    element: FormElementBase
}

export function RenderElement(props: ElementProps) {
  const { element } = props;
  const FoundElement = components[props.name];

  if(isNull(FoundElement)){
    return (<p>{`Cannot render ${props.name} component`}</p>)
  }

  return <FoundElement element={element} />
}