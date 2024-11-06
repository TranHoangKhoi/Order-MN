import React, { useState } from 'react';
import { Dimensions, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

export const RefreshWebView = React.forwardRef(
    ({ isRefresh, onRefresh, isBack, ...webViewProps }: any, ref) => {
        const [height, setHeight] = useState(Dimensions.get('screen').height);
        const [isEnabled, setEnabled] = useState(typeof onRefresh === 'function');

        return (
            <ScrollView
                onLayout={e => setHeight(e.nativeEvent.layout.height)}
                refreshControl={
                    <RefreshControl
                        onRefresh={onRefresh}
                        refreshing={isRefresh}
                        enabled={isEnabled}
                    />
                }
                style={styles.view}>
                <WebView
                    {...webViewProps}
                    ref={ref}
                    onScroll={e =>
                        setEnabled(
                            typeof onRefresh === 'function' &&
                            e.nativeEvent.contentOffset.y === 0,
                        )
                    }
                    style={[styles.view, { height }, webViewProps.style]}
                />
            </ScrollView>
        );
    },
);

const styles = StyleSheet.create({
    view: { flex: 1, height: '100%' },
    goBack: {
        position: 'absolute',
        backgroundColor: '#333',
        top: 10,
        left: 10,
        zIndex: 9999,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
});