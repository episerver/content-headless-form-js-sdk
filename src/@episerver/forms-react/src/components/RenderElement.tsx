import React from 'react';
import { FormElementBase, isNull } from '@episerver/forms-sdk';
import { components } from './elements';

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