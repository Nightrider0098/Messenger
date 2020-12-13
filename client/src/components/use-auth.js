import React, { useContext, createContext, useState } from "react";
const authContext = createContext();

function useAuth() {
    return useContext(authContext);
}

// exports.useAuth
// exports.useAuth = useAuth
// exports.authContext = authContext;
export default [useAuth,authContext];