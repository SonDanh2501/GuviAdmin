import { useSelector } from "react-redux";
import { getBrand } from "../../redux/selectors/brand";
import "./Header.scss";

const Header = ({ onClick }) => {
  const brand = useSelector(getBrand);

  console.log("brand", brand);
  return (
    <div className="container-header">
      <button onClick={onClick} className="btn-menu">
        <i class="uil uil-bars"></i>
      </button>
      <p className="text-brand">{brand}</p>
    </div>
  );
};

export default Header;
