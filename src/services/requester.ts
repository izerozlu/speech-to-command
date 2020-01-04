export class Requester {
	public static async post(url: string, body: any) {
		const response: Response = await fetch(url, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(body)
		});

		if (response.ok) {
			return await response.json();
		} else {
			return new Error(`Status: ${response.status}, Message: ${response.statusText}`);
		}

	}
}
