// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import ServerProvider from "../apis/providers/ServerProvider";
import Server from "../models/Server";
import CreateServerModal from "../components/modals/CreateServerModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import ConfirmActionModal from "../components/modals/ConfirmActionModal";

// @ts-ignore
const serverProvider = new ServerProvider(process.env.REACT_APP_API_BASE_URL);

export default function ServerIndex() {
	const params: any = useParams();
	const [servers, setServers] = useState<Server[]>([]);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [serverUuidPendingDeletion, setServerUuidPendingDeletion] = useState<string>();

	const loadServers = function(clusterUuid: string) {
		serverProvider.getServers(clusterUuid).then(function (_servers) {
			setServers(_servers);
		});
	};

	const createServer = function(clusterUuid: string, server: Server) {
		serverProvider.createServer(clusterUuid, server).then(function() {
			loadServers(clusterUuid);
		});
	}

	useEffect(() => {
		loadServers(params.clusterUuid);
	}, [params.clusterUuid]);

	return (
		<>
			<Link to="/cluster">Back to Clusters</Link>

			<h1>Servers</h1>

			<div className="list-group">
				{servers.length === 0 ? "No servers yet" : ""}
				{servers.length > 0 ? servers.map((server) => {
					return (
						<div className="list-group-item" key={server.uuid} id={server.uuid}>
							<Link to={"/cluster/"+server.clusterUuid+"/server/"+server.uuid}>
								{server.serverName}
							</Link>

							<button className={"btn btn-sm btn-danger float-end"} onClick={() => setServerUuidPendingDeletion(server.uuid)}>
								<FontAwesomeIcon icon={faTrashAlt} /> Delete
							</button>
						</div>
					);
				}) : <></>}
			</div>

			<div className="mt-3 float-end">
				<button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
					<FontAwesomeIcon icon={faPlus} /> Create
				</button>
			</div>

			{showCreateModal ? <CreateServerModal clusterUuid={params.clusterUuid} onCreatedServer={
				(server: Server) => createServer(params.clusterUuid, server)
			} onClose={
				() => setShowCreateModal(false)
			} /> : <></>}

			{serverUuidPendingDeletion ? <ConfirmActionModal
				title={"Delete Server"}
				message={"Are you sure you want to delete this server?"}
				onCallback={
					(arg: boolean) => {
						if (arg) {
							serverProvider.deleteServer(params.clusterUuid, serverUuidPendingDeletion).finally(function() {
								loadServers(params.clusterUuid);
							});
						}
						setServerUuidPendingDeletion(undefined);
					}
				}
			/> : <></>}
		</>
	);
}