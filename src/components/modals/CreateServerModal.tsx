// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import {useEffect, useRef, useState} from "react";
import Server from "../../models/Server";
import {Button, Modal} from "react-bootstrap";
import getSupportedMaps from "../../utils/getSupportedMaps";

const supportedMaps = getSupportedMaps();

export default function CreateServerModal(props: {
	onCreatedServer: Function,
	onClose: Function,
	clusterUuid: string
}) {
	const [showModal, setShowModal] = useState(true);
	const [formServerName, setFormServerName] = useState<string>();
	const [formMapType, setFormMapType] = useState<string>(supportedMaps[0]);

	const formServerNameField = useRef<HTMLInputElement>(null);
	const createButton = useRef<HTMLButtonElement>(null);

	const handleClose = () => {
		setShowModal(false);
		props.onClose();
	}
	const handleSaveAndClose = () => {
		const server: Server = {
			clusterUuid: props.clusterUuid,
			serverName: formServerName!,
			mapType: formMapType!
		};
		console.log(server);
		props.onCreatedServer(server);
		handleClose();
	};

	function isFormValid(): boolean {
		return formMapType !== undefined && formMapType.length > 0 && formServerName !== undefined && formServerName.length > 0;
	}

	useEffect(() => {
		formServerNameField.current?.focus();
	}, []);

	useEffect(() => {
		if (createButton.current !== null) {
			createButton.current.disabled = !isFormValid();
		}
	});

	return (
		<Modal show={showModal} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create Server</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form id="createClusterModalForm">
					<div className="mb-3">
						<label htmlFor="serverName" className="form-label">Server Name</label>
						<input ref={formServerNameField} required id="serverName" className={["form-control", formServerName && formServerName.length > 0 ? "is-valid" : "is-invalid"].join(" ")} type="text" onChange={
							(e) => setFormServerName(e.target.value)
						} />
					</div>

					<div className="mb-3">
						<label htmlFor="mapType" className="form-label">Map Type</label>
						<select value={formMapType} required id="mapType" className="form-select" onChange={
							(e) => setFormMapType(e.target.value)
						}>
							{supportedMaps.map((map) => {
								return <option key={map} value={map}>{map}</option>
							})}
						</select>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
				<Button variant="primary" onClick={handleSaveAndClose} ref={createButton}>
					Create
				</Button>
			</Modal.Footer>
		</Modal>
	);
}