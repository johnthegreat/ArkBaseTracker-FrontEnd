// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import Cluster from "../../models/Cluster";
import apiHelper from "../../utils/apiHelper";

export default class ClusterProvider {
    private readonly apiBaseUrl: string;
    constructor(apiBaseUrl: string) {
        this.apiBaseUrl = apiBaseUrl;
    }

    getClusters() {
        return apiHelper<Cluster[]>(fetch(`${this.apiBaseUrl}/api/cluster`));
    }

    getCluster(clusterUuid: string) {
        return apiHelper<Cluster>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}`));
    }

    createCluster(cluster: Cluster) {
        return apiHelper<Cluster>(fetch(`${this.apiBaseUrl}/api/cluster`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cluster)
        }));
    }

    updateCluster(cluster: Cluster) {
        return apiHelper<Cluster>(fetch(`${this.apiBaseUrl}/api/cluster/${cluster.uuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cluster)
        }));
    }

    deleteCluster(clusterUuid: string) {
        return apiHelper<null>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}`, {
            method: 'DELETE'
        }));
    }
}
