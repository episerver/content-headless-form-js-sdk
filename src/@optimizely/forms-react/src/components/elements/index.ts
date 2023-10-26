import { TextboxElementBlock } from "./TextboxElementBlock";
import { TextareaElementBlock } from "./TextareaElementBlock";
import { NumberElementBlock } from "./NumberElementBlock";
import { PredefinedHiddenElementBlock } from "./PredefinedHiddenElementBlock";
import { ChoiceElementBlock } from "./ChoiceElementBlock";
import { RangeElementBlock } from "./RangeElementBlock";
import { FormStepBlock } from "./FormStepBlock";
import { SelectionElementBlock } from "./SelectionElementBlock";
import { UrlElementBlock } from "./UrlElementBlock";
import { ImageChoiceElementBlock } from "./ImageChoiceElementBlock";
import { FileUploadElementBlock } from "./FileUploadElementBlock";
import { VisitorDataHiddenElementBlock } from "./VisitorDataHiddenElementBlock";

export const components: Record<string, any> = {
    TextboxElementBlock,
    TextareaElementBlock,
	PredefinedHiddenElementBlock,
    ChoiceElementBlock,
    NumberElementBlock,
    RangeElementBlock,
    FormStepBlock,
    SelectionElementBlock,
    UrlElementBlock,
    ImageChoiceElementBlock,
    FileUploadElementBlock,
    VisitorDataHiddenElementBlock
};