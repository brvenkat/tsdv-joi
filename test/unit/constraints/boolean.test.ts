import "../metadataShim";
import {registerJoi, WORKING_SCHEMA_KEY} from "../../../src/core";
import * as Joi from "joi";
import {testConstraint} from "../testUtil";
import {BooleanSchema, Truthy, Falsy, Insensitive} from "../../../src/constraints/boolean";


registerJoi(Joi);

describe("Boolean constraints", function () {
    describe("BooleanSchema", function () {
        class MyClass {
            @BooleanSchema()
            myProperty! : boolean;
        }

        it("should annotate the class property", function () {
            const metadata = Reflect.getMetadata(WORKING_SCHEMA_KEY, MyClass.prototype);
            const expected = {
                myProperty: Joi.boolean()
            };
            expect(metadata).toEqual(expected);
        });

        /**
         * TODO: test compilation failures
         */
        xit("should error when applied to a non-boolean property", function () {
            // expect(function () {
            //     class MyBadClass {
            //         @BooleanSchema()
            //         myBadProperty! : number;
            //
            //         @BooleanSchema()
            //         myOtherBadProperty! : string;
            //     }
            // }).toThrow(ConstraintDefinitionError);
        });
    });

    describe("Truthy", function () {
        testConstraint<any>(() => {
                class MyClass {
                    @Truthy(1, 5)
                    myProperty : boolean;

                    constructor(myProperty: boolean) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            [1, 5],
            [0, 2, "1", "y", "Y"]
        );
        testConstraint<any>(() => {
                class MyClass {
                    @Truthy("1", "y")
                    myProperty : boolean;

                    constructor(myProperty: boolean) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["1", "y", "Y"],
            [0, 1, 2, 5, "0", "yes"]
        );
    });

    describe("Falsy", function () {
        testConstraint<any>(() => {
                class MyClass {
                    @Falsy(0, 5)
                    myProperty : boolean;

                    constructor(myProperty: boolean) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            [0, 5],
            ["0", 1, "n", "N"]
        );
        testConstraint<any>(() => {
                class MyClass {
                    @Falsy("0", "n")
                    myProperty : boolean;

                    constructor(myProperty: boolean) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["0", "n", "N"],
            [0, 1, 2, 5, "yes", "no"]
        );
    });

    describe("Insensitive", function () {
        testConstraint<any>(() => {
                class MyClass {
                    @Insensitive(false)
                    @Falsy("n")
                    @Truthy("y")
                    myProperty : boolean;

                    constructor(myProperty: boolean) {
                        this.myProperty = myProperty;
                    }
                }
                return MyClass;
            },
            ["y", "n"],
            ["Y", "N"]
        );
    });
});
