export enum ERROR_MESSAGES {
	INVALID_COMMAND_STRUCTURE = 'Processed result is not suitable for a command structure',
	ABSENT_GOOGLE_API_KEY = 'Recorder needs a Google Api Key for the Speech To Text recognition service.',
	ABSENT_COMMAND_PROCESSOR = 'Recorder needs a CommandProcessor to function.',
	EMPTY_RECOGNITION_RESULT = 'Recording\'s result is empty.',
	AUDIO_URL_READ_FAILED = 'Reading the audio\'s URL failed.'
}
