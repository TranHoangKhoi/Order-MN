import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { TAppStackParamList } from '~/types';
import { colors } from '~/utils';
import { LayoutBottomTab } from './LayoutBottomTab';
import { EntypoIcon, FeatherIcon, TextCom } from '~/components';
import { ScaledSheet } from 'react-native-size-matters';

interface Props {
  children: React.ReactNode;
  childrenHeader?: React.ReactNode;
  isShowBottomTab?: boolean;
  showGoBackButton?: boolean;
  screenTitle?: string;
  containerOverrideStyle?: StyleProp<ViewStyle>;
  statusBarBG?: string;
  translucent?: boolean;
  icon?: any;
  iconRight?: boolean;
  showTextRight?: string;
  onPressIconRight?: () => void
}

export const DefaultLayout = (props: Props) => {
  const {
    children,
    childrenHeader,
    isShowBottomTab = true,
    showGoBackButton = true,
    screenTitle = '',
    containerOverrideStyle,
    statusBarBG = colors.background,
    translucent = false,
    icon = false,
    iconRight = false,
    showTextRight = '',
    onPressIconRight,
  } = props;
  const barStyle = 'dark-content';

  const { goBack } = useNavigation<NavigationProp<TAppStackParamList>>();

  return (
    <SafeAreaView style={styles.layoutContainer}>
      {Platform.OS === 'android' ? (
        <StatusBar
          backgroundColor={statusBarBG}
          barStyle={barStyle}
          translucent={translucent}
        />
      ) : null}

      <View style={StyleSheet.compose(styles.childrenContainer, containerOverrideStyle)}>
        {childrenHeader && childrenHeader ?
          <View style={styles.headerContainer}>
            {childrenHeader}
          </View>
          :
          <>
            {screenTitle && (
              <View style={styles.headerContainer}>
                {showGoBackButton ? (
                  <TouchableOpacity activeOpacity={0.7} onPress={() => goBack()}>
                    <EntypoIcon name="chevron-thin-left" style={styles.headerIcon} />
                  </TouchableOpacity>
                ) : (
                  <View style={{ opacity: 0 }}>
                    <EntypoIcon name="chevron-thin-left" style={styles.headerIcon} />
                  </View>
                )}
                <Text style={styles.headerText}>{screenTitle}</Text>
                {iconRight ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onPressIconRight}
                    style={{
                      alignItems: 'flex-end',
                      flexDirection: 'row',
                      gap: 4,
                      justifyContent: 'flex-end'
                    }}>
                    {showTextRight && <TextCom
                      text={showTextRight}
                      type='secondary'
                      fontSize={14}
                    />}
                    {icon}
                  </TouchableOpacity>
                ) : (
                  <View style={{ opacity: 0 }}>
                    <FeatherIcon name="check-square" style={[styles.headerIcon]} />
                  </View>
                )}
              </View>
            )}
          </>
        }
        {/* Body */}
        <View style={StyleSheet.compose(styles.childrenContainer, containerOverrideStyle)}>
          {children}
        </View>
      </View>
      {isShowBottomTab && <LayoutBottomTab />}
    </SafeAreaView>
  );
};

const styles = ScaledSheet.create({
  layoutContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingVertical: "10@s",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerIcon: {
    fontSize: "22@s",
    left: 0,
    color: colors.textPrimary,
    padding: "8@s",
  },
  headerText: {
    color: colors.textPrimary,
    fontSize: "17@s",
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  childrenContainer: {
    flex: 1,
    padding: "10@s",
    paddingBottom: 0
  },
});
