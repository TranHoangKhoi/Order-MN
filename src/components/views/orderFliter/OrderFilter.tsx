import React from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import DateInput from '~/components/global/datePicker/DateInput';
import RNPickerSelect from 'react-native-picker-select';
import { ButtonCus, MaterialCommunityIcon } from '~/components';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { colors } from '~/utils';

interface FilterValues {
  [key: string]: any;
}

interface OrderFilterProps {
  filters: FilterValues;
  setFilters: React.Dispatch<React.SetStateAction<FilterValues>>;
  listStatus: { label: string; value: string }[];
  fetchOrderData: () => void;
  loading: boolean;
  toggleFilterVisibility: () => void;
  filterVisible: boolean;
  primaryFilterLabel: string;
  primaryFilterKey: string;
  primaryFilterStatus: string;
}

export const OrderFilter: React.FC<OrderFilterProps> = ({
  filters,
  setFilters,
  listStatus,
  fetchOrderData,
  loading,
  toggleFilterVisibility,
  filterVisible,
  primaryFilterLabel,
  primaryFilterKey,
  primaryFilterStatus,
}) => {
  return (
    <>
      {filterVisible ? (
        <>
          <TextInput
          style={styles.input}
          placeholder={primaryFilterLabel}
          value={filters[primaryFilterKey]}
          onChangeText={(text) => setFilters(prev => ({ ...prev, [primaryFilterKey]: text }))}
        />  
          <DateInput onDateChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))} placeholder="Từ ngày" />
            <DateInput onDateChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))} placeholder="Đến ngày" />
            <View style={styles.pickerStyles}>
              <RNPickerSelect
                style={{ inputAndroid: styles.inputAndroid }}
                onValueChange={(value) => setFilters(prev => ({ ...prev, [primaryFilterStatus]: value }))}
                items={listStatus.map(status => ({ label: status.label, value: status.value }))}
              />
            </View>

          <ButtonCus
            isLoading={loading}
            onPress={fetchOrderData}
            name={"Tìm kiếm"}
            buttonStyle={{ marginTop: 0 }}
            textStyle={{ color: "#fff" }}
          />
          <TouchableOpacity
              activeOpacity={0.7}
              onPress={toggleFilterVisibility}
              style={styles.iconContainer}>
              <MaterialCommunityIcon
                name={!filterVisible ? 'arrow-up-drop-circle' : 'arrow-down-drop-circle'}
                style={styles.icon}
              />
            </TouchableOpacity>
        </>
      ) : (
        <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder={primaryFilterLabel}
          value={filters[primaryFilterKey]}
          onChangeText={(text) => setFilters(prev => ({ ...prev, [primaryFilterKey]: text }))}
        />
  
        <TouchableOpacity
          onPress={fetchOrderData}
          style={styles.searchButon}
        >
          <Text style={{color: '#fff'}}>Tìm kiếm</Text>
          {loading && <ActivityIndicator size='small' color={'#fff'} />}
        </TouchableOpacity>
      </View>
      ) }
      
    </>
  );
};

const styles = ScaledSheet.create({
  input: {
    height: '40@s',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: '10@s',
    padding: '10@s',
    borderRadius: scale(4),
    color: 'black'
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: "14@s",
  },
  icon: {
    fontSize: '24@s',
    color: colors.primary
  },
  pickerStyles: {
    marginBottom: '20@s',
    borderWidth: '1@s',
    borderColor: 'gray',
    borderRadius: '4@s'
  },
  inputAndroid: {
    fontSize: scale(14),
    padding: '10@s'
  },
  searchWrapper: {
    flexDirection: 'row',
    gap: 10,
  },
  searchInput : {
    height: '40@s',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: '10@s',
    padding: '10@s',
    borderRadius: scale(4),
    width: '70%'
  },
  searchButon: {
    backgroundColor: colors.primary,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent:'center',
    fontSize: 14,
    height: '40@s',
    flex: 1,
    borderRadius: scale(4),
    flexDirection: 'row',
    gap: 4
  }
});
