// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import apiHelper from "../../utils/apiHelper";
import Server from "../../models/Server";

export default class ServerProvider {
    private readonly apiBaseUrl: string;
    constructor(apiBaseUrl: string) {
        this.apiBaseUrl = apiBaseUrl;
    }

    getServers(clusterUuid: string) {
        return apiHelper<Server[]>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}/server`));
    }

    getServer(clusterUuid: string, serverUuid: string) {
        return apiHelper<Server>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}/server/${serverUuid}`));
    }

    createServer(clusterUuid: string, server: Server) {
        return apiHelper<Server>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}/server`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(server)
        }));
    }

    deleteServer(clusterUuid: string, serverUuid: string) {
        return apiHelper<any>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}/server/${serverUuid}`, {
            method: 'DELETE'
        }));
    }
}