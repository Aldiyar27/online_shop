import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Header.css";

function getCurrentUser() {
  try {
    const userFromStorage = localStorage.getItem("currentUser");
    return userFromStorage ? JSON.parse(userFromStorage) : null;
  } catch {
    return null;
  }
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const { totalCount } = useCart();

  useEffect(() => {
    function syncUser() {
      setCurrentUser(getCurrentUser());
    }

    window.addEventListener("storage", syncUser);
    window.addEventListener("auth-change", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-change", syncUser);
    };
  }, []);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function logout() {
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("auth-change"));
    setCurrentUser(null);
    closeMenu();
  }

  return (
    <>
      <header className="header">
        <Link to="/" className="header__logo">
          MyShop Market
        </Link>

        <nav className="header__nav">
          <Link to="/" className="header__link">
            Главная
          </Link>

          <Link to="/catalog" className="header__link">
            Каталог
          </Link>

          <Link to="/cart" className="header__link">
            Корзина ({totalCount})
          </Link>
        </nav>

        <div className="header__auth">
          {currentUser ? (
            <>
              <Link to="/profile" className="header__hello">
                Привет, {currentUser.name}
              </Link>

              <button className="header__logout" onClick={logout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header__login">
                Войти
              </Link>

              <Link to="/register" className="header__register">
                Регистрация
              </Link>
            </>
          )}
        </div>

        <button
          className="header__burger"
          type="button"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Открыть меню"
        >
          ☰
        </button>
      </header>

      <div className={`mobile-menu ${isMenuOpen ? "mobile-menu--open" : ""}`}>
        <div className="mobile-menu__top">
          <h2 className="mobile-menu__logo">MyShop</h2>

          <button
            className="mobile-menu__close"
            type="button"
            onClick={closeMenu}
            aria-label="Закрыть меню"
          >
            ×
          </button>
        </div>

        <nav className="mobile-menu__nav">
          <Link to="/" onClick={closeMenu} className="mobile-menu__link">
            Главная
          </Link>

          <Link to="/catalog" onClick={closeMenu} className="mobile-menu__link">
            Каталог
          </Link>

          <Link to="/cart" onClick={closeMenu} className="mobile-menu__link">
            Корзина ({totalCount})
          </Link>

          {currentUser ? (
            <>
              <Link to="/profile" onClick={closeMenu} className="mobile-menu__hello">
                Привет, {currentUser.name}
              </Link>

              <button className="mobile-menu__logout" type="button" onClick={logout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="mobile-menu__link">
                Войти
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="mobile-menu__link mobile-menu__link--primary"
              >
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>

      {isMenuOpen && (
        <div
          className="mobile-menu__overlay"
          onClick={closeMenu}
          role="button"
          tabIndex={0}
          aria-label="Закрыть меню"
        />
      )}
    </>
  );
}

export default Header;
