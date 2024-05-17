import { FC, memo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Page404 } from '../features/app/component/Page404';
import { FamilyTree } from '../features/app/component/FamilyTree';

export const Router: FC = memo(function RouterComponent() {
  return (
    <Routes>
      <Route path='' element={<FamilyTree />} />
      <Route path='*' element={<Page404 />} />
    </Routes>
  );
});
