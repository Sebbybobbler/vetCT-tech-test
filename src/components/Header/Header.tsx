import "../../assets/css/Header.css";

function Header() {
  return (
    <header>
      <img
        alt="Vet.CT Logo"
        className="headerLogo headerItem"
        src="https://euw2-prod-vetct-public-assets.s3.eu-west-2.amazonaws.com/vetct-logos/VETCT-logo-cropped-burgundy.png"
      />
      <img
        alt="Profile Image"
        className="headerProfile headerItem"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Default_avatar_profile.jpg/512px-Default_avatar_profile.jpg?20231202140256"
      />
    </header>
  );
}

export default Header;
