import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { pb } from './Config';
import CreateEntry from './Create';
import DetailView from './DetailView';
import ListView from './ListView';
import Navbar from './Navbar';

function App() {
  const [authValid, setAuthValid] = useState(pb.authStore.isValid)
  const [userId, setUserId] = useState((pb.authStore.model !== null) ? pb.authStore.model.id : null)
  console.log(userId)
  useEffect(() => {
    return pb.authStore.onChange(() => {
        setAuthValid(pb.authStore.isValid)
        setUserId((pb.authStore.model !== null) ? pb.authStore.model.id : null)
    })
  }, [])

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar setAuthValid={setAuthValid} setUserId={setUserId}/>
        <div className="content">
          <Routes>
            <Route exact path="/" element={
            <ListView authValid={authValid}
            />} />
            <Route exact path="/create" element={<CreateEntry authValid={authValid} userId={userId} />} />
            {/* <Route exact path="/auth" element={<Auth />} /> */}
            <Route path="/entries/:id" element={<DetailView authValid={authValid} userId={userId} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;