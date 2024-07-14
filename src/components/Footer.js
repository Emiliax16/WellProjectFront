import PropTypes from "prop-types";
import Typography from '@mui/material/Typography';
import Icon from "./Icon";
import instagramQR from '../assets/img/instagramQR.webp';
import Logo from '../assets/img/logo.webp';

const year = new Date().getFullYear();

export function Footer({ title, description, contactEmail, socials, menus, copyright, qrCode, logo }) {
  return (
    <footer className="relative px-4 pt-8 pb-6">
      <div className="container mx-auto">
        <div className="flex flex-wrap pt-6 text-center lg:text-left">
          <div className="w-full px-4 lg:w-4/12">
            <Typography variant="h4" className="mb-4" color="blue-gray">
              {title}
            </Typography>
            <Typography className="font-normal text-blue-gray-500 lg:w-full">
              {description}
            </Typography>
            <Typography className="font-normal text-blue-gray-500 lg:w-full">
              {contactEmail}
            </Typography>
            <div className="mx-auto mt-6 mb-8 flex flex-col md:mb-0 lg:justify-start">
              <div className="mb-4">
                  <img src={qrCode} alt="Instagram QR Code" style={{ width: 150, height: 150 }} />
              </div>
              {socials.filter(social => social.name === 'Instagram').map(({ color, name, path }) => (
                  <a key={name} href={path} rel="noopener noreferrer" className="flex mt-2 ml-3">
                      <Icon icon={name} classNameIcon={color} classNameDiv="flex flex-row items-center justify-center" />
                  </a>
              ))}
            </div>

          </div>
          <div className="w-full lg:w-4/12 mx-auto mt-12 lg:mt-0">
            {menus.map(({ name, items, logo }) => (
              <div key={name}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 block font-medium uppercase"
                >
                  {name}
                </Typography>
                <ul className="mt-3">
                  {items.map((item) => (
                    <li key={item.name}>
                      <Typography
                        as="a"
                        href={item.path}
                        target="_blank"
                        rel="noreferrer"
                        variant="small"
                        className="mb-2 block font-normal text-blue-gray-500 hover:text-blue-gray-700"
                      >
                        {item.name}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="mb-4">
              <img src={logo} alt="Logo" style={{ width: 150, height: 150 }} />
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-300" />
        <div className="flex flex-wrap items-center justify-center md:justify-between">
          <div className="mx-auto w-full px-4 text-center">
            <Typography
              variant="small"
              className="font-normal text-blue-gray-500"
            >
              {copyright}
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  title: "Promedición Chile",
  description:
    "Monitoreo y precisión en telemetría del agua a la vanguardia tecnológica.",
  contactEmail:
    "Correo de contacto: info@promedicion.cl",
  socials: [
    {
      color: "text-gray-800",
      name: "Instagram",
      path: "https://www.instagram.com/promedicion/",
    },
  ],
  menus: [
    {
      name: "Fundadores",
      items: [
        {
          name: "Alejandro Gómez",
        },
        {
          name: "Aike Parvex",
        },
        {
          name: "Sebastián Torres",
        },
      ],
    },
  ],
  qrCode: instagramQR,
  logo: Logo,
  copyright: (
    <>
      Copyright © {year} Todos los derechos reservados.
    </>
  ),
};

Footer.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  socials: PropTypes.arrayOf(PropTypes.object),
  menus: PropTypes.arrayOf(PropTypes.object),
  qrCode: PropTypes.string,
  logo: PropTypes.string,
  copyright: PropTypes.node,
};

export default Footer;
