// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import {useEffect, useState, useCallback} from "react";
import {Link, useParams} from "react-router-dom";
import ServerProvider from "../apis/providers/ServerProvider";
import Server from "../models/Server";
import PointOfInterest from "../models/PointOfInterest";
import PointOfInterestProvider from "../apis/providers/PointOfInterestProvider";
import getServerMapFromName from "../utils/getServerMapFromName";
import CreatePointOfInterestModal from "../components/modals/CreatePointOfInterestModal";
import ConfirmActionModal from "../components/modals/ConfirmActionModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faPlus, faTrashAlt} from "@fortawesome/free-solid-svg-icons";

// @ts-ignore
const serverProvider = new ServerProvider(process.env.REACT_APP_API_BASE_URL);
// @ts-ignore
const pointOfInterestProvider = new PointOfInterestProvider(process.env.REACT_APP_API_BASE_URL);

export default function ServerDetail() {
	const params: any = useParams();
	const [server, setServer] = useState<Server>();
	const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);
	const [filter, setFilter] = useState<string>('');
	const [showCreatePointOfInterestModal, setShowCreatePointOfInterestModal] = useState(false);
	const [pointOfInterestUuidPendingDeletion, setPointOfInterestUuidPendingDeletion] = useState<string | null>(null);
	const [pointOfInterestUuidToEdit, setPointOfInterestUuidToEdit] = useState<string | null>(null);

	const loadPointsOfInterest = useCallback(function(clusterUuid: string, serverUuid: string) {
		pointOfInterestProvider.getPointsOfInterest(clusterUuid, serverUuid).then(function(_pointsOfInterest) {
			setPointsOfInterest(_pointsOfInterest);
		});
	}, []);

	useEffect(() => {
		serverProvider.getServer(params.clusterUuid, params.serverUuid).then(function (_server) {
			setServer(_server);
		});

		loadPointsOfInterest(params.clusterUuid, params.serverUuid);
	}, [params.clusterUuid, params.serverUuid, loadPointsOfInterest]);

	function createPointOfInterest(pointOfInterest: PointOfInterest) {
		pointOfInterestProvider.createPointOfInterest(params.clusterUuid, params.serverUuid, pointOfInterest).finally(function() {
			loadPointsOfInterest(params.clusterUuid, params.serverUuid);
		});
	}

	function updatePointOfInterest(pointOfInterestUuid: string, pointOfInterest: PointOfInterest) {
		pointOfInterestProvider.updatePointOfInterest(params.clusterUuid, params.serverUuid, pointOfInterestUuid, pointOfInterest).finally(function() {
			loadPointsOfInterest(params.clusterUuid, params.serverUuid);
		});
	}

	function deletePointOfInterest(pointOfInterestUuid: string) {
		pointOfInterestProvider.deletePointOfInterest(params.clusterUuid, params.serverUuid, pointOfInterestUuid).finally(function() {
			loadPointsOfInterest(params.clusterUuid, params.serverUuid);
		});
	}

	function getPointOfInterestByUuid(pointOfInterestUuid: string) {
		const pointOfInterestArr = pointsOfInterest.filter(pointOfInterest => pointOfInterest.uuid === pointOfInterestUuid);
		if (pointOfInterestArr.length === 0) {
			return undefined;
		}
		return pointOfInterestArr[0];
	}

	return (
		<>
			<Link to={"/cluster/"+params.clusterUuid}>Back to Servers</Link>

			<h1>Server Details</h1>

			<div className="row">
				<div className="col-md-5 col-lg-4 mb-3">
					{server && <img src={"/maps/"+getServerMapFromName(server.mapType)} className="img-fluid" alt="" />}
				</div>
				<div className="col-md-7 col-lg-8 mb-3">
					<div className="text-center pb-3">
						<div className="btn-group" role="group" aria-label="Filter">
							<button type="button" className={["btn", filter === 'Base' ? "btn-secondary" : "btn-primary"].join(' ')} onClick={() => setFilter('Base')}>Enemy Bases</button>
							<button type="button" className={["btn", filter === 'Point of Interest' ? "btn-secondary" : "btn-primary"].join(' ')} onClick={() => setFilter('Point of Interest')}>Points of Interest</button>
							<button type="button" className={["btn", filter === '' ? "btn-secondary" : "btn-primary"].join(' ')} onClick={() => setFilter('')}>Clear Filters</button>
						</div>
					</div>

					<div className="table-responsive">
						<table className="table table-bordered table-striped">
							<thead>
								<tr>
									<th />
									<th>Type</th>
									<th>Base Owner</th>
									<th>Alliance Status</th>
									<th>Wiped</th>
									<th>Lat</th>
									<th>Lng</th>
									<th>Description</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
							{pointsOfInterest.map((pointOfInterest) => {
								if (filter !== '' && pointOfInterest.type !== filter) {
									return null;
								}

								return (
									<tr key={pointOfInterest.uuid} id={pointOfInterest.uuid}>
										<td>
											<Link to={"/cluster/"+params.clusterUuid+"/server/"+params.serverUuid+"/point-of-interest/"+pointOfInterest.uuid}>
												View
											</Link>
										</td>
										<td style={{ whiteSpace: "nowrap" }}>{pointOfInterest.type}</td>
										<td>
											{pointOfInterest.ownerName}
										</td>
										<td>{pointOfInterest.type === 'Base' ? pointOfInterest.allianceStatus : ''}</td>
										<td>{pointOfInterest.wiped ? <button className="btn btn-sm btn-primary" disabled>Wiped</button> : <></>}</td>
										<td>{pointOfInterest.lat.toFixed(1)}</td>
										<td>{pointOfInterest.lng.toFixed(1)}</td>
										<td>{pointOfInterest.description ? pointOfInterest.description : <></>}</td>
										<td style={{ whiteSpace: "nowrap" }}>
											<button className={"btn btn-sm btn-primary"} onClick={() => setPointOfInterestUuidToEdit(pointOfInterest.uuid!)}>
												<FontAwesomeIcon icon={faPencilAlt} /> Edit
											</button>

											&nbsp;

											<button className="btn btn-sm btn-danger" onClick={() => setPointOfInterestUuidPendingDeletion(pointOfInterest.uuid!)}>
												<FontAwesomeIcon icon={faTrashAlt} /> Delete
											</button>
										</td>
									</tr>
								);
							})}
							</tbody>
						</table>
					</div>

					<div className="mt-3 float-end">
						<button className="btn btn-primary" onClick={() => setShowCreatePointOfInterestModal(true)}>
							<FontAwesomeIcon icon={faPlus} /> Create
						</button>
					</div>
				</div>
			</div>

			{showCreatePointOfInterestModal ? <CreatePointOfInterestModal serverUuid={params.serverUuid} onClose={
				(pointOfInterest: PointOfInterest) => {
					if (pointOfInterest) {
						createPointOfInterest(pointOfInterest)
					}
					setShowCreatePointOfInterestModal(false);
				}
			} /> : <></>}

			{pointOfInterestUuidToEdit ? <CreatePointOfInterestModal
				title={'Update Point of Interest'}
				saveButtonLabel={'Update'}
				serverUuid={params.serverUuid}
				existingPointOfInterest={getPointOfInterestByUuid(pointOfInterestUuidToEdit)}
				onClose={
					(pointOfInterest: PointOfInterest) => {
						if (pointOfInterest) {
							pointOfInterest.uuid = pointOfInterestUuidToEdit;
							updatePointOfInterest(pointOfInterestUuidToEdit, pointOfInterest)
						}
						setPointOfInterestUuidToEdit(null);
					}
				}
			/> : <></>}

			{pointOfInterestUuidPendingDeletion && <ConfirmActionModal
                title={"Delete Point of Interest"}
                message={"Are you sure you want to delete this point of interest?"}
                onCallback={(arg: boolean) => {
					if (arg) {
						deletePointOfInterest(pointOfInterestUuidPendingDeletion);
					}
					setPointOfInterestUuidPendingDeletion(null);
				}}
            />}
		</>
	);
}