import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { UserApi } from "../../libs/api/UserApi";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const checkAuth = async () => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    const response = await UserApi.getUserProfile();
    if (response.status !== 200) {
      navigate("/login");
      return;
    }
    const responseBody = await response.json();
    if (responseBody.user.role !== "ADMIN") {
      navigate("/");
      return;
    }
  };

  useEffect(() => {
    checkAuth();
  });
  return (
    <>
      <Outlet />
    </>
  );
};

export default AdminLayout;
