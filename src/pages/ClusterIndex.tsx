// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import ClusterProvider from "../apis/providers/ClusterProvider";
import Cluster from "../models/Cluster";
import ClusterType from "../models/enums/ClusterType";
import CreateClusterModal from "../components/modals/CreateClusterModal";
import localizationService from "../LocalizationService";
import getDefaultLocale from "../getDefaultLocale";
import ConfirmActionModal from "../components/modals/ConfirmActionModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

// @ts-ignore
const clusterProvider = new ClusterProvider(process.env.REACT_APP_API_BASE_URL);

function getLocalizedValue(locale: string, token: string) {
	return localizationService.getValue(locale, token);
}

export default function ClusterIndex() {
	const [clusters, setClusters] = useState<Cluster[]>([]);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [clusterUuidPendingDeletion, setClusterUuidPendingDeletion] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string>('');

	function loadClusters() {
		return clusterProvider.getClusters().then(function(_clusters) {
			console.log(_clusters);
			setClusters(_clusters);
		}).catch(function() {
			setErrorMessage('An error occurred loading clusters.');
		});
	}

	useEffect(() => {
		loadClusters().finally();
	}, []);

	const clusterTypes: ClusterType[] = [ClusterType.PVE,  ClusterType.PVP];

	return (
		<>
			<h1>{getLocalizedValue(getDefaultLocale(), "CLUSTERS")}</h1>

			{errorMessage && clusters.length === 0 ? <div className={"alert alert-danger"}>
				<FontAwesomeIcon icon={faExclamationCircle} /> {errorMessage}
			</div> : <></>}

			<div className="table-responsive">
				<table className="table table-bordered table-striped">
					<thead>
						<tr>
							<th>{getLocalizedValue(getDefaultLocale(), "NAME")}</th>
							<th>{getLocalizedValue(getDefaultLocale(), "TYPE")}</th>
							<th>{getLocalizedValue(getDefaultLocale(), "ACTIONS")}</th>
						</tr>
					</thead>
					<tbody>
					{clusters.length > 0 && clusters.map((cluster) => {
						return <tr key={cluster.uuid} id={cluster.uuid}>
							<td><Link to={"/cluster/"+cluster.uuid}>{cluster.name}</Link></td>
							<td>{cluster.type}</td>
							<td>
								<button type="button" className="btn btn-sm btn-danger" onClick={() => setClusterUuidPendingDeletion(cluster.uuid!)}>
									<FontAwesomeIcon icon={faTrashAlt} /> {getLocalizedValue(getDefaultLocale(), "DELETE")}
								</button>
							</td>
						</tr>;
					})}
					</tbody>
				</table>
			</div>

			<button onClick={
				() => setShowCreateModal(true)
			} className="btn btn-primary float-end">
				<FontAwesomeIcon icon={faPlus} /> {getLocalizedValue(getDefaultLocale(), "CREATE")}
			</button>

			{showCreateModal ? <CreateClusterModal clusterTypes={clusterTypes} onClose={
				(cluster?: Cluster) => {
					if (cluster) {
						clusterProvider.createCluster(cluster).then(function () {
							loadClusters().finally();
						});
					}

					setShowCreateModal(false)
				}
			} /> : <></>}

			{clusterUuidPendingDeletion && <ConfirmActionModal
					title={"Delete Cluster"}
					message={"Are you sure you want to delete this cluster?"}
					onCallback={(arg: boolean) => {
						if (arg) {
							clusterProvider.deleteCluster(clusterUuidPendingDeletion).finally(function() {
								loadClusters().finally();
							});
						}
						setClusterUuidPendingDeletion(null);
					}}
			/>}
		</>
	);
}