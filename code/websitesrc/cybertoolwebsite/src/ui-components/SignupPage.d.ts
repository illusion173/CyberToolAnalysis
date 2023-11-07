/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { TextProps, ViewProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SignupPageOverridesProps = {
    SignupPage?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 4"?: PrimitiveOverrideProps<ViewProps>;
    "Sign Up315"?: PrimitiveOverrideProps<TextProps>;
    "Rectangle 5"?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 6"?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 7"?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 8"?: PrimitiveOverrideProps<ViewProps>;
    "Rectangle 9"?: PrimitiveOverrideProps<ViewProps>;
    "Full Name"?: PrimitiveOverrideProps<TextProps>;
    Email?: PrimitiveOverrideProps<TextProps>;
    Username?: PrimitiveOverrideProps<TextProps>;
    Password?: PrimitiveOverrideProps<TextProps>;
    "Retype Password"?: PrimitiveOverrideProps<TextProps>;
    "Rectangle 10"?: PrimitiveOverrideProps<ViewProps>;
    "Sign Up3218"?: PrimitiveOverrideProps<TextProps>;
    "Rectangle 11"?: PrimitiveOverrideProps<ViewProps>;
    "By clicking here, you agree to the Terms of Agreement"?: PrimitiveOverrideProps<TextProps>;
} & EscapeHatchProps;
export declare type SignupPageProps = React.PropsWithChildren<Partial<ViewProps> & {
    overrides?: SignupPageOverridesProps | undefined | null;
}>;
export default function SignupPage(props: SignupPageProps): React.ReactElement;
