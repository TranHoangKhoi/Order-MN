import { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";
import { ColorValue, ImageSourcePropType, ImageStyle, KeyboardTypeOptions, StyleProp, TextStyle, ViewStyle } from "react-native";


export type TInputForm<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues, object>;
  name: Path<TFieldValues>;
  icon?: ImageSourcePropType;
  placeholder: string | undefined;
  innerStyle?: any;
  inputStyle?: any;
  iconStyle?: StyleProp<ImageStyle>;
  secureTextEntry?: boolean | undefined;
  onPressIcon?: () => void;
  keyboardType?: KeyboardTypeOptions | undefined;
  disabled?: boolean;
  require?: boolean;
  autoFocus?: boolean;
  onEndEditing?: any;
  label?: string;
  numberOfLines?: number;
  minNumber?: number
};


export type TInfoSelect<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues, object>;
  name: Path<TFieldValues>;
  icon?: ImageSourcePropType;
  placeholder: string | undefined;
  innerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  secureTextEntry?: boolean | undefined;
  onPressIcon?: () => void;
  onPress?: () => void;
  keyboardType?: KeyboardTypeOptions | undefined;
  disabled?: boolean;
  require?: boolean;
  autoFocus?: boolean;
  onEndEditing?: any;
  label?: string;
  numberOfLines?: number;
  minNumber?: number
};



export type TCheckBox<TFieldValues extends FieldValues> = {
  name: string;
  control: Control<TFieldValues, object>;
  text: string;
  CheckBoxStyle?: StyleProp<ImageStyle>;
  imgStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export interface TButtonCus {
  name: string;
  icon?: ImageSourcePropType;
  onPress: () => void;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  isLoading?: boolean;
  disabled?: boolean;
  iconColor?: ColorValue | undefined;
}

export type TDropdownForm<TFieldValues extends FieldValues> = {
  label?: string;
  data?: Array<{ id: number | string; label: string; value: string }> | any;
  control: Control<TFieldValues, object>;
  name?: Path<TFieldValues>;
  icon?: ImageSourcePropType;
  placeholder?: string | undefined;
  innerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  secureTextEntry?: boolean | undefined;
  onPressIcon?: () => void;
  keyboardType?: KeyboardTypeOptions | undefined;
  disabled?: boolean;
  title?: string;
  require?: boolean;
  onEndEditing?: any;
  InnerModal?: StyleProp<ImageStyle>;
  showInput?: boolean;
};

export type TPhoneInput<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues, object>;
  name: Path<TFieldValues>;
  icon?: ImageSourcePropType;
  placeholder: string | undefined;
  innerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  secureTextEntry?: boolean | undefined;
  onPressIcon?: () => void;
  keyboardType?: KeyboardTypeOptions | undefined;
  disabled?: boolean;
  require?: boolean;
  autoFocus?: boolean;
  onEndEditing?: any;
  label?: string;
  textInputStyle?: StyleProp<TextStyle>;
  flagButtonStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  codeTextStyle?: StyleProp<TextStyle>;
  disableArrowIcon?: boolean;
  rules: RegisterOptions
};
