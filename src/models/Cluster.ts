// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import ClusterType from "./enums/ClusterType";

export default interface Cluster {
    uuid?: string;
    name: string;
    type: ClusterType;
    createdAt?: string;
    updatedAt?: string;
};