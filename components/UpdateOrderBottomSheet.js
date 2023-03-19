import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { setVisible } from "../features/bottomSheetSlice";
import { TouchableOpacity } from "react-native";
import {
  ArrowLeftIcon,
  PlusCircleIcon,
  MinusCircleIcon,
} from "react-native-heroicons/solid";
import { selectBasketItemsWithId } from "../features/basketSlice";

const UpdateOrderBottomSheet = ({ selectedItemID }) => {
  // ref
  const item = useSelector((state) =>
    selectBasketItemsWithId(state, selectedItemID)
  );
  const { visible } = useSelector((state) => state.bottomSheet);
  const [quantity, setQuantity] = useState(0);

  const dispatch = useDispatch();
  const bottomSheetRef = useRef(null);

  const mainFont = "arabic-font";
  const mainColor = "#00ccbc";
  // variables
  const snapPoints = useMemo(() => ["40%"], []);

  const handleAddingQuantity = useCallback(() => {
    setQuantity(quantity + 1);
  }, [quantity]);
  // remove quantity
  const handleRemovingQuantity = useCallback(() => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  }, [quantity]);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );
  return (
    <>
      {visible && (
        <View style={styles.container} className={"absolute w-full h-full"}>
          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            animateOnMount={true}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            onClose={() => dispatch(setVisible(null))}
          >
            <View style={styles.contentContainer}>
              <View className="flex justify-center items-center">
                <View className="mb-4 mt-4">
                  <Text className="text-lg" style={{ fontFamily: mainFont }}>
                    {item && item[0].name}
                  </Text>
                </View>
                <View className="flex-row-reverse items-center gap-2 justify-center">
                  <TouchableOpacity
                    className="p-2 rounded-full"
                    onPress={handleAddingQuantity}
                  >
                    <PlusCircleIcon
                      color={mainColor}
                      //color={items.length > 0 ? "#00CCBB" : "gray"}
                      size={35}
                    />
                  </TouchableOpacity>
                  <Text className="text-3xl w-16 text-center font-bold">
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    className="p-2 rounded-full"
                    disabled={quantity === 0}
                    onPress={handleRemovingQuantity}
                  >
                    <MinusCircleIcon
                      color={quantity > 0 ? mainColor : "gray"}
                      size={35}
                    />
                  </TouchableOpacity>
                </View>
                <View className="flex-row-reverse justify-center gap-2">
                  <Text
                    className="text-center text-gray-600 text-lg"
                    style={{ fontFamily: mainFont }}
                  >
                    السعر:
                  </Text>
                  <Text
                    className="text-center text-gray-600 text-lg"
                    style={{ fontFamily: mainFont }}
                  >
                    ₺{item && quantity * item[0].price}
                  </Text>
                </View>
              </View>
              <View className="border-t mt-2 border-gray-200 p-5">
                <TouchableOpacity
                  className={`bg-[${mainColor}] p-4 border-t flex-row-reverse items-center justify-center border-gray-100 rounded-md`}
                >
                  <Text
                    style={{ fontFamily: mainFont }}
                    className="text-white text-lg text-center"
                  >
                    {quantity !== 0 ? "تحديث" : "حذف من السلة"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheet>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
});

export default UpdateOrderBottomSheet;
