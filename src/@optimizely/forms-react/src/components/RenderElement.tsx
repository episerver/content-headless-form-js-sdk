import React from 'react';

import { TextareaElementBlock, TextboxElementBlock, PredefinedHiddenElementBlock, ChoiceElementBlock, NumberElementBlock, RangeElementBlock } from './elements';
import { FormElementBase, isNull } from '@optimizely/forms-sdk';

const components: Record<string, any> = {
    TextboxElementBlock,
    TextareaElementBlock,
	  PredefinedHiddenElementBlock,
    ChoiceElementBlock,
    NumberElementBlock,
    RangeElementBlock
};

export interface ElementProps {
    element: FormElementBase
}

export function RenderElement(props: ElementProps) {
  const { element } = props;
  const FoundElement = components[element.contentType];

  if(isNull(FoundElement)){
    return (<p>{`Cannot render ${element.contentType} component`}</p>)
  }

  return <FoundElement element={element} />
}