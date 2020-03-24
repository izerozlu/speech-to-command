// @ts-ignore
import {StereoAudioRecorder} from 'recordrtc';
import CommandBuilder from "./command-builder";
import {ERROR_MESSAGES} from "../constants/error-messages.constant";
import {Requester} from "./requester";

export namespace GoogleSpeechToText {
    export interface RecognitionAlternative {
        transcript: string;
        confidence: number;
    }

    export interface Recognition {
        alternatives: RecognitionAlternative[];
    }

    export interface RecordingStopResult {
        results: Recognition[];
        url: string;
    }
}

type Processor = (...params) => void ;

interface InputProcessors {
    [inputName: string]: Processor;
}

interface DefaultProcessors {
    first: Processor;
    second: Processor;
    third: Processor;
    fourth: Processor;
    fifth: Processor;
    next: Processor;
    previous: Processor;
}

type FocusProcessor = DefaultProcessors & InputProcessors;
type FillProcessor = DefaultProcessors & InputProcessors;

type MarkerProcessor = 'first' | 'second' | 'third' | 'fourth' | 'fifth' | 'next' | 'previous';
type VerbProcessor = FocusProcessor | FillProcessor | Processor;

export interface CommandProcessor {
    focus: Partial<FocusProcessor> & Partial<InputProcessors>;
    fill?: Partial<FillProcessor> & Partial<InputProcessors>;
}

interface RecorderOptions {
    apiKey: string;
    commandProcessor: CommandProcessor;
    inputNames?: string[];
}

export class Recorder {
    public isRecording: boolean;
    private stream: MediaStream;
    private recorder: StereoAudioRecorder;
    private commandProcessor: CommandProcessor;
    private googleApiKey: string;
    private commandBuilder: CommandBuilder;

    constructor({apiKey, commandProcessor, inputNames}: RecorderOptions) {
        if (apiKey) {
            this.googleApiKey = apiKey;
        } else {
            throw new Error(ERROR_MESSAGES.ABSENT_GOOGLE_API_KEY);
        }
        if (commandProcessor) {
            this.commandProcessor = commandProcessor;
        } else {
            throw new Error(ERROR_MESSAGES.ABSENT_COMMAND_PROCESSOR);
        }
        this.commandBuilder = new CommandBuilder({inputNames});
    }

    public async record() {
        this.stream = await navigator.mediaDevices.getUserMedia({audio: true});
        this.recorder = new StereoAudioRecorder(this.stream, {
            sampleRate: 44100,
            numberOfAudioChannels: 1
        });
        this.isRecording = true;
        this.recorder.record();
    }

    public async stop(): Promise<GoogleSpeechToText.RecordingStopResult | Error> {
        return new Promise((resolve) => {
            this.stream.getAudioTracks().forEach((audioTrack: MediaStreamTrack) => audioTrack.stop());
            this.recorder.stop(async (audioBlob: Blob) => {
                this.isRecording = false;
                const base64Url = await this.convertUrlToBase64(audioBlob);
                if (base64Url instanceof Error) {
                    resolve(base64Url);
                } else {
                    const audioUrlBase64: string = base64Url.split(',')[1];
                    const recognitionResult = await this.recognizeAudio(audioUrlBase64);
                    if (recognitionResult instanceof Error) {
                        resolve(recognitionResult);
                    } else {
                        resolve({results: recognitionResult, url: base64Url});
                    }
                }
            });
        });
    }

    private convertUrlToBase64(blob: Blob): Promise<string | Error> {
        return new Promise((resolve) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(blob);
            // @ts-ignore
            fileReader.onload = (event: { target: { result: string } }) => {
                if (event && event.target) {
                    resolve((event.target.result as string));
                } else {
                    resolve(new Error(ERROR_MESSAGES.AUDIO_URL_READ_FAILED));
                }
            };
        });
    }

    private async recognizeAudio(audioUrlBase64: string): Promise<GoogleSpeechToText.Recognition[] | Error> {
        const url = 'https://speech.googleapis.com/v1/speech:recognize?key=' + this.googleApiKey;
        const body = {
            audio: {
                content: audioUrlBase64
            },
            config: {
                encoding: 'LINEAR16',
                sampleRateHertz: 44100,
                languageCode: 'en-Us',
                model: 'command_and_search',
                metadata: {
                    interactionType: 'VOICE_COMMAND'
                },
            }
        };
        const result = await Requester.post(url, body);
        if (result.results && Object.keys(result.results).length) {
            this.processRecordingResult(result.results);
            return result.results;
        } else {
            return new Error(ERROR_MESSAGES.EMPTY_RECOGNITION_RESULT);
        }
    }

    private processRecordingResult(results: GoogleSpeechToText.Recognition[]) {
        const result = results[0];
        const alternatives = result.alternatives.reduce(
            (gatheredAlternatives: string[], recognitionAlternative: GoogleSpeechToText.RecognitionAlternative) => {
                return [...gatheredAlternatives, recognitionAlternative.transcript];
            }, []);
        console.info('Alternatives', alternatives);
        const recognitionAlternatives = result.alternatives;
        if (recognitionAlternatives.length === 1) {
            const commandStructure = this.commandBuilder.processTranscript(recognitionAlternatives[0].transcript);
            if (commandStructure) {
                const {verb, marker, connective, message} = commandStructure;
                const verbProcessor: VerbProcessor = this.commandProcessor[verb];
                if (marker && message) {
                    verbProcessor[marker](message);
                } else if (marker) {
                    verbProcessor[marker](message);
                } else {
                    (verbProcessor as Processor)(message);
                }
            } else {
                throw new Error(ERROR_MESSAGES.INVALID_COMMAND_STRUCTURE);
            }
        }
    }

    public processCustomAlternatives(alternative: string) {
        const commandStructure = this.commandBuilder.processTranscript(alternative);
        if (commandStructure) {
            const {verb, marker, connective, message} = commandStructure;
            const verbProcessor: VerbProcessor = this.commandProcessor[verb];
            if (marker && message) {
                verbProcessor[marker](message);
            } else if (marker) {
                verbProcessor[marker](message);
            } else {
                (verbProcessor as Processor)(message);
            }
        }
    }

}
