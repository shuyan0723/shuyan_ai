  import {
    useState, 
    useEffect,
    Suspense,
    lazy
  } from "react";
  import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
  } from 'react-router-dom'
import Loading from './components/Loading';
const RepoList = lazy(() => import('./pages/RepoList'));
function App() {
return(
 <Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/users/:id/repos" element={<RepoList />} />
    <Route path="*" element={<Navigate to="/users/shunwuyu/repos" />} />
  </Routes>
 </Suspense>
);
}

  export default App;
