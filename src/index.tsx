// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';
import {BrowserRouter as Router, Route, Routes, useNavigate, } from "react-router-dom";
import ClusterIndex from "./pages/ClusterIndex";
import ServerIndex from "./pages/ServerIndex";
import ServerDetail from "./pages/ServerDetail";
import PointOfInterestDetail from "./pages/PointOfInterestDetail";

const Home = function() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/cluster');
    });
    return <></>;
};

ReactDOM.render(
  <React.StrictMode>
      <Router>
          <Routes>
              <Route path="/" element={<App />}>
                  <Route index element={<Home />} />
                  <Route path="cluster" element={<ClusterIndex />} />
                  <Route path="cluster/:clusterUuid" element={<ServerIndex />} />
                  <Route path="cluster/:clusterUuid/server/:serverUuid" element={<ServerDetail />} />
                  <Route path="cluster/:clusterUuid/server/:serverUuid/point-of-interest/:pointOfInterestUuid" element={<PointOfInterestDetail />} />
              </Route>
          </Routes>
      </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
