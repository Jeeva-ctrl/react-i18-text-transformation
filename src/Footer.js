const Footer = ({ t }) => (
  <div className="Footer">
    <div>{t("footer.date", { date: new Date() })}</div>
  </div>
);

export default Footer;
