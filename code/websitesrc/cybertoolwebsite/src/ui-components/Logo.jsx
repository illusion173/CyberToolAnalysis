/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Icon, Text, View } from "@aws-amplify/ui-react";
export default function Logo(props) {
  const { overrides, ...rest } = props;
  return (
    <View
      width="1045px"
      height="376px"
      display="block"
      gap="unset"
      alignItems="unset"
      justifyContent="unset"
      position="relative"
      padding="0px 0px 0px 0px"
      {...getOverrideProps(overrides, "Logo")}
      {...rest}
    >
      <Icon
        width="774px"
        height="376px"
        viewBox={{ minX: 0, minY: 0, width: 774, height: 376 }}
        paths={[
          {
            d: "M0 150C0 67.1573 67.1573 0 150 0L624 0C706.843 0 774 67.1573 774 150L774 226C774 308.843 706.843 376 624 376L150 376C67.1573 376 0 308.843 0 226L0 150Z",
            fill: "rgba(212,223,226,1)",
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
        right="25.93%"
        {...getOverrideProps(overrides, "Rectangle 16")}
      ></Icon>
      <Text
        fontFamily="Gruppo"
        fontSize="128px"
        fontWeight="400"
        color="rgba(81,59,59,1)"
        lineHeight="123.6875px"
        textAlign="left"
        display="block"
        direction="column"
        justifyContent="unset"
        width="985px"
        height="256px"
        gap="unset"
        alignItems="unset"
        position="absolute"
        top="31.91%"
        bottom="0%"
        left="5.74%"
        right="0%"
        padding="0px 0px 0px 0px"
        whiteSpace="pre-wrap"
        children="CyberTools"
        {...getOverrideProps(overrides, "CyberTools")}
      ></Text>
    </View>
  );
}
