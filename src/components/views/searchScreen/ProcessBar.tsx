import { View } from 'react-native'
import React from 'react'
import { colors } from '~/utils';
const ProcessBar = (props: any) => {
    return (
        <View
            style={{
                height: 3,
                width: "100%",
                backgroundColor: colors.borderThird,
            }}
        >
            <View
                style={{
                    backgroundColor: colors.primary,
                    height: "100%",
                    width: `${props.percent}%`,
                }}
            />
        </View>
    );
};

export default ProcessBar
