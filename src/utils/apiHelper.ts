// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

export default function helper<T>(promise: Promise<Response>) {
	return promise.then(function(response) {
		if (response.status === 204) {
			return null;
		} else if (response.body) {
			return response.json();
		}
	}).then(function(json) {
		if (!json) {
			return json;
		}
		return json as T;
	});
};