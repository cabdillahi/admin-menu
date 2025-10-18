import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/auth/sign-in");
  }, [navigate]);

  return <div></div>;
};

export default Home;
