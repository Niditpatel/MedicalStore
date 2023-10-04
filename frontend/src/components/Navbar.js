import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";

export function StickyNavbar() {
  const navigate = useNavigate();
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Button
        variant="gradient"
        size="sm"
        onClick={((e) => { navigate("/company"); })}
      >
        <span>Company</span>
      </Button>
      <Button
        variant="gradient"
        size="sm"
        onClick={((e) => { navigate("/suppliers"); })}
      >
        <span>Supplier</span>
      </Button>
      <Button
        variant="gradient"
        size="sm"
        onClick={((e) => { navigate("/"); })}
      >
        <span>Home</span>
      </Button>
      <Button
        variant="gradient"
        size="sm"
        onClick={((e) => { navigate("/cart"); })}
      >
        <span>Cart</span>
      </Button>
      <Button
        variant="gradient"
        size="sm"
        onClick={((e) => { navigate("/buyer"); })}
      >
        <span>BUyer</span>
      </Button>
    </ul>
  );

  return (
    <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4 mb-6 print:hidden">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="mr-4 cursor-pointer py-1.5 font-medium"
        >
          <Link to="/">
            Apple Medical
          </Link>
        </Typography>
        <div className="flex items-center gap-4">
          {/* <div className="mr-4 hidden lg:block">{navList}</div> */}
          <Button
            variant="gradient"
            size="sm"
            className="hidden lg:inline-block"
            onClick={((e) => { navigate("/company"); })}
          >
            <span>Company</span>
          </Button>
          <Button
            variant="gradient"
            size="sm"
            className="hidden lg:inline-block"
            onClick={((e) => { navigate("/suppliers"); })}
          >
            <span>Supplier</span>
          </Button>
          <Button
            variant="gradient"
            size="sm"
            className="hidden lg:inline-block"
            onClick={((e) => { navigate("/"); })}
          >
            <span>Home</span>
          </Button>
          <Button
            variant="gradient"
            size="sm"
            className="hidden lg:inline-block"
            onClick={((e) => { navigate("/cart"); })}
          >
            <span>Cart</span>
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={((e) => { navigate("/buyer"); })}
          >
            <span>BUyer</span>
          </Button>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav}>
        {navList}

      </Collapse>
    </Navbar>
  );
}