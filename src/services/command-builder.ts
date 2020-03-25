export interface CommandStructure {
    verb: string;
    marker: string;
    connective: string;
    message: string;
}

interface CommandBuilderOptions {
    inputNames: string[];
}

class CommandBuilder {

    private verbCommandMap = {
        focus: ['focus', 'cuckoo\'s', 'koko\'s'],
        fill: ['fill', 'fill in', 'fell in', 'filling', 'fillings', 'fill-in', 'villain', 'phil', 'phil in', 'phil\'s', 'phil\'s in', 'chilling'],
        clear: ['clear']
    };
    private markerCommandMap = {
        current: ['current'],
        first: ['first', '1', 'i', '1st'],
        second: ['second', '2', 'ii', '2nd', 'seconds'],
        third: ['third', '3', 'iii', '3rd'],
        fourth: ['fourth', '4', 'iv', '4th', 'farts'],
        fifth: ['fifth', '5', 'v', '5th', 'fit'],
        next: ['next'],
        previous: ['previous', 'prev', 'travis', 'reviews', 'previews', 'preview']
    };
    private connectiveCommandMap = {
        with: ['with', 'which']
    };

    constructor(options?: CommandBuilderOptions) {
        if (options) {
            if (options.inputNames) {
                const inputNamesMap = options.inputNames.reduce(
                    (gatheredInputNamesMap: { [inputName: string]: string[] }, inputName: string) => {
                        return {...gatheredInputNamesMap, [inputName]: [inputName]};
                    }, {}
                );
                this.markerCommandMap = {...this.markerCommandMap, ...inputNamesMap};
            }
        }
    }

    public processTranscript(transcript: string): CommandStructure {
        const recognitionString = transcript.toLowerCase();
        const recognitionParts = recognitionString.split(' ');
        const commandStructure = {
            verb: undefined,
            marker: undefined,
            connective: undefined,
            message: ''
        };
        const detectedCommandTypes: string[] = [];
        recognitionParts.forEach((recognitionPart: string, recognitionPartIndex: number) => {
            const {verb, marker, connective} =
                this.detectCommand(recognitionPart, recognitionPartIndex, recognitionParts, detectedCommandTypes);
            if (verb) {
                commandStructure.verb = verb;
                detectedCommandTypes.push('verb');
            } else if (marker) {
                commandStructure.marker = marker;
                detectedCommandTypes.push('marker');
            } else if (connective) {
                commandStructure.connective = connective;
                detectedCommandTypes.push('connective');
            } else if (commandStructure.verb && (commandStructure.marker || commandStructure.connective)) {
                commandStructure.message += recognitionPart + ' ';
            }
        });
        if (!commandStructure.marker) {
            commandStructure.marker = 'current';
        }
        commandStructure.message = this.processMessage(commandStructure.message);
        const isCommandStructureValid = this.checkCommandStructure(commandStructure);
        console.info(commandStructure);
        return isCommandStructureValid ? commandStructure : undefined;
    }

    private detectCommand(
        recognitionPart: string,
        recognitionPartIndex: number,
        recognitionParts: string[],
        detectedCommandTypes: string[]
    ): { verb?: string, marker?: string, connective?: string } {
        const detectableCommandTypes = ['verb', 'marker', 'connective'].filter((commandType: string) =>
            !detectedCommandTypes.includes(commandType));
        return detectableCommandTypes.reduce(
            (gatheredCommands: { verb?: string, marker?: string, connective?: string }, commandType: 'verb' | 'marker' | 'connective') => {
                const keywordMap = this.decideCommandKeywordMap(commandType);
                let foundCommandKey = Object.keys(keywordMap).find((keyword: string) =>
                    keywordMap[keyword].includes(recognitionPart));
                if (!foundCommandKey && commandType === 'verb') {
                    foundCommandKey = Object.keys(keywordMap).find((keyword: string) =>
                        keywordMap[keyword].includes(recognitionPart + ' ' + recognitionParts[recognitionPartIndex + 1]));
                }
                return {...gatheredCommands, [commandType]: foundCommandKey};
            }, {verb: undefined, marker: undefined, connective: undefined}
        );
    }

    private decideCommandKeywordMap(commandType: 'verb' | 'marker' | 'connective') {
        let keywordMap;
        if (commandType === 'verb') {
            keywordMap = this.verbCommandMap;
        } else if (commandType === 'marker') {
            keywordMap = this.markerCommandMap;
        } else if (commandType === 'connective') {
            keywordMap = this.connectiveCommandMap;
        }
        return keywordMap;
    }

    private processMessage(message: string) {
        return message ? message.trim() : undefined;
    }

    private checkCommandStructure({verb, marker, connective, message}: CommandStructure) {
        if (message) {
            return verb;
        } else if (connective) {
            return verb && marker && message;
        } else if (marker) {
            return verb;
        } else {
            return verb;
        }
    }
}

export default CommandBuilder;
