import "./Header.scss";

const Header = ({ onClick }) => {
  return (
    <div className="container-header">
      <button onClick={onClick} className="btn-menu">
        <i class="uil uil-bars"></i>
      </button>
    </div>
  );
};

export default Header;
