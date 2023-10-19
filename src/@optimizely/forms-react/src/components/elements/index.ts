import { TextboxElementBlock } from "./TextboxElementBlock";
import { TextareaElementBlock } from "./TextareaElementBlock";
import { NumberElementBlock } from "./NumberElementBlock";
import { PredefinedHiddenElementBlock } from "./PredefinedHiddenElementBlock";
import { ChoiceElementBlock } from "./ChoiceElementBlock";
import { RangeElementBlock } from "./RangeElementBlock";

export const components: Record<string, any> = {
    TextboxElementBlock,
    TextareaElementBlock,
	PredefinedHiddenElementBlock,
    ChoiceElementBlock,
    NumberElementBlock,
    RangeElementBlock
};