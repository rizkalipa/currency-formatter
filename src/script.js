$.fn.currency = function(options = {}) {
    var fields = this

    $.each(fields, function (index, item) {
        var input = $(item)
        let inputVal = input.val()
        let inputId = `${input.attr('id') ? input.attr('id') + '-' : 'field-'}${Math.floor(100000 + Math.random() * 900000)}`
        let maskInputId = `currency-input_${inputId}`
        let maskInput = `
            <input 
                id="${maskInputId}"
                class="form-control form-control-sm currency-input-mask" 
                value="${currencyFormat(inputVal)}">
        `

        if (!input.siblings('.currency-input-mask').length) {
            input.attr('data-currency-input-id', maskInputId)
            input.css({'opacity': '0', 'position': 'absolute', 'z-index': '-10'})
            input.parent().append(maskInput)
        }

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
        })

        $(`#${maskInputId}`).on('blur', input, function (e) {
            let maskInputVal = currencyFormat($(this).val(), true)
            changeParentValue(maskInputVal)
            $(this).val(currencyFormat(maskInputVal))
        })

        $(`input[data-currency-input-id="${maskInputId}"]`).change(function () {
            $(`#${maskInputId}`).val(currencyFormat($(this).val()))
        })

        function changeParentValue(value = 0) {
            input.val(value)
        }
    })
}

function currencyFormat(number = 0, isReversed = false) {
    let formatter = new Intl.NumberFormat("id-ID", {style: 'currency', currency: 'IDR'})

    if (isReversed) return number.replace(',00', '').replace(/\D/g,'')

    return formatter.format(number)
}