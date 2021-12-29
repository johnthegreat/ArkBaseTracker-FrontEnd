// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import React from "react";
import { Outlet } from "react-router-dom";

export default function App() {
	return (
		<div className="container mt-2">
			<Outlet />
		</div>
	);
}