/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { IconProps, TextProps, ViewProps } from "@aws-amplify/ui-react";
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type Rectangle12OverridesProps = {
    Rectangle12?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 12"?: PrimitiveOverrideProps<IconProps>;
    "Rectangle 5"?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 14"?: PrimitiveOverrideProps<IconProps>;
    "Sign In to CyberTools"?: PrimitiveOverrideProps<TextProps>;
    Username?: PrimitiveOverrideProps<TextProps>;
    Password?: PrimitiveOverrideProps<TextProps>;
} & EscapeHatchProps;
export declare type Rectangle12Props = React.PropsWithChildren<Partial<ViewProps> & {
    overrides?: Rectangle12OverridesProps | undefined | null;
}>;
export default function Rectangle12(props: Rectangle12Props): React.ReactElement;
