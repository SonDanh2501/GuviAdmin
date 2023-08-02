import { useCallback, useState } from "react";
import "./styles.scss";
import { Input } from "antd";
import _debounce from "lodash/debounce";

const DeepCleaning = () => {
  const [state, setState] = useState({
    address: "",
    lat: "",
    long: "",
    isLoading: false,
  });

  const handleSearchLocation = useCallback(
    _debounce((value) => {
      setState({ ...state, address: value, isLoading: true });
      // axios
      //   .get(
      //     "https://rsapi.goong.io/Place/AutoComplete?api_key=K6YbCtlzCGyTBd08hwWlzLCuuyTinXVRdMYDb8qJ",
      //     {
      //       params: {
      //         input: value,
      //       },
      //     }
      //   )
      //   .then((res) => {
      //     if (res.data.predictions) {
      //       setPlaces(res.data.predictions);
      //     } else {
      //       setPlaces([]);
      //     }

      //     setIsLoading(false);
      //   })
      //   .catch((err) => {
      //     setIsLoading(false);
      //     setPlaces([]);
      //   });
      //   googlePlaceAutocomplete(value)
      //     .then((res) => {
      //       if (res.predictions) {
      //         setPlaces(res.predictions);
      //       } else {
      //         setPlaces([]);
      //       }
      //       setIsLoading(false);
      //     })
      //     .catch((err) => {
      //       setIsLoading(false);
      //       setPlaces([]);
      //     });
    }, 1500),
    []
  );

  return (
    <div>
      <div className="div-search-address">
        <a className="label-input">Địa điểm</a>
        <Input
          placeholder="Tìm kiếm địa chỉ"
          className="input-search-address"
          prefix={<i class="uil uil-search"></i>}
          value={state?.address}
        />
      </div>
    </div>
  );
};

export default DeepCleaning;
