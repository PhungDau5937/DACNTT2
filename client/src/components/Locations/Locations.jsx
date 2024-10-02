import React, { useEffect, useState } from "react";

const Locations = ({ onChange }) => {
  const [addresses, setAddresses] = useState({
    quan_huyen: [],
    phuong_xa: [],
    tinh_tp: [],
  });
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}locations.json`
        );
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu từ server!");
        }
        const data = await response.json();
        setAddresses(data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Lỗi khi đọc file:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleProvinceChange = (e) => {
    const province = e.target.value;
    const provinceName =
      addresses.tinh_tp.find((p) => p.id === province)?.name || "";
    setSelectedProvince(province);
    setSelectedDistrict("");
    setSelectedWard("");
    onChange({ target: { name: "address", value: `${provinceName}` } });
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    const districtName =
      addresses.quan_huyen.find((d) => d.id === district)?.name || "";
    setSelectedDistrict(district);
    setSelectedWard("");
    const provinceName =
      addresses.tinh_tp.find((p) => p.id === selectedProvince)?.name || "";
    onChange({
      target: { name: "address", value: `${provinceName}, ${districtName}` },
    });
  };

  const handleWardChange = (e) => {
    const ward = e.target.value;
    const wardName = addresses.phuong_xa.find((w) => w.id === ward)?.name || "";
    setSelectedWard(ward);
    const provinceName =
      addresses.tinh_tp.find((p) => p.id === selectedProvince)?.name || "";
    const districtName =
      addresses.quan_huyen.find((d) => d.id === selectedDistrict)?.name || "";
    onChange({
      target: {
        name: "address",
        value: `${wardName}, ${districtName}, ${provinceName}.`,
      },
    });
  };

  return (
    <div className="mb-4">
      <select
        id="provinceSelect"
        value={selectedProvince}
        onChange={handleProvinceChange}
        className="border border-gray-300 rounded-md w-full p-2 mt-1"
      >
        <option value="">Chọn tỉnh/thành phố</option>
        {addresses.tinh_tp.map((province) => (
          <option key={province.id} value={province.id}>
            {province.name}
          </option>
        ))}
      </select>
      <select
        id="districtSelect"
        value={selectedDistrict}
        onChange={handleDistrictChange}
        className="border border-gray-300 rounded-md w-full p-2 mt-1"
      >
        <option value="">Chọn quận/huyện</option>
        {addresses.quan_huyen
          .filter((district) => district.tinh_tp_id === selectedProvince)
          .map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
      </select>
      <select
        id="wardSelect"
        value={selectedWard}
        onChange={handleWardChange}
        className="border border-gray-300 rounded-md w-full p-2 mt-1"
      >
        <option value="">Chọn phường/xã</option>
        {addresses.phuong_xa
          .filter((ward) => ward.quan_huyen_id === selectedDistrict)
          .map((ward) => (
            <option key={ward.id} value={ward.id}>
              {ward.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default Locations;