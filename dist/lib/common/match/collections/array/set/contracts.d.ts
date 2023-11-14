export declare type MatchArraySetOptions = {
    /** (false = A ⊇ E, true = no conditions) actual may not contain expected */
    mayNotContains?: boolean;
    /** (false = A ⊆ E, true = no conditions) actual may not be contained in expected */
    mayNotContained?: boolean;
    actualRepeats?: boolean;
    expectedRepeats?: boolean;
};
