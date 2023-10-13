/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { ViewProps } from "@aws-amplify/ui-react";
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type Rectangle1Variant2OverridesProps = {
    Rectangle1Variant2?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 1"?: PrimitiveOverrideProps<ViewProps>;
} & EscapeHatchProps;
export declare type Rectangle1Variant2Props = React.PropsWithChildren<Partial<ViewProps> & {
    overrides?: Rectangle1Variant2OverridesProps | undefined | null;
}>;
export default function Rectangle1Variant2(props: Rectangle1Variant2Props): React.ReactElement;
