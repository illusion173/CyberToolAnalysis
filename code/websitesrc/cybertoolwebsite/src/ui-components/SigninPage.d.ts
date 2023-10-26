/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { IconProps, TextProps, ViewProps } from "@aws-amplify/ui-react";
import { ButtonProps } from "./Button";
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SigninPageOverridesProps = {
    SigninPage?: PrimitiveOverrideProps<ViewProps>;
    "Signin Page"?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 12"?: PrimitiveOverrideProps<IconProps>;
    "Rectangle 5"?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 15"?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 14"?: PrimitiveOverrideProps<IconProps>;
    "Sign In to CyberTools"?: PrimitiveOverrideProps<TextProps>;
    Username?: PrimitiveOverrideProps<TextProps>;
    Password?: PrimitiveOverrideProps<TextProps>;
    Button?: ButtonProps;
    "Don\u2019t have an account? Sign Up!"?: PrimitiveOverrideProps<TextProps>;
} & EscapeHatchProps;
export declare type SigninPageProps = React.PropsWithChildren<Partial<ViewProps> & {
    overrides?: SigninPageOverridesProps | undefined | null;
}>;
export default function SigninPage(props: SigninPageProps): React.ReactElement;
