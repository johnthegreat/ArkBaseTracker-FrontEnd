// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import apiHelper from "../../utils/apiHelper";
import PointOfInterest from "../../models/PointOfInterest";

export default class PointOfInterestProvider {
    private readonly apiBaseUrl: string;
    constructor(apiBaseUrl: string) {
        this.apiBaseUrl = apiBaseUrl;
    }

    getPointsOfInterest(clusterUuid: string, serverUuid: string) {
        return apiHelper<PointOfInterest[]>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}/server/${serverUuid}/point-of-interest`));
    }

    getPointOfInterest(clusterUuid: string, serverUuid: string, pointOfInterestUuid: string) {
        return apiHelper<PointOfInterest>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}/server/${serverUuid}/point-of-interest/${pointOfInterestUuid}`));
    }

    createPointOfInterest(clusterUuid: string, serverUuid: string, pointOfInterest: PointOfInterest) {
        return apiHelper<PointOfInterest>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}/server/${serverUuid}/point-of-interest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pointOfInterest)
        }));
    }

    updatePointOfInterest(clusterUuid: string, serverUuid: string, pointOfInterestUuid: string, pointOfInterest: PointOfInterest) {
        return apiHelper<PointOfInterest>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}/server/${serverUuid}/point-of-interest/${pointOfInterestUuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pointOfInterest)
        }));
    }

    deletePointOfInterest(clusterUuid: string, serverUuid: string, pointOfInterestUuid: string) {
        return apiHelper<any>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}/server/${serverUuid}/point-of-interest/${pointOfInterestUuid}`, {
            method: 'DELETE'
        }));
    }
}