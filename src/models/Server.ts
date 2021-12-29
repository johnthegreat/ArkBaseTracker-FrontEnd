// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

export default interface Server {
    uuid?: string,
    clusterUuid: string,
    serverName: string,
    mapType: string,
    createdAt?: string,
    updatedAt?: string
}