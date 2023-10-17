/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { getOverrideProps } from "@aws-amplify/ui-react/internal";
import { Icon, Text, View } from "@aws-amplify/ui-react";
export default function Group2(props) {
  const { overrides, ...rest } = props;
  return (
    <View
      width="826.93px"
      height="76.92px"
      display="block"
      gap="unset"
      alignItems="unset"
      justifyContent="unset"
      position="relative"
      padding="0px 0px 0px 0px"
      {...getOverrideProps(overrides, "Group2")}
      {...rest}
    >
      <Icon
        width="826.93px"
        height="76.92px"
        viewBox={{
          minX: 0,
          minY: 0,
          width: 826.9315795898438,
          height: 76.91860961914062,
        }}
        paths={[
          {
            d: "M0 38.4593C0 17.2188 17.2188 0 38.4593 0L788.472 0C809.713 0 826.932 17.2188 826.932 38.4593L826.932 38.4593C826.932 59.6998 809.713 76.9186 788.472 76.9186L38.4593 76.9186C17.2188 76.9186 0 59.6998 0 38.4593L0 38.4593Z",
            fill: "rgba(169,158,158,1)",
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
        {...getOverrideProps(overrides, "Rectangle 1")}
      ></Icon>
      <Text
        fontFamily="Josefin Sans"
        fontSize="36px"
        fontWeight="400"
        color="rgba(19,16,16,1)"
        lineHeight="36px"
        textAlign="left"
        display="block"
        direction="column"
        justifyContent="unset"
        width="121px"
        height="46px"
        gap="unset"
        alignItems="unset"
        position="absolute"
        top="19.5%"
        bottom="20.7%"
        left="42.69%"
        right="42.68%"
        padding="0px 0px 0px 0px"
        whiteSpace="pre-wrap"
        children="Sign In"
        {...getOverrideProps(overrides, "Sign In")}
      ></Text>
    </View>
  );
}
