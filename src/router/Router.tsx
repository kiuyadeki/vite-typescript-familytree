import { FC, memo } from "react";
import { Route, Routes } from "react-router-dom";
import { Page404 } from "../components/pages/Page404";
import { FamilyTree } from "../features/app/component/FamilyTree";

export const Router: FC = memo(() => (
  <Routes>
    <Route path="" element={<FamilyTree />} />
    <Route path="*" element={<Page404 />} />
  </Routes>
));
