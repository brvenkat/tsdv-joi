import "./testUtil";
import {NumberSchema, Min} from "../../src/constraints/number";
import {Joi, ValidationSchemaNotFound} from "../../src/core";
import {Optional} from "../../src/constraints/any";
import {Keys, ObjectSchema} from "../../src/constraints/object";

describe(`Gotchas`, function () {
    describe(`object types`, function () {
        it(`an inline or anonymous interface must be explicitly annotated with ObjectSchema()`, function () {
            expect(() => {
                class ClassToValidate {
                    @Keys({
                        nestedProperty: Joi.number()
                    })
                    public myProperty!: {
                        nestedProperty: number;
                    };
                }
            }).toThrow(new ValidationSchemaNotFound('myProperty'));

            class ClassToValidate2 {
                @Keys({
                    nestedProperty: Joi.number()
                })
                @ObjectSchema()
                public myProperty! : {
                    nestedProperty : number;
                };
            }

            const instance = new ClassToValidate2();
            instance.myProperty = {
                nestedProperty: 123
            };
            expect(instance).toBeValid();
        });
    });

    describe(`union types`, function () {
        it('an optional property will pass', function () {
            class ClassToValidate {
                @Min(10)
                @Optional()
                @NumberSchema()
                public myProperty? : number;
            }

            const instance = new ClassToValidate();
            expect(instance).toBeValid();
        });

        it('a union with undefined, but without an explicit schema annotation, will fail', function () {
            expect(() => {
                class ClassToValidate {
                    @Min(10)
                    @Optional()
                    public myProperty: number | undefined;
                }
            }).toThrow(new ValidationSchemaNotFound('myProperty'));
        });

        it('a union with undefined and an explicit schema annotation will pass', function () {
            class ClassToValidate {
                @Min(10)
                @Optional()
                @NumberSchema()
                public myProperty : number | undefined;
            }

            const instance = new ClassToValidate();
            expect(instance).toBeValid();
        });

        it('nullable number property without explicit schema annotation will fail', function () {
            expect(() => {
                class ClassToValidate {
                    @Min(10)
                    public myProperty! : number | null;
                }
            }).toThrow(new ValidationSchemaNotFound('myProperty'));
        });

        it('nullable number property with explicit schema annotation will pass', function () {
            class ClassToValidate {
                @Min(10)
                @NumberSchema()
                public myProperty! : number | null;
            }

            const instance = new ClassToValidate();
            instance.myProperty = 20;

            expect(instance).toBeValid();
        });
    });
});
