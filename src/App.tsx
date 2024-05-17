import { BrowserRouter } from 'react-router-dom';
import { Router } from './router/Router';
import { RecoilRoot } from 'recoil';
import { GlobalStyle } from './assets/styles/globalstyle';

export default function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      <GlobalStyle />
    </RecoilRoot>
  );
}
