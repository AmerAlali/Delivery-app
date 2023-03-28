import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../hooks/useLanguage";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { Modal, RadioButton } from "react-native-paper";
import { reloadAsync } from "expo-updates";
const SettingsScreen = () => {
  const navigation = useNavigation();
  const { i18n, setLanguage } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = React.useState(i18n.locale);
  const mainColor = "#000000";
  const mainFont = "arabic-font";

  const handleChangeLanguage = async (newValue) => {
    setValue(newValue);
    setLanguage(newValue);
    await reloadAsync();
    //setLangauge(newValue);
  };
  return (
    <View className="flex-1 pt-7 bg-white">
      {/********** Header **********/}
      <View className="p-5 py-4 border-b border-[#d8dad9] bg-white shadow-xs">
        <View className=" flex-row-reverse justify-between items-center">
          <View>
            <Text
              style={{ fontFamily: mainFont }}
              className="text-lg text-center"
            >
              {i18n.t("settingsLabel")}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={navigation.goBack}
              className="shadow bg-gray-100 rounded-full p-2 mr-4"
            >
              <ArrowLeftIcon size={20} color={mainColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/********** Settings **********/}
      <View className="bg-gray-100 flex-1">
        <View className="bg-white p-4 m-2 shadow rounded-md">
          <TouchableOpacity onPress={() => setIsModalOpen(!isModalOpen)}>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-400">
                {i18n.t("language")}
              </Text>
              <Text className="text-sm text-[#ffd700]">{i18n.t("edit")}</Text>
            </View>
            <Text>{i18n.t("selectedLanguage")}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/********** Change Language Model **********/}
      <Modal
        transparent={true}
        onDismiss={() => setIsModalOpen(!isModalOpen)}
        visible={isModalOpen}
        animationType="fade"
        style={{ marginTop: -120 }}
      >
        <View className=" flex-1 justify-center">
          <View className="bg-white m-4 rounded-md p-4">
            <Text className="text-lg">{i18n.t("selectLanguageLabel")}</Text>
            <View>
              <RadioButton.Group
                onValueChange={(newValue) => handleChangeLanguage(newValue)}
                value={value}
              >
                <RadioButton.Item
                  color="#ffd700"
                  labelStyle={{ color: "gray" }}
                  label={i18n.t("englishLanguage")}
                  value="en"
                />
                <RadioButton.Item
                  color="#ffd700"
                  labelStyle={{ color: "gray" }}
                  label={i18n.t("arabicLanguage")}
                  value="ar"
                />
                <RadioButton.Item
                  labelStyle={{ color: "gray" }}
                  label={i18n.t("turkishLanguage")}
                  color="#ffd700"
                  value="tr"
                />
              </RadioButton.Group>
            </View>
            <TouchableOpacity
              onPress={() => setIsModalOpen(!isModalOpen)}
              className={`p-2 mt-4 w-full rounded-md`}
              style={{ backgroundColor: "#ffd700" }}
            >
              <Text
                className="text-center text-lg text-gray-900"
                style={{ fontFamily: "arabic-font" }}
              >
                {i18n.t("cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;
