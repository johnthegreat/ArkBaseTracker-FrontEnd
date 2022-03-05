// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import {Button, Modal} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import PointOfInterest from "../../models/PointOfInterest";
import PointOfInterestType from "../../models/enums/PointOfInterestType";

const allianceStatuses = ['Owned', 'Allied', 'Friendly', 'Neutral', 'Hostile', 'Enemy'].sort();
const pointOfInterestTypes = ['Point of Interest', 'Base'];

export default function CreatePointOfInterestModal(props: {
	serverUuid: string,
	onClose: Function,
	title?: string,
	saveButtonLabel?: string,
	existingPointOfInterest?: PointOfInterest
}) {
	const [showCreateModal, setShowCreateModal] = useState(true);
	const [formError, setFormError] = useState<string>('');

	const [form_Type, setForm_Type] = useState('Point of Interest');
	const [form_OwnerName, setForm_OwnerName] = useState('');
	const [form_AllianceStatus, setForm_AllianceStatus] = useState('Neutral');
	const [form_Wiped, setForm_Wiped] = useState<boolean>(false);
	const [form_Lat, setForm_Lat] = useState<number>();
	const [form_Lng, setForm_Lng] = useState<number>();
	const [form_Description, setForm_Description] = useState<string>('');

	const formTypeField = useRef(null);
	const createButton = useRef(null);

	const handleClose = (pointOfInterest?: PointOfInterest) => {
		setShowCreateModal(false);
		props.onClose(pointOfInterest);
	}
	const handleSaveAndClose = () => {
		if (!isFormValid()) {
			setFormError('Please fix validation errors before continuing.');
			return;
		}

		setFormError('');

		const pointOfInterest: PointOfInterest = {
			serverUuid: props.serverUuid,
			type: form_Type === PointOfInterestType.BASE ? PointOfInterestType.BASE : PointOfInterestType.POINT_OF_INTEREST,
			ownerName: form_OwnerName,
			allianceStatus: form_AllianceStatus,
			lat: form_Lat!,
			lng: form_Lng!,
			wiped: form_Wiped,
			description: form_Description
		};
		handleClose(pointOfInterest);
	};

	const isFormValid = function() : boolean {
		return !isFieldInDefaultState(form_Lat) && isValidLatOrLng(form_Lat!) && !isFieldInDefaultState(form_Lng) && isValidLatOrLng(form_Lng!);
	}

	useEffect(() => {
		if (formTypeField.current !== null) {
			(formTypeField.current as HTMLSelectElement).focus();
		}

		if (props.existingPointOfInterest !== undefined) {
			setForm_Type(props.existingPointOfInterest.type);
			setForm_OwnerName(props.existingPointOfInterest.ownerName);
			setForm_AllianceStatus(props.existingPointOfInterest.allianceStatus);
			setForm_Lat(props.existingPointOfInterest.lat);
			setForm_Lng(props.existingPointOfInterest.lng);
			setForm_Wiped(props.existingPointOfInterest.wiped);
			setForm_Description(props.existingPointOfInterest.description || '');
		}
	}, [props.existingPointOfInterest]);

	/*useEffect(() => {
		if (createButton.current !== null) {
			(createButton.current as HTMLButtonElement).disabled = false;
		}
	});*/

	function isFieldInDefaultState(value: number|undefined) {
		return value === undefined || Number.isNaN(value);
	}

	function isValidLatOrLng(value: number) {
		return value >= 0 && value <= 100;
	}

	return (
		<Modal show={showCreateModal} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>{props.title || 'Create Point of Interest'}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{formError ? <div className="alert alert-danger">{formError}</div> : <></>}
				<form id="createPointOfInterestModalForm needs-validation">
					<div className="mb-3">
						<label htmlFor="type" className="form-label">Type</label>
						<select required ref={formTypeField} value={form_Type} id="type" className="form-control is-valid" onChange={
							e => setForm_Type((e.target as HTMLSelectElement).value)
						}>
							{pointOfInterestTypes.map((type) => {
								return <option key={type} value={type}>{type}</option>
							})}
						</select>
					</div>

					{form_Type === 'Base' ? <div className="mb-3">
						<label htmlFor="name" className="form-label">Owner Name</label>
						<input value={form_OwnerName} type="text"
							   className={["form-control", form_OwnerName.length > 0 && form_OwnerName.length <= 45 ? "is-valid" : ""].join(' ')}
							   id="name" maxLength={45} onInput={
							e => setForm_OwnerName((e.target as HTMLInputElement).value)
						}/>
					</div> : <></>}

					{form_Type === 'Base' ? <div className="mb-3">
						<label htmlFor="allianceStatus" className="form-label">Alliance Status</label>
						<select value={form_AllianceStatus} id="allianceStatus" className="form-control is-valid" onChange={
							e => setForm_AllianceStatus((e.target as HTMLSelectElement).value)
						}>
							{allianceStatuses.map((allianceStatus) => {
								return <option key={allianceStatus} value={allianceStatus}>{allianceStatus}</option>
							})}
						</select>
					</div> : <></>}

					{form_Type === 'Base' ? <div className="mb-3">
						<label htmlFor="wiped" className="form-label">Wiped</label>
						<div className="form-check form-switch">
							<input className="form-check-input" type="checkbox" role="switch" id="wiped" onChange={
									e => setForm_Wiped((e.target as HTMLInputElement).checked)
							} />
						</div>
					</div> : <></>}

					<div className="mb-3">
						<label htmlFor="lat" className="form-label">Latitude</label>
						<input required type="number" value={form_Lat} step={"0.1"}
							   className={["form-control", !isFieldInDefaultState(form_Lat) && isValidLatOrLng(form_Lat!) ? "is-valid" : "is-invalid"].join(' ')}
							   id="lat" onInput={
							e => setForm_Lat(parseFloat((e.target as HTMLInputElement).value))
						} />
						{!isFieldInDefaultState(form_Lat) && !isValidLatOrLng(form_Lat!) ? <div className="invalid-feedback">Value must be between 0 and 100.</div> : <></>}
					</div>

					<div className="mb-3">
						<label htmlFor="lng" className="form-label">Longitude</label>
						<input required type="number" value={form_Lng} step={"0.1"}
							   className={["form-control", !isFieldInDefaultState(form_Lng) && isValidLatOrLng(form_Lng!) ? "is-valid" : "is-invalid"].join(' ')}
							   id="lng" onInput={
							e => setForm_Lng(parseFloat((e.target as HTMLInputElement).value))
						} />
						{!isFieldInDefaultState(form_Lng) && !isValidLatOrLng(form_Lng!) ? <div className="invalid-feedback">Value must be between 0 and 100.</div> : <></>}
					</div>

					<div className="mb-3">
						<label htmlFor="description" className="form-label">Description</label>
						<textarea className="form-control" value={form_Description} id="description" onInput={
							e => setForm_Description((e.target as HTMLTextAreaElement).value)
						} />
						<div className="form-text">Optional</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => handleClose(undefined)}>
					Close
				</Button>
				<Button variant="primary" onClick={() => handleSaveAndClose()} ref={createButton} disabled={!isFormValid()}>
					{props.saveButtonLabel || 'Create'}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}