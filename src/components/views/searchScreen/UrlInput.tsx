import { Platform, StyleSheet, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'

const UrlInput = (props: any) => {
  const [isFocus, setFocus] = useState(false);
  const ref = useRef<any>(null);
  const _onFocus = ({ nativeEvent }: any) => {
    setFocus(true);
    if (Platform.OS === "ios" && props.isSelectionOnTouch) {
      setTimeout(function () {
        ref.current.setNativeProps({
          selection: { start: 0, end: nativeEvent.text.length },
        });
      }, 100);
    }
  };
  const _onBlur = () => {
    setFocus(false);
  };

  return (
    <TextInput
      ref={ref}
      multiline={true}
      placeholderTextColor="#000"
      placeholder=""
      autoCapitalize="none"
      onFocus={_onFocus}
      onBlur={_onBlur}
      {...props}
      style={[...props.style, isFocus && styles.focus]}
    />
  );
};


export default UrlInput

const styles = StyleSheet.create({
  focus: {
    width: "60%",
    flexGrow: 2,
  },
})