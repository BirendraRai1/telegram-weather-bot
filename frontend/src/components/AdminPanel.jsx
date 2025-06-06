import React, { useEffect, useState } from "react";
import "./adminPanel.css";
import axios from "axios";
import Button from "./Button";
import Card from "./Card";
import CardContent from "./Card";
import Input from "./Input";
import Switch from "./Switch";
import {getUsers,getSettings,updateSetting,switchUser} from "../../urlConfig"


export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue,setNewValue] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await getUsers()
      const keyRes = await getSettings();
      setUsers(userRes.data);
      setApiKey(keyRes.data.key);
    } catch (err) {
      console.error(err);
    }
  };

  const updateApiKey = async (apiKey,newkey,newValue) => {
    try {
      await updateSetting(apiKey,newkey,newValue)
      setApiKey(newKey);
      setNewKey("");
      setNewValue("")
    } catch (err) {
      console.error(err);
    }
  };

  const toggleUser = async (userId, blocked) => {
   // console.log('inside toggleUser is',userId,blocked)
    try {
      await switchUser(userId,blocked);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      <Card>
        <CardContent>
          <h3 className="text-sm mb-2">Weather API Key</h3>
          <p className="text-sm mb-2">Current Key: {apiKey}</p>
          <div className="flex gap-2">
            <Input
              placeholder="Enter new API key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
             <Input
              placeholder="Enter new API value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <Button onClick={()=>updateApiKey(apiKey,newKey,newValue)}>Update Key</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="card-content">
          <h3 className="font-semibold mb-4">User Management</h3>
          {users.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <p className="font-medium">{user.firstName}</p>
                <p className="text-sm text-gray-500">{user.chatId}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
                <Switch
                  checked={!user.isBlocked}
                  onChange={() => {
                    toggleUser(user._id, !user.isBlocked)
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
