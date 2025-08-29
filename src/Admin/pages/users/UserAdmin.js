import axios from "axios";
import { useEffect, useState } from "react";
import Alert from "../../../basicUtilityComponenets/alert/Alert";
import { baseUrl } from "../../../environment.js";

export default function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleMessageClear = () => {
    setMessage("");
    setMessageType("success");
  };

  const fetchUsers = () => {
    axios
      .get(`${baseUrl}/user`)
      .then((resp) => {
        setUsers(resp.data.users);
      })
      .catch((e) => {
        console.log("Error fetching users", e);
      });
  };

  const handleUserDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`${baseUrl}/user/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setMessageType("success");
          setUsers(resp.data.users);
        })
        .catch((e) => {
          console.log("Error in delete", e);
          const errorMsg = e.response?.data?.message || "Error deleting user";
          setMessage(errorMsg);
          setMessageType("error");
        });
    }
  };

  const convertDate = (dateData) => {
    const date = new Date(dateData);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {message && (
        <Alert
          message={message}
          type={messageType}
          handleMessageClear={handleMessageClear}
        />
      )}

      <h1 className="text-3xl font-bold text-center mb-6">👥 Users Panel</h1>

      <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-gray-700 to-gray-900 text-white">
            <tr>
              <th className="px-4 py-3">👤 Name</th>
              <th className="px-4 py-3">📧 Email</th>
              <th className="px-4 py-3">🗓️ Registered</th>
              <th className="px-4 py-3">🛡️ Role</th>
              <th className="px-4 py-3">🗑️ Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={i}
                className={`${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100 transition-all text-center border-b`}
              >
                <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{convertDate(user.createdAt)}</td>
                <td className="px-4 py-3 capitalize font-medium text-indigo-600">
                  {user.role}
                </td>
                <td className="px-4 py-3">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-all duration-300"
                    onClick={() => handleUserDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
