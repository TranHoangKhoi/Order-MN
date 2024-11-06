import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { colors } from '~/utils';

const NoteModal = (props: any) => {
    const [show, setShow] = useState(props?.isShow || false);
    const ref = useRef<any>(null);

    return (
        <>
            <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#333" }]}
                onPress={() => {
                    setShow(true);
                    props?.input?.setValue('')
                }}
            >
                <Text style={styles.btnTxt}>Ghi chú</Text>
            </TouchableOpacity>
            <Modal
                visible={show}
                animationType="slide"
                transparent={true}
            >
                <TouchableOpacity
                    onPress={() => setShow(false)}
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        flex: 1,
                    }}
                />
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        padding: 16,
                        width: '100%',
                        backgroundColor: '#fff',
                    }}>
                    <View style={{ paddingBottom: 16 }}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            color: '#000',
                            borderBottomWidth: 1,
                            borderColor: colors.black,
                            lineHeight: 30,
                            marginBottom: 8
                        }}>Thêm ghi chú <Text style={{ color: 'red' }}>*</Text></Text>

                        <TextInput
                            ref={ref}
                            placeholderTextColor="#000"
                            placeholder="Nhập ghi chú..."
                            autoCapitalize="none"
                            {...props?.input}
                            onSubmitEditing={() => {
                                setShow(false)
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
};
export default NoteModal

const styles = StyleSheet.create({
    btn: {
        width: '100%',
        borderRadius: 5,
        backgroundColor: colors.primary,
    },
    btnTxt: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        lineHeight: 20,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },

})