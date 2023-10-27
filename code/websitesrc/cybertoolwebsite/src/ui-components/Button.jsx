/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Text, View } from "@aws-amplify/ui-react";
export default function Button(props) {
  const { overrides, ...rest } = props;
  return (
    <View
      width="655px"
      height="120px"
      display="block"
      gap="unset"
      alignItems="unset"
      justifyContent="unset"
      position="relative"
      padding="0px 0px 0px 0px"
      backgroundColor="rgba(217,217,217,1)"
      {...getOverrideProps(overrides, "Button")}
      {...rest}
    >
      <View
        width="655px"
        height="120px"
        display="block"
        gap="unset"
        alignItems="unset"
        justifyContent="unset"
        position="absolute"
        top="0%"
        bottom="0%"
        left="0%"
        right="0%"
        borderRadius="100px"
        padding="0px 0px 0px 0px"
        backgroundColor="rgba(156,192,247,1)"
        {...getOverrideProps(overrides, "Button4820")}
      ></View>
      <Text
        fontFamily="Josefin Sans"
        fontSize="48px"
        fontWeight="400"
        color="rgba(0,0,0,1)"
        lineHeight="48px"
        textAlign="center"
        display="block"
        direction="column"
        justifyContent="unset"
        width="317.96px"
        height="64.43px"
        gap="unset"
        alignItems="unset"
        position="absolute"
        top="32.02%"
        bottom="14.29%"
        left="23.04%"
        right="28.42%"
        padding="0px 0px 0px 0px"
        whiteSpace="pre-wrap"
        children="Login"
        {...getOverrideProps(overrides, "Login")}
      ></Text>
    </View>
  );
}
