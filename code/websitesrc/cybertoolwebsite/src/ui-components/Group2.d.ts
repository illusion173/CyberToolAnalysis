/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { IconProps, TextProps, ViewProps } from "@aws-amplify/ui-react";
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type Group2OverridesProps = {
    Group2?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 1"?: PrimitiveOverrideProps<IconProps>;
    "Sign In"?: PrimitiveOverrideProps<TextProps>;
} & EscapeHatchProps;
export declare type Group2Props = React.PropsWithChildren<Partial<ViewProps> & {
    overrides?: Group2OverridesProps | undefined | null;
}>;
export default function Group2(props: Group2Props): React.ReactElement;
