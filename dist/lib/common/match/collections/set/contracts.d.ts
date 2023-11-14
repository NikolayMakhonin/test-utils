export declare type MatchSetOptions = {
    /** (false = A ⊇ E, true = no conditions) actual may not contain expected */
    mayNotContains?: boolean;
    /** (false = A ⊆ E, true = no conditions) actual may not be contained in expected */
    mayNotContained?: boolean;
};
