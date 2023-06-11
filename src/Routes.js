// Routes.js
import React from "react";
import { Routes, Route } from 'react-router-dom';
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";

export default function MyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
