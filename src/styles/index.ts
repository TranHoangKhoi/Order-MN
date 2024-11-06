import { Dimensions, StyleSheet } from 'react-native';
import { scale, ScaledSheet } from 'react-native-size-matters';

const BASE = {
  shadow: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
};

export const containerStyle = StyleSheet.create({
  // column - full
  fullCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullAround: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  fullBetween: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fullEvenly: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  // row - full
  fullRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const { width, height } = Dimensions.get('screen');

export const itemFlex = ScaledSheet.create({
  // column - full
  itemCenter: {
    alignItems: 'center',
    gap: scale(10),
    justifyContent: 'center',
  },
  itemAround: {
    alignItems: 'center',
    gap: scale(10),
    justifyContent: 'space-around',
  },
  itemBetween: {
    alignItems: 'center',
    gap: scale(10),
    justifyContent: 'space-between',
  },
  itemEvenly: {
    alignItems: 'center',
    gap: scale(10),
    justifyContent: 'space-evenly',
  },
  // row - item
  itemRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    justifyContent: 'center',
  },
});

export const imageStyle = ScaledSheet.create({
  fullContent: {
    width: '100%',
    height: '100%',
  },
});

export const shadowStyle = ScaledSheet.create({
  white: {
    ...BASE.shadow,
    shadowColor: '#f5f5f5',
  },
  black: {
    ...BASE.shadow,
    shadowColor: '#656d77',
  },
});
