import React, { useEffect, useState } from "react";
import supabase from "../config/supabase";
import { ThemeProvider } from "@emotion/react";
import theme from "../config/theme";
import NavBar from "./NavBar";
const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await supabase.auth.getUser();
        const {
          data: { user },
        } = response;
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getName = async () => {
      if (!userData) return; // Prevent unnecessary API calls before user data is available

      try {
        const { data, error } = await supabase
          .from("user profiles")
          .select("name")
          .eq("id", userData.id)
          .single();
        if (error) {
          console.error("Error fetching name:", error);
          return; // Handle potential errors gracefully
        }
        setUserName(data.name);
      } catch (error) {
        console.error("Error fetching name:", error);
      }
    };

    getName();
  }, [userData]);
  console.log(userName);
  console.log(userData);
  return (
    <ThemeProvider theme={theme}>
        <NavBar/>
      <div style={{ color: "#E3FDFD" }}>
        {userData ? (
          <div>
            <h1>Hello, {userName}</h1>
            <h1>user email: {userData.email}</h1>
            <h1>account created on: {userData.created_at}</h1>
          </div> // Display "Loading..." if name hasn't been fetched yet
        ) : (
          <div>Loading user data...</div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default UserProfile;
