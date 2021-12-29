// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import PointOfInterestType from "./enums/PointOfInterestType";

export default interface PointOfInterest {
    uuid?: string,
    serverUuid: string,
    type: PointOfInterestType,
    ownerName: string,
    allianceStatus: string,
    wiped: boolean,
    lat: number,
    lng: number,
    description?: string,
    createdAt?: string,
    updatedAt?: string
}