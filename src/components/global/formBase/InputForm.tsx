import React from 'react';
import { Controller, FieldValues } from 'react-hook-form';

import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { TInputForm } from '~/types';
import { colors } from '~/utils';

export const InputForm = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  icon,
  placeholder,
  innerStyle,
  inputStyle,
  iconStyle,
  secureTextEntry,
  onPressIcon,
  keyboardType = 'default',
  disabled,
  onEndEditing,
  label,
  require = true,
  autoFocus = false,
  numberOfLines = 1,
}: TInputForm<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error, isTouched, invalid },
        formState: { isValidating },
      }) => (
        <View>
          {label && (
            <View style={styles.fromTitle}>
              <Text style={styles.title}>{label}:</Text>
              {require && <Text style={styles.require}>*</Text>}
            </View>
          )}
          <View
            style={[
              styles.inner,
              innerStyle,
              error ? styles.innerError : null,
              disabled ? styles.disabled : null,
            ]}>
            <>
              <TextInput
                numberOfLines={numberOfLines}
                multiline={numberOfLines > 2 ? true : false}
                placeholder={placeholder}
                placeholderTextColor={"#c0c0c0"}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={'none'}
                style={[
                  styles.input,
                  inputStyle,
                  error ? styles.inputError : { color: colors.black },
                ]}
                editable={!disabled}
                onChangeText={(val: string) => onChange(val)}
                onBlur={onBlur}
                value={value}
                onEndEditing={onEndEditing}
                autoFocus={autoFocus}
              />
              {isValidating && isTouched && invalid && (
                <ActivityIndicator size='small' color={colors.secondary} />
              )}

              {icon && (
                <>
                  <TouchableOpacity
                    onPress={onPressIcon}
                    disabled={!onPressIcon || disabled}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={icon}
                      style={[
                        styles.icon,
                        error ? styles.iconError : null,
                        iconStyle,
                      ]}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                  <View style={[error ? styles.lineError : null]} />
                </>
              )}
            </>
          </View>
          {error && <Text style={styles.error}>{error?.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = ScaledSheet.create({
  disabled: {
    opacity: 0.4,
  },
  error: {
    color: colors.danger,
    fontSize: "10@s",
    marginTop: "2@s",
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  fromTitle: {
    flexDirection: 'row',
  },
  require: {
    color: colors.danger,
    fontSize: "14@s",
    marginLeft: "3@s",
    fontWeight: 'bold',
  },
  title: {
    color: colors.black,
    fontSize: "14@s",
    marginBottom: "2@s",
  },
  inner: {
    backgroundColor: colors.borderSecondary,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderThird,
    borderRadius: "5@s",
    paddingVertical: 0,
  },
  icon: {
    width: "20@s",
    height: "20@s",
    marginRight: "10@s",
    tintColor: colors.primary,
  },
  line: {
    width: "2@s",
    height: "20@s",
    marginVertical: "10@s",
    backgroundColor: colors.primary,
  },
  input: {
    flex: 1,
    padding: "8@s"
  },

  // error styles
  iconError: {
    tintColor: colors.danger,
  },
  lineError: {
    backgroundColor: colors.danger,
  },
  innerError: {
    borderWidth: 1,
    borderColor: colors.danger,
  },
  inputError: {
    color: colors.danger,
  },
});
