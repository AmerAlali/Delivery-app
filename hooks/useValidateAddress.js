import { useState } from "react";
import axios from "axios";
import * as turf from "@turf/turf";

export const useValidateAddress = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pointsWithinPolygon = async (lang, lat, neighborhoods) => {
    const results = {
      id: null,
      isPointWithinPolygon: false,
    };
    neighborhoods.some((neighborhood) => {
      if (neighborhood.boundary) {
        const point = turf.point([lang, lat]);
        const searchWithin = turf.polygon([JSON.parse(neighborhood.boundary)]);
        const ptsWithin = turf.booleanPointInPolygon(point, searchWithin);
        if (ptsWithin === true) {
          results.isPointWithinPolygon = ptsWithin;
          results.id = neighborhood.id;
          return true;
        }
      }
      return results;
    });
    return results;
  };

  const validateAddress = async (lang, lat, postCode) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://cravecorner.shop/api/validate_address",
        { postCode: postCode },
        {
          headers: {
            userAgent: "CraveMobile",
          },
        }
      );
      const neigh_id = await pointsWithinPolygon(lang, lat, response.data);

      return neigh_id;
    } catch (error) {
      setError(error.message);
      const results = {
        id: null,
        isPointWithinPolygon: false,
      };
      return results;
    } finally {
      setIsLoading(false);
    }
  };

  return { validateAddress, isLoading, error };
};
