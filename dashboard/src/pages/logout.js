const logout = () => {
  localStorage.removeItem("token");
  if (window.confirm("Are you sure you want to logout?")) {
  window.location.href = '/';
  alert('You have been logged out.Please login again to continue')
  }
};

export { logout };
