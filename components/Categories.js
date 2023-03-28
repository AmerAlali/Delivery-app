import { ScrollView } from "react-native";
import React from "react";
import CategoryCard from "./CategoryCard";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useLanguage } from "../hooks/useLanguage";

const Categories = () => {
  const { i18n } = useLanguage();
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get(
        "https://cravecorner.shop/api/getKeywords",
        {
          headers: {
            userAgent: "CraveMobile",
          },
        }
      );
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  const categoryName = (category) => {
    let name;
    if (i18n.locale === "ar") {
      name = category.tag_name;
    } else if (i18n.locale === "en") {
      name = category.en_tag_name;
    } else {
      name = category.tr_tag_name;
    }
    return name;
  };
  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 15,
        paddingTop: 10,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {categories &&
        categories.map((category) => {
          return (
            <CategoryCard
              key={category.id}
              imgUrl={`https://cravecorner.shop/public/storage/${category.image}`}
              title={categoryName(category)}
              category_id={category.id}
            />
          );
        })}
      {/*<CategoryCard
        imgUrl="https://media.istockphoto.com/id/1075125916/tr/foto%C4%9Fraf/kavram-yatay-promosyon-afi%C5%9F-ve-restoran-pizzac%C4%B1-men%C3%BCs%C3%BCyle-nefis-tad%C4%B1-deniz-%C3%BCr%C3%BCnleri-pizza.jpg?s=612x612&w=0&k=20&c=wrbsqM7RTpT3_ZyAqHhHRa0fvmmwUBtSpm4BWVnhUwE="
        title="Pizza"
        restaurants={restaurants}
      />
      <CategoryCard
        imgUrl="https://media.istockphoto.com/id/472606186/tr/foto%C4%9Fraf/double-burger.jpg?s=612x612&w=0&k=20&c=cyXBJ_8tl7lyrGneyOsR7FS-Fb-v12LTtSAkHOZywDY="
        title="Burger"
        restaurants={restaurants}
      />
      <CategoryCard
        imgUrl="https://media.istockphoto.com/id/180698997/tr/foto%C4%9Fraf/beef-souvlaki-wrap.jpg?s=612x612&w=0&k=20&c=pKWN6Q3vnkDs5um3nEkRGw-m2ZLZNr4Bs7-roTwApHU="
        title="Sharwama"
        restaurants={restaurants}
      />
      <CategoryCard
        imgUrl="https://images.pexels.com/photos/6275186/pexels-photo-6275186.jpeg?auto=compress&cs=tinysrgb&w=1600"
        title="Flafel"
        restaurants={restaurants}
      />
      <CategoryCard
        imgUrl="https://images.pexels.com/photos/5175622/pexels-photo-5175622.jpeg?auto=compress&cs=tinysrgb&w=1600"
        title="Manakish"
        restaurants={restaurants}
      />
      <CategoryCard
        imgUrl="https://media.istockphoto.com/id/1271531078/photo/delicious-chicken-biryani-top-view-biryani-rice-dish-beautiful-indian-rice-dish-delicious.jpg?b=1&s=612x612&w=0&k=20&c=LBZJGqCtwoPqPfcUHgG1T0gnMJUj3ys286olRL1vS-I="
        title="Kabsa"
        restaurants={restaurants}
      />
      <CategoryCard
        imgUrl="https://images.pexels.com/photos/11426030/pexels-photo-11426030.jpeg?auto=compress&cs=tinysrgb&w=1600"
        title="Chicken"
        restaurants={restaurants}
      />
      */}
    </ScrollView>
  );
};

export default Categories;
