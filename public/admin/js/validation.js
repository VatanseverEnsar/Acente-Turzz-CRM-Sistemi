// Class definition
var FormValidations = function () {
    var contactValidate = function () {
        FormValidation.formValidation(
            document.getElementById('kt_form_2'),
            {
                fields: {
                    billing_card_name: {
                        validators: {
                            notEmpty: {
                                message: 'Card Holder Name is required'
                            }
                        }
                    },
                },

                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    // Validate fields when clicking the Submit button
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    // Submit the form when all fields are valid
                    defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
                    // Bootstrap Framework Integration
                    bootstrap: new FormValidation.plugins.Bootstrap({
                        eleInvalidClass: '',
                        eleValidClass: '',
                    })
                }
            }
        );
    }

    return {
        // public functions
        init: function() {
            contactValidate();
        }
    };
}();

jQuery(document).ready(function() {
    FormValidations.init();
});
