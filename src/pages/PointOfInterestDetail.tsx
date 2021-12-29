// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import {useEffect, useState, useCallback} from "react";
import {useParams} from "react-router-dom";
import PointOfInterest from "../models/PointOfInterest";
import PointOfInterestAttachment from "../models/PointOfInterestAttachment";
import PointOfInterestProvider from "../apis/providers/PointOfInterestProvider";
import PointOfInterestAttachmentProvider from "../apis/providers/PointOfInterestAttachmentProvider";
import UploadPointOfInterestAttachmentModal from "../components/modals/UploadPointOfInterestAttachmentModal";
import ConfirmActionModal from "../components/modals/ConfirmActionModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faUpload, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

// @ts-ignore
const pointOfInterestProvider = new PointOfInterestProvider(process.env.REACT_APP_API_BASE_URL);
// @ts-ignore
const pointOfInterestAttachmentProvider = new PointOfInterestAttachmentProvider(process.env.REACT_APP_API_BASE_URL);

const thumbnailDimensions = "640x480";

export default function PointOfInterestDetail() {
	const params: any = useParams();
	const [pointOfInterest, setPointOfInterest] = useState<PointOfInterest>();
	const [pointOfInterestAttachments, setPointOfInterestAttachments] = useState<PointOfInterestAttachment[]>([]);
	const [showUploadAttachmentModal, setShowUploadAttachmentModal] = useState<boolean>(false);
	const [pointOfInterestAttachmentUuidPendingDeletion, setPointOfInterestAttachmentUuidPendingDeletion] = useState<string>();

	const loadAttachments = useCallback(function() {
		pointOfInterestAttachmentProvider.getPointOfInterestAttachments(params.clusterUuid, params.serverUuid, params.pointOfInterestUuid).then(function (_pointOfInterestAttachments) {
			setPointOfInterestAttachments(_pointOfInterestAttachments.sort(function(a: PointOfInterestAttachment, b: PointOfInterestAttachment) {
				return a.originalFileName.localeCompare(b.originalFileName);
			}));
		});
	}, [params.clusterUuid, params.serverUuid, params.pointOfInterestUuid]);

	useEffect(() => {
		pointOfInterestProvider.getPointOfInterest(params.clusterUuid, params.serverUuid, params.pointOfInterestUuid).then(function (_pointOfInterest) {
			setPointOfInterest(_pointOfInterest!);
		});

		loadAttachments();
	}, [params.clusterUuid, params.serverUuid, params.pointOfInterestUuid, loadAttachments]);

	return (
		<>
			<a href={"/cluster/"+params.clusterUuid+"/server/"+params.serverUuid}>Back to Server</a>

			<h1>Point of Interest Details</h1>

			<div className="row my-3">
				<div className="col-xl-4">
					<div className="card mb-3">
						<div className="card-header">Details</div>
						<div className="card-body">
							<p><b>Type:</b> {pointOfInterest?.type}</p>
							<p><b>Owner Name:</b> {pointOfInterest?.ownerName}</p>
							<p><b>Alliance Status:</b> {pointOfInterest?.allianceStatus}</p>
							<p><b>Wiped:</b> {pointOfInterest?.wiped ? 'Yes' : 'No'}</p>
							<p><b>Lat:</b> {pointOfInterest?.lat}</p>
							<p><b>Lng:</b> {pointOfInterest?.lng}</p>
							<p><b>Description:</b> {pointOfInterest?.description ? pointOfInterest?.description : <em>N/A</em>}</p>
						</div>
					</div>
				</div>
				<div className="col-xl-8">
					<div className="card mb-3">
						<div className="card-header">Attachments</div>
						<div className="card-body">
							<button className="btn btn-primary mb-3" onClick={() => setShowUploadAttachmentModal(true)}>
								<FontAwesomeIcon icon={faUpload} /> Upload
							</button>

							<div className="row">
								{pointOfInterestAttachments.map(function(pointOfInterestAttachment) {
									return (
										<div className="col-md-6 col-xl-4 text-center mb-3" key={pointOfInterestAttachment.uuid}>
											<a target="_blank" rel="noreferrer" href={process.env.REACT_APP_API_BASE_URL+"/upload/"+pointOfInterestAttachment.uuid}>
												<img className="mb-3 img-fluid w-100" src={process.env.REACT_APP_API_BASE_URL+"/upload/"+pointOfInterestAttachment.uuid+"/thumbnail/"+thumbnailDimensions} alt={pointOfInterestAttachment.originalFileName} />
											</a>

											<button className="btn btn-sm btn-danger d-block w-100" onClick={
												() => setPointOfInterestAttachmentUuidPendingDeletion(pointOfInterestAttachment.uuid)
											}>
												<FontAwesomeIcon icon={faTrashAlt} /> Delete
											</button>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>

			{showUploadAttachmentModal ? <UploadPointOfInterestAttachmentModal
				clusterUuid={params.clusterUuid}
				serverUuid={params.serverUuid}
				pointOfInterestUuid={params.pointOfInterestUuid}
				onClose={
					() => {
						setShowUploadAttachmentModal(false);
						loadAttachments();
					}
				}
			/> : <></>}

			{pointOfInterestAttachmentUuidPendingDeletion ? <ConfirmActionModal
				title={"Delete Point of Interest"}
				message={"Are you sure you want to delete this point of interest attachment?"}
				onCallback={(arg: boolean) => {
					if (arg) {
						pointOfInterestAttachmentProvider.deletePointOfInterestAttachment(params.clusterUuid, params.serverUuid, params.pointOfInterestUuid, pointOfInterestAttachmentUuidPendingDeletion).finally(function() {
							loadAttachments();
						});
					}
					setPointOfInterestAttachmentUuidPendingDeletion(undefined);
				}}
			/> : <></>}
		</>
	);
}