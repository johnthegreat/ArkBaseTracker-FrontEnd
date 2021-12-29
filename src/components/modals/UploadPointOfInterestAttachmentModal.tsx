// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import {useRef, useState} from "react";
import {Button, Modal} from "react-bootstrap";
import PointOfInterestAttachmentProvider from "../../apis/providers/PointOfInterestAttachmentProvider";

// @ts-ignore
const pointOfInterestAttachmentProvider = new PointOfInterestAttachmentProvider(process.env.REACT_APP_API_BASE_URL);

export default function UploadPointOfInterestAttachmentModal(props: {
	clusterUuid: string,
	serverUuid: string,
	pointOfInterestUuid: string,
	onClose: Function
}) {
	const [showModal, setShowModal] = useState<boolean>(true);
	const fileInput = useRef<HTMLInputElement>(null);

	function handleClose(arg: boolean) {
		if (arg && fileInput.current && fileInput.current!.files && fileInput.current!.files!.length > 0) {
			const file = fileInput.current!.files![0];
			pointOfInterestAttachmentProvider.createPointOfInterestAttachment(props.clusterUuid, props.serverUuid, props.pointOfInterestUuid, file).finally(function() {
				props.onClose();
				setShowModal(false);
			});
		} else {
			props.onClose();
			setShowModal(false);
		}
	}

	return (
		<Modal show={showModal} onHide={() => handleClose(false)}>
			<Modal.Header closeButton>
				<Modal.Title>Upload Attachment</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<input type="file" ref={fileInput} />
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => handleClose(false)}>
					Cancel
				</Button>
				<Button variant="primary" onClick={() => handleClose(true)}>
					Upload
				</Button>
			</Modal.Footer>
		</Modal>
	);
}