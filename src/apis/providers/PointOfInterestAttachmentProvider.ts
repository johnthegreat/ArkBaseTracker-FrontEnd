// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import PointOfInterestAttachment from "../../models/PointOfInterestAttachment";
import apiHelper from "../../utils/apiHelper";

export default class PointOfInterestAttachmentProvider {
    private readonly apiBaseUrl: string;
    constructor(apiBaseUrl: string) {
        this.apiBaseUrl = apiBaseUrl;
    }

    getPointOfInterestAttachments(clusterUuid: string, serverUuid: string, pointOfInterestUuid: string) {
        return apiHelper<PointOfInterestAttachment[]>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}/server/${serverUuid}/point-of-interest/${pointOfInterestUuid}/attachment`));
    }

    getPointOfInterestAttachment(clusterUuid: string, serverUuid: string, pointOfInterestUuid: string, pointOfInterestAttachmentUuid: string) {
        return apiHelper<PointOfInterestAttachment>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}/server/${serverUuid}/point-of-interest/${pointOfInterestUuid}/attachment/${pointOfInterestAttachmentUuid}`));
    }

    createPointOfInterestAttachment(clusterUuid: string, serverUuid: string, pointOfInterestUuid: string, file: File) {
        const formData = new FormData();
        formData.set('file', file);

        return apiHelper<PointOfInterestAttachment>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}/server/${serverUuid}/point-of-interest/${pointOfInterestUuid}/attachment`, {
            method: 'POST',
            body: formData
        }));
    }

    deletePointOfInterestAttachment(clusterUuid: string, serverUuid: string, pointOfInterestUuid: string, pointOfInterestAttachmentUuid: string) {
        return apiHelper<any>(fetch(`${this.apiBaseUrl}/api/cluster/${clusterUuid}/server/${serverUuid}/point-of-interest/${pointOfInterestUuid}/attachment/${pointOfInterestAttachmentUuid}`, {
            method: 'DELETE'
        }));
    }
}