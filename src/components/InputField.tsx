"use client";

export default function InputField({ formType, user, setUser, idType }) {
  const handleChange = (e) => {
    setUser({
      ...user,
      [idType]: e.target.value,
    });
  };

  const getInputType = () => {
    if (formType === "password") return "password";
    if (formType === "username") return "text"; // Treat username as text input
    return "text"; // Default to email for other cases
  };

  const getPlaceholder = () => {
    if (formType === "password") return "password";
    if (formType === "username") return "username";
    return "email";
  };

  return (
    <input
      role="textbox"
      className="p-2 m-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
      type={getInputType()}
      id={idType}
      value={user.idType}
      onChange={handleChange}
      placeholder={getPlaceholder()}
    />
  );
}
