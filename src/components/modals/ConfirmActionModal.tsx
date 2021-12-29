// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

import {Button, Modal} from "react-bootstrap";
import {useState} from "react";

export default function ConfirmActionModal(props: {
	title: string,
	message: string
	closeLabel?: string,
	confirmLabel?: string,
	onCallback: Function
}) {
	const [showModal, setShowModal] = useState<boolean>(true);

	function handleClose(arg: boolean) {
		props.onCallback(arg);
		setShowModal(false);
	}

	return (
		<Modal show={showModal} onHide={() => handleClose(false)}>
			<Modal.Header closeButton>
				<Modal.Title>{props.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{props.message}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => handleClose(false)}>
					{props.closeLabel || "Close"}
				</Button>
				<Button variant="danger" onClick={() => handleClose(true)}>
					{props.confirmLabel || "Confirm"}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}