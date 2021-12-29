// Copyright (c) 2021 John Nahlen
// SPDX-License-Identifier: AGPL-3.0-or-later

export default function getDefaultLocale(): string {
	return (process.env.REACT_APP_DEFAULT_LOCALE as string) ?? "";
}