import React from "react";
import ComingSoonPage from "../components/ComingSoon";
import { FaGoogle } from "react-icons/fa";

const Register = () => {
  const content =
    "Registration with credentials is not active yet, why not Sign Up with google ?";

  const icon = <FaGoogle />;
  return (
    <div>
      <ComingSoonPage content={content} icon={icon} />
    </div>
  );
};

export default Register;
