$.fn.onClassChange = function(cb) {
    return $(this).each((_, el) => {
        new MutationObserver(mutations => {
            mutations.forEach(mutation => cb && cb(mutation.target, mutation.target.className));
        }).observe(el, {
            attributes: true,
            attributeFilter: ['class', 'disabled', 'style']
        });
    });
}

$.fn.currency = function(options = {}) {
    var fields = this

    $.each(fields, function (index, item) {
        var input = $(item)
        let inputVal = input.val()
        let inputId = `${input.attr('id') && input.attr('id').length ? input.attr('id') + '-' : 'field-'}${Math.floor(100000 + Math.random() * 900000)}`
        let maskInputId = `currency-input_${inputId}`

        initializeInput(inputVal)

        input.onClassChange(function (e) {
            initializeInput(input.val())
        })

        function changeParentValue(value = 0, event = 'change') {
            input.val(value !== '0' ? value : '').trigger(event)
        }

        function initializeInput(inputVal = 0) {
            let maskInput = `
                <input
                    id="${maskInputId}"
                    class="currency-input-mask ${input.attr('class')}"
                    value="${currencyFormat(inputVal)}"
                    ${input.is(':disabled') ? 'disabled' : ''}
                >
            `

            input.attr('data-currency-input-id', maskInputId)
            input.css({'opacity': '0', 'position': 'absolute', 'z-index': '-10', 'left': '0'})

            if (input.siblings('.currency-input-mask').length) input.parent().find('.currency-input-mask').remove()

            input.parent().append(maskInput)

            $(`#${maskInputId}`).focus(function (e) {
                let maskInputVal = currencyFormat($(this).val(), true)
                $(this)
                    .val(new Intl.NumberFormat("id-ID", { trailingZeroDisplay: 'stripIfInteger' })
                        .format(currencyFormat(maskInputVal, true)))
            })

            $(`#${maskInputId}`).keyup(function (e) {
                let maskInputVal = $(this).val()
                $(this)
                    .val(new Intl.NumberFormat("id-ID", { trailingZeroDisplay: 'stripIfInteger' })
                        .format(currencyFormat(maskInputVal, true)))

                changeParentValue(currencyFormat(maskInputVal, true), 'keyup')
            })

            $(`#${maskInputId}`).on('blur', input, function (e) {
                let maskInputVal = currencyFormat($(this).val(), true)
                changeParentValue(maskInputVal)
                $(this).val(currencyFormat(maskInputVal))
            })

            $(`input[data-currency-input-id="${maskInputId}"]`).change(function () {
                $(`#${maskInputId}`).val(currencyFormat($(this).val()))
            })
        }
    })
}