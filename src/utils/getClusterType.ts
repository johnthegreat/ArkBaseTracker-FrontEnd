// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import ClusterType from "../models/enums/ClusterType";

export default function getClusterType(str: string): ClusterType | null {
	switch (str) {
		case "PVE": return ClusterType.PVE;
		case "PVP": return ClusterType.PVP;
		default: return null;
	}
}