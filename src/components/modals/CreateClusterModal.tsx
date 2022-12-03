// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import {Button, Modal} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import Cluster from "../../models/Cluster";
import getClusterType from "../../utils/getClusterType";
import ClusterType from "../../models/enums/ClusterType";

export default function CreateClusterModal(props: {
	clusterTypes: ClusterType[],
	onClose: Function
}) {
	const [showCreateModal, setShowCreateModal] = useState(true);
	const [createModalForm_Name, setCreateModalForm_Name] = useState('');
	const [createModalForm_Type, setCreateModalForm_Type] = useState('PVE');
	const createModalFormNameField = useRef(null);

	const handleClose = (cluster?: Cluster) => {
		setShowCreateModal(false);
		props.onClose(cluster);
	};

	const handleSaveAndClose = () => {
		if (!isValidClusterName(createModalForm_Name)) {
			return false;
		}

		const clusterType = getClusterType(createModalForm_Type);
		if (clusterType !== null) {
			const cluster: Cluster = {
				name: createModalForm_Name,
				type: clusterType
			};
			handleClose(cluster);
		} else {
			handleClose(undefined);
		}
	};

	useEffect(() => {
		if (createModalFormNameField.current !== null) {
			(createModalFormNameField.current as HTMLInputElement).focus();
		}
	}, []);

	function isValidClusterName(name: string) {
		return name.length > 0;
	}

	return (
		<Modal show={showCreateModal} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Create Cluster</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form id="createClusterModalForm needs-validation">
					<div className="mb-3">
						<label htmlFor="name" className="form-label">Name</label>
						<input required ref={createModalFormNameField} value={createModalForm_Name} type="text"
							   className={["form-control", isValidClusterName(createModalForm_Name) ? "is-valid" : "is-invalid"].join(" ")} id="name" onInput={
							e => setCreateModalForm_Name((e.target as HTMLInputElement).value)
						}/>
						{!isValidClusterName(createModalForm_Name) ? <div className="invalid-feedback">Name cannot be empty.</div> : <></>}
					</div>

					<div className="mb-3">
						<label htmlFor="type" className="form-label">Type</label>
						<select required value={createModalForm_Type} id="type" className="form-select" onChange={
							e => setCreateModalForm_Type((e.target as HTMLSelectElement).value)
						}>
							{props.clusterTypes.map((clusterType: ClusterType) => {
								return <option key={clusterType} value={clusterType}>{clusterType}</option>
							})}
						</select>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => handleClose(undefined)}>
					Close
				</Button>
				<Button variant="primary" onClick={() => handleSaveAndClose()} disabled={!isValidClusterName(createModalForm_Name)}>
					Create
				</Button>
			</Modal.Footer>
		</Modal>
	);
}