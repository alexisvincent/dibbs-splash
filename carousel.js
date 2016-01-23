function init() {
    var words = $('#carousel').children()

    function animate(word, index) {
        word.className = 'fade-in'

        setTimeout(function () {
            index++
            if (words.length == index) {
                index = 0
            }
            word.className = ''
            animate(words[index], index)
        }, 3000)
    }

    animate(words[0], 0)
}

init()