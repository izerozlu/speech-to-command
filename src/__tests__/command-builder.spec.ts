import CommandBuilder from "../services/command-builder";

describe('Service: CommandBuilder', () => {

    it('should be defined', () => {
        // Setup
        const commandBuilder = new CommandBuilder({inputNames: ['name', 'surname']});

        // Assert
        expect(commandBuilder).toBeDefined();
    });

    describe('Method: processTranscript', () => {

        let commandBuilder: CommandBuilder;

        beforeEach(() => {
            commandBuilder = new CommandBuilder();
        });

        describe('should build a command structure', () => {

            test('when a connective is supplied without marker', () => {
                // Setup
                const transcript = 'fill with test message';

                // Execution
                const commandStructure = commandBuilder.processTranscript(transcript);

                // Assert
                expect(commandStructure).toBeDefined();
            });

            test('with verb, marker, connective and message', () => {
                // Setup
                const transcript = 'fill first with test message';

                // Execution
                const commandStructure = commandBuilder.processTranscript(transcript);

                // Assert
                expect(commandStructure.verb).toEqual('fill');
                expect(commandStructure.marker).toEqual('first');
                expect(commandStructure.connective).toEqual('with');
                expect(commandStructure.message).toEqual('test message');
            });

            test('with verb, marker and message', () => {
                // Setup
                const transcript = 'fill first test message';

                // Execution
                const commandStructure = commandBuilder.processTranscript(transcript);

                // Assert
                expect(commandStructure.verb).toEqual('fill');
                expect(commandStructure.marker).toEqual('first');
                expect(commandStructure.connective).toEqual(undefined);
                expect(commandStructure.message).toEqual('test message');
            });

            test('with verb and marker', () => {
                // Setup
                const transcript = 'focus first';

                // Execution
                const commandStructure = commandBuilder.processTranscript(transcript);

                // Assert
                expect(commandStructure.verb).toEqual('focus');
                expect(commandStructure.marker).toEqual('first');
                expect(commandStructure.connective).toEqual(undefined);
                expect(commandStructure.message).toEqual(undefined);
            });

            test('with verb', () => {
                // Setup
                const transcript = 'focus';

                // Execution
                const commandStructure = commandBuilder.processTranscript(transcript);

                // Assert
                expect(commandStructure.verb).toEqual('focus');
                expect(commandStructure.marker).toEqual('current');
                expect(commandStructure.connective).toEqual(undefined);
                expect(commandStructure.message).toEqual(undefined);
            });

            test('use the "current" marker as the default', () => {
                // Setup
                const transcript = 'fill in with test';

                // Execution
                const commandStructure = commandBuilder.processTranscript(transcript);

                // Assert
                expect(commandStructure.verb).toEqual('fill');
                expect(commandStructure.marker).toEqual('current');
                expect(commandStructure.connective).toEqual('with');
                expect(commandStructure.message).toEqual('test');
            });

        });

        describe('should not build a command structure', () => {

            test('when a verb is not applied', () => {
                // Setup
                const transcript = 'test message';

                // Execution
                const commandStructure = commandBuilder.processTranscript(transcript);

                // Assert
                expect(commandStructure).not.toBeDefined();
            });

            test('when a marker is supplied without verb', () => {
                // Setup
                const transcript = 'first';

                // Execution
                const commandStructure = commandBuilder.processTranscript(transcript);

                // Assert
                expect(commandStructure).not.toBeDefined();
            });

            test('when a connective is supplied without verb', () => {
                // Setup
                const transcript = 'first with message';

                // Execution
                const commandStructure = commandBuilder.processTranscript(transcript);

                // Assert
                expect(commandStructure).not.toBeDefined();
            });

            test('when a connective is supplied without message', () => {
                // Setup
                const transcript = 'fill first with';

                // Execution
                const commandStructure = commandBuilder.processTranscript(transcript);

                // Assert
                expect(commandStructure).not.toBeDefined();
            });

        });

        describe('should detect verbs', () => {

            describe('verb: fill', () => {

                test('case: fill', () => {
                    // Setup
                    const transcript = 'fill';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.verb).toEqual('fill');
                });

                test('case: filling', () => {
                    // Setup
                    const transcript = 'filling';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.verb).toEqual('fill');
                });

                test('case: villain', () => {
                    // Setup
                    const transcript = 'villain';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.verb).toEqual('fill');
                });

                test('case: fill-in', () => {
                    const transcript = 'fill-in';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.verb).toEqual('fill');
                });

                test('case: fill in', () => {
                    const transcript = 'fill in';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.verb).toEqual('fill');
                });

                test('case: fell in', () => {
                    const transcript = 'fell in';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.verb).toEqual('fill');
                });

                test('case: phil', () => {
                    const transcript = 'phil';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.verb).toEqual('fill');
                });

                test('case: phil in', () => {
                    const transcript = 'phil in';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.verb).toEqual('fill');
                });

                test('case: phil\'s', () => {
                    const transcript = 'phil\'s';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.verb).toEqual('fill');
                });

                test('case: phil\'s in', () => {
                    const transcript = 'phil\'s in';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.verb).toEqual('fill');
                });

                test('case: chilling', () => {
                    const transcript = 'chilling';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.verb).toEqual('fill');
                });

            });

            describe('verb: focus', () => {

                test('case: focus', () => {
                    const transcript = 'focus';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.verb).toEqual('focus');
                });

                test('case: Cuckoo\'s', () => {
                    const transcript = 'Cuckoo\'s';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.verb).toEqual('focus');
                });

                test('case: Koko\'s', () => {
                    const transcript = 'Koko\'s';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.verb).toEqual('focus');
                });

            });

        });

        describe('should detect markers', () => {

            describe('marker: current', () => {

                test('case: current', () => {
                    // Setup
                    const transcript = 'focus current';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('current');
                });

            });

            describe('marker: first', () => {

                test('case: first', () => {
                    // Setup
                    const transcript = 'focus first';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('first');
                });

                test('case: 1', () => {
                    // Setup
                    const transcript = 'focus 1';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('first');
                });

                test('case: I', () => {
                    // Setup
                    const transcript = 'focus I';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('first');
                });

                test('case: 1st', () => {
                    // Setup
                    const transcript = 'focus 1st';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('first');
                });

            });

            describe('marker: second', () => {

                test('case: second', () => {
                    // Setup
                    const transcript = 'focus second';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('second');
                });

                test('case: seconds', () => {
                    // Setup
                    const transcript = 'focus seconds';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('second');
                });

                test('case: 2', () => {
                    // Setup
                    const transcript = 'focus 2';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('second');
                });

                test('case: II', () => {
                    // Setup
                    const transcript = 'focus II';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('second');
                });

                test('case: 2nd', () => {
                    // Setup
                    const transcript = 'focus 2nd';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('second');
                });

            });

            describe('marker: third', () => {

                test('case: third', () => {
                    // Setup
                    const transcript = 'focus third';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('third');
                });

                test('case: 3', () => {
                    // Setup
                    const transcript = 'focus 3';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('third');
                });

                test('case: III', () => {
                    // Setup
                    const transcript = 'focus III';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('third');
                });

                test('case: 3rd', () => {
                    // Setup
                    const transcript = 'focus 3rd';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('third');
                });

            });

            describe('marker: fourth', () => {

                test('case: fourth', () => {
                    // Setup
                    const transcript = 'focus fourth';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('fourth');
                });

                test('case: 4', () => {
                    // Setup
                    const transcript = 'focus 4';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('fourth');
                });

                test('case: IV', () => {
                    // Setup
                    const transcript = 'focus IV';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('fourth');
                });

                test('case: 4th', () => {
                    // Setup
                    const transcript = 'focus 4th';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('fourth');
                });

                test('case: farts', () => {
                    // Setup
                    const transcript = 'focus farts';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('fourth');
                });

            });

            describe('marker: fifth', () => {

                test('case: fifth', () => {
                    // Setup
                    const transcript = 'focus fifth';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('fifth');
                });

                test('case: 5', () => {
                    // Setup
                    const transcript = 'focus 5';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('fifth');
                });

                test('case: V', () => {
                    // Setup
                    const transcript = 'focus V';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('fifth');
                });

                test('case: 5th', () => {
                    // Setup
                    const transcript = 'focus 5th';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('fifth');
                });

                test('case: fit', () => {
                    // Setup
                    const transcript = 'focus fit';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('fifth');
                });

            });

            describe('marker: next', () => {

                test('case: next', () => {
                    // Setup
                    const transcript = 'focus next';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('next');
                });

            });

            describe('marker: previous', () => {

                test('case: previous', () => {
                    // Setup
                    const transcript = 'focus previous';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('previous');
                });

                test('case: prev', () => {
                    // Setup
                    const transcript = 'focus prev';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('previous');
                });

                test('case: prev', () => {
                    // Setup
                    const transcript = 'focus travis';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('previous');
                });

                test('case: prev', () => {
                    // Setup
                    const transcript = 'focus reviews';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('previous');
                });

                test('case: prev', () => {
                    // Setup
                    const transcript = 'focus previews';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('previous');
                });

                test('case: prev', () => {
                    // Setup
                    const transcript = 'focus preview';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('previous');
                });


            });

        });

        describe('should detect connectives', () => {

            describe('connective: with', () => {

                test('case: with', () => {
                    // Setup
                    const transcript = 'fill first with test message';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.connective).toEqual('with');
                });

                test('case: which', () => {
                    // Setup
                    const transcript = 'fill first which test message';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.connective).toEqual('with');
                });

            });

        });

        describe('should detect messages', () => {

            describe('case: simple messages', () => {

                test('message: test message', () => {
                    // Setup
                    const transcript = 'fill first with test message';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.message).toEqual('test message');
                });

                test('message: some what longer message', () => {
                    // Setup
                    const transcript = 'fill first with some what longer message';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.message).toEqual('some what longer message');
                });

                test('message: -no message-', () => {
                    // Setup
                    const transcript = 'fill first';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.message).toEqual(undefined);

                });

            });

            describe('case: messages with verb words in it', () => {

                test('case: fill message', () => {
                    // Setup
                    const transcript = 'fill first with fill message';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.message).toEqual('fill message');
                });

                test('case: focus message', () => {
                    // Setup
                    const transcript = 'fill first with focus message';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.message).toEqual('focus message');
                });

            });

            describe('case: messages with marker words in it', () => {

                test('case: first message', () => {
                    // Setup
                    const transcript = 'fill first with first message';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.message).toEqual('first message');
                });

                test('case: next message', () => {
                    // Setup
                    const transcript = 'fill first with next message';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.message).toEqual('next message');
                });

                test('case: current message', () => {
                    // Setup
                    const transcript = 'fill current with current message';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.marker).toEqual('current');
                    expect(commandStructure.message).toEqual('current message');
                });

            });

            describe('case: messages with input names in it', () => {

                beforeEach(() => {
                    commandBuilder = new CommandBuilder({inputNames: ['name', 'surname']});
                });

                test('case: name the first paint', () => {
                    // Setup
                    const transcript = 'fill first with name the first paint';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.message).toEqual('name the first paint');
                });

                test('case: my surname is apple', () => {
                    // Setup
                    const transcript = 'fill first with my surname is apple';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.message).toEqual('my surname is apple');
                });

            });

            describe('case: messages with connective words in it', () => {

                test('case: with message', () => {
                    // Setup
                    const transcript = 'fill first with with message';

                    // Execution
                    const commandStructure = commandBuilder.processTranscript(transcript);

                    // Assert
                    expect(commandStructure.message).toEqual('with message');
                });

            });

        });

        describe('should not detect words before connectives', () => {

            test('word: in', () => {
                // Setup
                const transcript = 'fill in first with some message';

                // Execution
                const commandStructure = commandBuilder.processTranscript(transcript);

                // Assert
                expect(commandStructure.verb).toEqual('fill');
                expect(commandStructure.connective).toEqual('with');
                expect(commandStructure.marker).toEqual('first');
                expect(commandStructure.message).toEqual('some message');
            });

            test('words: test words about some explanation', () => {
                // Setup
                const transcript = 'fill test words about some explanation next with some message';

                // Execution
                const commandStructure = commandBuilder.processTranscript(transcript);

                // Assert
                expect(commandStructure.verb).toEqual('fill');
                expect(commandStructure.connective).toEqual('with');
                expect(commandStructure.marker).toEqual('next');
                expect(commandStructure.message).toEqual('some message');
            });

        });

    });

});
