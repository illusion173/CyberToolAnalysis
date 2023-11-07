/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { getOverrideProps } from "./utils";
import { Icon, Text, View } from "@aws-amplify/ui-react";
import { Button as ButtonCustom } from "./Button";
export default function SigninPage(props) {
  const { overrides, ...rest } = props;
  return (
    <View
      width="911px"
      height="932px"
      display="block"
      gap="unset"
      alignItems="unset"
      justifyContent="unset"
      position="relative"
      padding="0px 0px 0px 0px"
      {...getOverrideProps(overrides, "SigninPage")}
      {...rest}
    >
      <View
        width="911px"
        height="932px"
        display="block"
        gap="unset"
        alignItems="unset"
        justifyContent="unset"
        overflow="hidden"
        position="absolute"
        top="0%"
        bottom="0%"
        left="0%"
        right="0%"
        padding="0px 0px 0px 0px"
        {...getOverrideProps(overrides, "Signin Page")}
      >
        <Icon
          width="911px"
          height="932px"
          viewBox={{ minX: 0, minY: 0, width: 911, height: 932 }}
          paths={[
            {
              d: "M0 0L911 0L911 932L0 932L0 0Z",
              fill: "rgba(217,217,217,1)",
              fillRule: "nonzero",
            },
          ]}
          display="block"
          gap="unset"
          alignItems="unset"
          justifyContent="unset"
          position="absolute"
          top="0%"
          bottom="0%"
          left="0%"
          right="0%"
          {...getOverrideProps(overrides, "Rectangle 12")}
        ></Icon>
        <View
          width="752px"
          height="76px"
          display="block"
          gap="unset"
          alignItems="unset"
          justifyContent="unset"
          position="absolute"
          top="40.13%"
          bottom="51.72%"
          left="8.67%"
          right="8.78%"
          padding="0px 0px 0px 0px"
          backgroundColor="rgba(187,204,209,1)"
          {...getOverrideProps(overrides, "Rectangle 5")}
        ></View>
        <View
          width="752px"
          height="76px"
          display="block"
          gap="unset"
          alignItems="unset"
          justifyContent="unset"
          position="absolute"
          top="21.67%"
          bottom="70.17%"
          left="8.67%"
          right="8.78%"
          padding="0px 0px 0px 0px"
          backgroundColor="rgba(187,204,209,1)"
          {...getOverrideProps(overrides, "Rectangle 15")}
        ></View>
        <Icon
          width="398px"
          height="72px"
          viewBox={{ minX: 0, minY: 0, width: 398, height: 72 }}
          paths={[]}
          display="block"
          gap="unset"
          alignItems="unset"
          justifyContent="unset"
          position="absolute"
          top="6.87%"
          bottom="85.41%"
          left="28.1%"
          right="28.21%"
          {...getOverrideProps(overrides, "Rectangle 14")}
        ></Icon>
        <Text
          fontFamily="Josefin Sans"
          fontSize="36px"
          fontWeight="200"
          color="rgba(0,0,0,1)"
          lineHeight="36px"
          textAlign="center"
          display="block"
          direction="column"
          justifyContent="unset"
          width="379px"
          height="48px"
          gap="unset"
          alignItems="unset"
          position="absolute"
          top="9.44%"
          bottom="85.41%"
          left="29.2%"
          right="29.2%"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children="Sign In to CyberTools"
          {...getOverrideProps(overrides, "Sign In to CyberTools")}
        ></Text>
        <Text
          fontFamily="Josefin Sans"
          fontSize="36px"
          fontWeight="200"
          color="rgba(0,0,0,1)"
          lineHeight="36px"
          textAlign="center"
          display="block"
          direction="column"
          justifyContent="unset"
          width="200px"
          height="26px"
          gap="unset"
          alignItems="unset"
          position="absolute"
          top="16.74%"
          bottom="80.47%"
          left="6.15%"
          right="71.9%"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children="Username"
          {...getOverrideProps(overrides, "Username")}
        ></Text>
        <Text
          fontFamily="Josefin Sans"
          fontSize="36px"
          fontWeight="200"
          color="rgba(0,0,0,1)"
          lineHeight="36px"
          textAlign="center"
          display="block"
          direction="column"
          justifyContent="unset"
          width="200px"
          height="26px"
          gap="unset"
          alignItems="unset"
          position="absolute"
          top="34.98%"
          bottom="62.23%"
          left="6.15%"
          right="71.9%"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children="Password"
          {...getOverrideProps(overrides, "Password")}
        ></Text>
        <ButtonCustom
          width="655px"
          height="120px"
          display="block"
          gap="unset"
          alignItems="unset"
          justifyContent="unset"
          position="absolute"
          top="68.67%"
          bottom="18.45%"
          left="14.05%"
          right="14.05%"
          padding="0px 0px 0px 0px"
          backgroundColor="rgba(217,217,217,1)"
          {...getOverrideProps(overrides, "Button")}
        ></ButtonCustom>
        <Text
          fontFamily="Josefin Sans"
          fontSize="32px"
          fontWeight="400"
          color="rgba(0,0,0,1)"
          lineHeight="32px"
          textAlign="center"
          display="block"
          direction="column"
          justifyContent="unset"
          width="527px"
          height="86px"
          gap="unset"
          alignItems="unset"
          position="absolute"
          top="83.91%"
          bottom="6.87%"
          left="19.21%"
          right="22.94%"
          padding="0px 0px 0px 0px"
          whiteSpace="pre-wrap"
          children="Don’t have an account? Sign Up!"
          {...getOverrideProps(
            overrides,
            "Don\u2019t have an account? Sign Up!"
          )}
        ></Text>
      </View>
    </View>
  );
}
